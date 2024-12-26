const controller = {};
const { json } = require('express');
const models = require('../models');
const { QueryTypes } = require('sequelize');


controller.getCurrentUserThreads = async (req, res) => {
    try {
        const session_user_id = await req.user;
        const min_thread_id = parseInt(req.query.min_thread_id) || 0;
        const max_thread_id = parseInt(req.query.max_thread_id) || 0;

        let threads = await models.sequelize.query(`select * from public.thread join public."user" on creator = user_id where user_id = :session_user_id and thread_id < :min_thread_id or thread_id > :max_thread_id order by thread_id desc limit 20`, {
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


controller.getFeedThreads = async (req, res) => {
    try {
        const session_user_id = await req.user;
        const min_thread_id = parseInt(req.query.min_thread_id) || 0;
        const max_thread_id = parseInt(req.query.max_thread_id) || 0;
        const page = req.query.page || 0;

        let threads = await models.sequelize.query(`select * from public.thread join public."user" on creator = user_id where thread_id < :min_thread_id or thread_id > :max_thread_id order by thread_id desc limit 20`, {
            replacements: { min_thread_id, max_thread_id },
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
    const { text, picture, created_at, creator, parent_thread, comment_notif_status } = req.body
    console.log(text)
    try {
        await models.Thread.create({
            text: text,
            picture: picture,
            created_at: created_at,
            creator: creator,
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