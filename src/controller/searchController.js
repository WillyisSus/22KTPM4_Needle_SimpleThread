const controller = {};
const models = require('../models');
const { Op } = require('sequelize');

controller.showSearchPage = async (req, res) => {
    const user = await req.user;
    let user_list = [];
    if (Object.keys(req.query).length === 0) {
        user_list = []
    } else {
        user_list = await models.User.findAll({
            where: {
                [Op.or]: {
                    username: {[Op.like]: "%" + req.query.keyword + "%"},
                    display_name: {[Op.like]: "%" + req.query.keyword + "%"}},
                [Op.not]: {user_id: user}
            }
        });
    }

    let user_id_list = [];
    user_list.forEach(user => { user_id_list.push(user.user_id) });
    let follow_list = await models.FollowingFollower.findAll({
        where: {
            followee_id: {[Op.in]: user_id_list},
            follower_id: user
        }
    });
    user_list.forEach(users => {Object.defineProperty(users, 'is_followed', {value: follow_list.find(follow => follow.followee_id === users.user_id) ? true : false, writable: true})});

    res.locals.user = user_list;
    res.render("search");
}

module.exports = controller;