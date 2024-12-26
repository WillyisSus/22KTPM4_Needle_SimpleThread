const { sequelize, Sequelize } = require("../models");
const models = require("../models");

const controller = {};

controller.show = async (req, res) => {
    try {
        const session_user_id = await req.user;
        const user = await models.User.findOne({
            where: {
                username: req.params.username
            }
        });

        const session_user = await models.User.findByPk(session_user_id);

        if (session_user.username === user.username) {
            return res.redirect("/cur-profile");
        }

        const nFollowers = await models.FollowingFollower.count({
            where: {
                followee_id: user.user_id
            }
        });

        const isFollowing = await models.FollowingFollower.findOne({
            where: {
                followee_id: user.user_id,
                follower_id: session_user_id
            }
        });

        user.isFollowing = isFollowing ? true : false;
        user.nFollowers = nFollowers;

        res.locals.user = user;

        res.render("profile");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

controller.follow = async (req, res) => {
    try {
        const session_user_id = await req.user;
        const user = await models.User.findOne({
            where: {
                username: req.params.username
            }
        });

        const followee_id = user.user_id;
        const follower_id = session_user_id;

        const notif_status = await models.NotificationStatus.create({
            status_name: "new"
        });

        await models.FollowingFollower.create({
            followee_id,
            follower_id,
            notif_status: notif_status.status_id
        });

        res.status(200).send("Followed");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }

};


controller.unfollow = async (req, res) => {
    try {
        const session_user_id = await req.user;

        const user = await models.User.findOne({
            where: {
                username: req.params.username
            }
        });

        const followee_id = user.user_id;
        const follower_id = session_user_id;

        await sequelize.transaction(async () => {
            const notif_status_id = await models.FollowingFollower.findOne({
                where: {
                    followee_id,
                    follower_id
                }
            });

            await models.FollowingFollower.destroy({
                where: {
                    followee_id,
                    follower_id
                }
            });

            await models.NotificationStatus.destroy({
                where: {
                    status_id: notif_status_id.notif_status
                }
            });

        });



        res.status(200).send("Unfollowed");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }

};

module.exports = controller;
