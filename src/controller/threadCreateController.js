const controller = {};
const models = require('../models')
const {where} = require('sequelize');

controller.postNewThread = async (req, res) => {
    const {  text,picture,created_at,creator,parent_thread,comment_notif_status} = req.body
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