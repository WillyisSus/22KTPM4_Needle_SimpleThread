const controller = {};
const models = require('../models')
const {where} = require('sequelize');
controller.handleThreadMedia = async (req, res) => {

}
controller.postNewThread = async (req, res) => {
    console.log(req.body)
}


controller.postThreadReply = async (req, res) => {
    console.log(req.body)
    res.render("home-feed")
}

module.exports = controller