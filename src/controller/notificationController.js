const controller = {};
const models = require('../models');
const { Op } = require('sequelize');

controller.showNotif = async (req, res) => {
    const user = await req.user;
    let notif = [];

    let follownotif = await models.FollowingFollower.findAll({
        attributes: ['follower_id', 'notif_status'],
        where: {
            followee_id: user
        }
    })
    follownotif.forEach(follow => {notif.push({thread_id: null, user_id: follow.follower_id, notif_id: follow.notif_status, type: 'follow'})});

    let userthread = await models.Thread.findAll({
        attributes: ['thread_id'],
        where: {
            creator: user
        }
    });
    let nthread = [];
    userthread.forEach(thread => {nthread.push(thread.thread_id)});

    let replynotifs = await models.Thread.findAll({
        attributes: ['thread_id', 'creator', 'comment_notif_status'],
        where: {
            parent_thread: {[Op.in]: nthread}
        }
    });
    replynotifs.forEach(reply => {notif.push({thread_id: reply.thread_id, user_id: reply.creator, notif_id: reply.comment_notif_status, type: 'reply'})});

    let likenotifs = await models.Like.findAll({
        attributes: ['thread_id', 'user_id', 'notif_status'],
        where: {
            thread_id: {[Op.in]: nthread}
        }
    });
    likenotifs.forEach(like => {notif.push({thread_id: like.thread_id, user_id: like.user_id, notif_id: like.notif_status, type: 'like'})});

    notif.sort((a, b) => {
        return b.notif_id - a.notif_id;
    });
    let notif_list = [];
    let user_list = [];
    notif.forEach(notif => {notif_list.push(notif.notif_id)});
    notif.forEach(notif => {user_list.push(notif.user_id)});

    let userlist = await models.User.findAll({
        attributes: ['user_id', 'display_name'],
        where: {
            user_id: {[Op.in]: user_list}
        }
    });
    let notiflist = await models.NotificationStatus.findAll({
        attributes: ['status_id', 'status_name'],
        where: {
            status_id: {[Op.in]: notif_list}
        }
    });

    notif.forEach(notifs => {Object.defineProperty(notifs, 'user_name', {value: userlist.find(user => user.user_id === notifs.user_id).display_name, writable: true})});
    notif.forEach(notifs => {Object.defineProperty(notifs, 'notif_name', {value: notiflist.find(notiflist => notiflist.status_id === notifs.notif_id).status_name, writable: true})});

    res.locals.notif = notif;
    res.render('notifications', {notiPage: true});
}

controller.markRead = async (req, res) => {
    const notif_id = req.body.notif_id;
    try {
        await models.NotificationStatus.update(
            {status_name: "seen"},
            {where: {status_id: notif_id}}
        );
        res.status(200).send('Sucess')
    } catch (error) {
        
    }
    
}
controller.markDel = async (req, res) => {
    const notif_id = req.body.notif_id;
    try {
        await models.NotificationStatus.update(
            {status_name: "deleted"},
            {where: {status_id: notif_id}}
        );
        res.status(200).send('Sucess')
    } catch (error) {
        
    }
   
}

module.exports = controller;