const controller = {};
const { json } = require('express');
const models = require('../models');
const { QueryTypes } = require('sequelize');
const { sequelize, Sequelize } = require("../models");


function buildThreadQuery(only_following, is_creator_specified, is_thread_parent_specified, is_thread_id_specified) {
    const only_following_replacement = only_following ? `FF.FOLLOWER_ID = :session_user_id AND` : ``;

    const thread_creator_replacement = is_creator_specified ? `THREAD.CREATOR = :thread_creator AND` : ``;

    const thread_parent_replacement = is_thread_parent_specified ? `THREAD.PARENT_THREAD = :thread_parent AND` : ``;

    const thread_id_replacement = is_thread_id_specified ? `THREAD.THREAD_ID = :thread_id AND` : ``;

    return `
    SELECT
        THREAD.THREAD_ID,
        THREAD.TEXT,
        THREAD.PICTURE,
        THREAD.CREATED_AT,
        DISPLAY_NAME,
        USERNAME,
        AVATAR,
        BIO,
        SUM(
            CASE
                WHEN FF.FOLLOWER_ID = :session_user_id THEN 1
                ELSE 0
            END
        ) > 0 OR THREAD.CREATOR = :session_user_id AS IS_FOLLOWING,
        COUNT(DISTINCT FF.FOLLOWER_ID) AS NFOLLOWERS,
        COUNT(DISTINCT "like".USER_ID) AS NLIKES,
        COUNT(DISTINCT CHILD_THREAD.THREAD_ID) AS NREPLIES,
        SUM(
            CASE
                WHEN "like".USER_ID = :session_user_id THEN 1
                ELSE 0
            END
        ) > 0 AS HAVE_LIKED
    FROM
        PUBLIC.THREAD THREAD
        JOIN PUBLIC."user" "user" ON THREAD.CREATOR = "user".USER_ID
        LEFT JOIN PUBLIC.FOLLOWING_FOLLOWER FF ON "user".USER_ID = FF.FOLLOWEE_ID
        LEFT JOIN PUBLIC.LIKE "like" ON THREAD.THREAD_ID = "like".THREAD_ID
        LEFT JOIN PUBLIC.THREAD CHILD_THREAD ON THREAD.THREAD_ID = CHILD_THREAD.PARENT_THREAD
    WHERE
        ${only_following_replacement}
        ${thread_creator_replacement}
        ${thread_parent_replacement}
        ${thread_id_replacement}
        (
            THREAD.THREAD_ID < :min_thread_id
            OR THREAD.THREAD_ID > :max_thread_id
        )
    GROUP BY
        THREAD.THREAD_ID,
        THREAD.TEXT,
        THREAD.PICTURE,
        THREAD.CREATED_AT,
        DISPLAY_NAME,
        USERNAME,
        AVATAR,
        BIO
    ORDER BY
        THREAD.THREAD_ID DESC
    LIMIT
        20
    `;
}

