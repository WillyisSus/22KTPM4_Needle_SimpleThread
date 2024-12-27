const { sequelize, Sequelize } = require("../models");
const models = require("../models");

const controller = {};

controller.show = async (req, res) => {
    try {
        const user_id = await req.user;
        const user = await models.User.findByPk(user_id);

        const nFollowers = await models.FollowingFollower.count({
            where: {
                followee_id: user.user_id
            }
        });

        const nFollowings = await models.FollowingFollower.count({
            where: {
                follower_id: user.user_id
            }
        });

        user.nFollowers = nFollowers;
        user.nFollowings = nFollowings;

        res.locals.followers = await models.FollowingFollower.findAll({
            where: {
                followee_id: user.user_id
            },
            include: {
                model: models.User,
                as: "follower",

            },
        });

        res.locals.followings = await models.FollowingFollower.findAll({
            where: {
                follower_id: user.user_id
            },
            include: {
                model: models.User,
                as: "followee"
            },
        });

        res.locals.user = user;

        res.render("cur-profile", { profilePage: true });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

controller.put = async (req, res) => {
    try {
        const user_id = await req.user;
        const user = await models.User.findByPk(user_id);

        const { username, bio, avatar } = req.body;
        console.log(username);
        if (username) {

            if (!new RegExp(/^[a-zA-Z0-9]{6,32}$/, "i").exec(username)) {
                res.status(400).send("Username must be between 6 to 32 characters and contain only letters and numbers.");
                return;
            }

            if (await models.User.findOne({ where: { username } })) {
                res.status(400).send("This username has been taken");
                return;
            }

            user.username = username;
        }
        if (bio) {
            user.bio = bio;
        }
        if (avatar) {
            user.avatar = avatar;
        }

        await models.User.update({
            username: user.username,
            bio: user.bio,
            avatar: user.avatar
        }, {
            where: {
                user_id: user.user_id
            }
        });
        res.status(200).send("User updated");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }


};

controller.deleteAvatar = async (req, res) => {
    try {
        const user_id = await req.user;

        await models.User.update({
            avatar: "/images/avatar.png"
        }, {
            where: {
                user_id
            }
        });
        res.status(200).send("Avatar deleted");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }

};


controller.getFollowers = async (req, res) => {
    try {
        const user_id = await req.user;
        const user = await models.User.findByPk(user_id);
        const page = req.query.page || 0;

        followers = await models.FollowingFollower.findAll({
            where: {
                followee_id: user.user_id
            },
            include: {
                model: models.User,
                as: "follower",
            },
            offset: page * 20,
            limit: 20,
            raw: true,
            attributes: [Sequelize.col("follower.display_name"), Sequelize.col("follower.username"), Sequelize.col("follower.avatar")]

        });

        res.status(200).json(followers);

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

controller.getFollowees = async (req, res) => {
    try {
        const user_id = await req.user;
        const user = await models.User.findByPk(user_id);
        const page = req.query.page || 0;

        followees = await models.FollowingFollower.findAll({
            where: {
                follower_id: user.user_id
            },
            include: {
                model: models.User,
                as: "followee",
            },
            offset: page * 20,
            limit: 20,
            raw: true,
            attributes: [Sequelize.col("followee.display_name"), Sequelize.col("followee.username"), Sequelize.col("followee.avatar")]
        });

        res.status(200).json(followees);

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};


module.exports = controller;