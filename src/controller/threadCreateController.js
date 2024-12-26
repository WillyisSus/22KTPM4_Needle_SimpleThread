const controller = {};
const { json } = require('express');
const models = require('../models');
const { QueryTypes } = require('sequelize');


function buildThreadQuery(only_following, is_creator_specified) {
    const only_following_replacement = only_following ? `FF.FOLLOWER_ID = :session_user_id AND` : ``;

    const thread_creator_replacement = is_creator_specified ? `THREAD.CREATOR = :thread_creator AND` : ``;

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
	COUNT(DISTINCT CHILD_THREAD.THREAD_ID) AS NREPLIES
FROM
	PUBLIC.THREAD THREAD
	JOIN PUBLIC."user" "user" ON THREAD.CREATOR = "user".USER_ID
	LEFT JOIN PUBLIC.FOLLOWING_FOLLOWER FF ON "user".USER_ID = FF.FOLLOWEE_ID
	LEFT JOIN PUBLIC.LIKE "like" ON THREAD.THREAD_ID = "like".THREAD_ID
	LEFT JOIN PUBLIC.THREAD CHILD_THREAD ON THREAD.THREAD_ID = CHILD_THREAD.PARENT_THREAD
WHERE
	${only_following_replacement}
    ${thread_creator_replacement}
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

controller.postNewThread = async (req, res) => {
    let user = await req.user;
    console.log(user);
    const { text, picture, created_at, parent_thread, comment_notif_status } = req.body
    console.log(text)
    try {
        await models.Thread.create({
            text: text,
            picture: picture,
            created_at: created_at,
            creator: user,
            parent_thread: parent_thread,
            comment_notif_status: comment_notif_status
        })
        res.status(201).send("created")

    } catch (error) {
        console.log(error)
        res.status(500).send("Cannot be updated")
    }
}
controller.postThreadReply = async (req, res) => {
    console.log(req.body)
    res.render("home-feed")
}

module.exports = controller