controller.getCurrentUserThreads = async (req, res) => {
    try {
        const session_user_id = await req.user;
        const min_thread_id = parseInt(req.query.min_thread_id) || 0;
        const max_thread_id = parseInt(req.query.max_thread_id) || 0;

        let threads = await models.sequelize.query(buildThreadQuery(false, true), {
            replacements: { min_thread_id, max_thread_id, session_user_id, thread_creator: session_user_id },
            type: QueryTypes.SELECT
        });

        console.log(min_thread_id, max_thread_id);


        res.status(200).json(threads);

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
}
controller.getUserThreads = async (req, res) => {
    try {
        const session_user_id = await req.user;
        const user_id = req.params.user_id;
        const min_thread_id = parseInt(req.query.min_thread_id) || 0;
        const max_thread_id = parseInt(req.query.max_thread_id) || 0;

        let threads = await models.sequelize.query(buildThreadQuery(false, true), {
            replacements: { min_thread_id, max_thread_id, session_user_id, thread_creator: user_id },
            type: QueryTypes.SELECT
        });

        console.log(min_thread_id, max_thread_id);


        res.status(200).json(threads);

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
}

controller.getFeedThreads = async (req, res) => {
    try {
        const session_user_id = await req.user;
        const min_thread_id = parseInt(req.query.min_thread_id) || 0;
        const max_thread_id = parseInt(req.query.max_thread_id) || 0;
        const page = req.query.page || 0;
        const only_following = req.query.only_following === "true";

        let threads = await models.sequelize.query(buildThreadQuery(only_following, false), {
            replacements: { min_thread_id, max_thread_id, session_user_id },
            type: QueryTypes.SELECT
        });

        console.log(min_thread_id, max_thread_id);


        res.status(200).json(threads);

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
}

controller.getReplies = async (req, res) => {
    try {
        const session_user_id = await req.user;
        const min_thread_id = parseInt(req.query.min_thread_id) || 0;
        const max_thread_id = parseInt(req.query.max_thread_id) || 0;
        const thread_id = req.params.thread_id;



        let threads = await models.sequelize.query(buildThreadQuery(false, false, true), {
            replacements: { min_thread_id, max_thread_id, session_user_id, thread_parent: thread_id },
            type: QueryTypes.SELECT
        });

        if (min_thread_id === 0 && max_thread_id === 0) {
            threads.unshift(...await models.sequelize.query(buildThreadQuery(false, false, false, true), {
                replacements: { min_thread_id, max_thread_id, session_user_id, thread_id },
                type: QueryTypes.SELECT
            }));
        }




        console.log(min_thread_id, max_thread_id);


        res.status(200).json(threads);

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
}

controller.postNewThread = async (req, res) => {
    let user = await req.user;
    console.log(user);
    const { text, picture, created_at, parent_thread, comment_notif_status } = req.body
    console.log(text)
    try {
        await models.Thread.create({
            text: text,
            picture: (picture ? process.env.IMAGE_SERVER + picture : null),
            created_at: created_at,
            creator: user,
            parent_thread: parent_thread,
            comment_notif_status: comment_notif_status
        })
        res.status(200).send("created")

    } catch (error) {
        console.log(error)
        res.status(500).send("Cannot be updated")
    }
}
controller.postThreadReply = async (req, res) => {
    const { text = "", parent_thread = -1 } = req.body;
    const user = await req.user;
    console.log(req.body)
    try {
        const notif_status = await models.NotificationStatus.create({
            status_name: "new"
        });
        const reply = await models.Thread.create({
            creator: user,
            parent_thread: parent_thread,
            text: text,
            comment_notif_status: notif_status.status_id,
        })
        if (reply) {
            res.status(200).send("/thread/" + reply.thread_id);
        } else {
            res.status(500).send('Something bad happened')
        }
    } catch (error) {
        res.status(500).send('Some thing bad happen')

    }
}

controller.like = async (req, res) => {
    try {
        const session_user_id = await req.user;
        const thread_id = req.params.thread_id;

        await sequelize.transaction(async () => {
            const notif_status = await models.NotificationStatus.create({
                status_name: "new"
            });
            await models.Like.create({
                thread_id,
                user_id: session_user_id,
                notif_status: notif_status.status_id
            });
        });

        res.status(200).send("Liked");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}

controller.unlike = async (req, res) => {
    try {
        const session_user_id = await req.user;
        const thread_id = req.params.thread_id;

        await sequelize.transaction(async () => {


            const notif_status = await models.Like.findOne({
                where: {
                    thread_id,
                    user_id: session_user_id
                }
            });

            await models.Like.destroy({
                where: {
                    thread_id,
                    user_id: session_user_id
                }
            });

            await models.NotificationStatus.destroy({
                where: {
                    status_id: notif_status.notif_status
                }
            });


        });

        res.status(200).send("Unliked");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}

module.exports = controller