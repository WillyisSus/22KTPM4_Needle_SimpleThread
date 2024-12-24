const DataTypes = require("sequelize").DataTypes;
const _FollowingFollower = require("./FollowingFollower");
const _Like = require("./Like");
const _NotificationStatus = require("./NotificationStatus");
const _Thread = require("./Thread");
const _User = require("./User");

function initModels(sequelize) {
    const NotificationStatus = _NotificationStatus(sequelize, DataTypes);
    const User = _User(sequelize, DataTypes);
    const Thread = _Thread(sequelize, DataTypes);
    const Like = _Like(sequelize, DataTypes);
    const FollowingFollower = _FollowingFollower(sequelize, DataTypes);

    Thread.belongsToMany(User, { as: 'user_id_users', through: Like, foreignKey: "thread_id", otherKey: "user_id" });
    User.belongsToMany(Thread, { as: 'thread_id_threads', through: Like, foreignKey: "user_id", otherKey: "thread_id" });
    User.belongsToMany(User, { as: 'follower_id_users', through: FollowingFollower, foreignKey: "followee_id", otherKey: "follower_id" });
    User.belongsToMany(User, { as: 'followee_id_users', through: FollowingFollower, foreignKey: "follower_id", otherKey: "followee_id" });
    FollowingFollower.belongsTo(NotificationStatus, { as: "notif_status_notification_status", foreignKey: "notif_status" });
    NotificationStatus.hasMany(FollowingFollower, { as: "following_followers", foreignKey: "notif_status" });
    Like.belongsTo(NotificationStatus, { as: "notif_status_notification_status", foreignKey: "notif_status" });
    NotificationStatus.hasMany(Like, { as: "likes", foreignKey: "notif_status" });
    Thread.belongsTo(NotificationStatus, { as: "comment_notif_status_notification_status", foreignKey: "comment_notif_status" });
    NotificationStatus.hasMany(Thread, { as: "threads", foreignKey: "comment_notif_status" });
    Like.belongsTo(Thread, { as: "thread", foreignKey: "thread_id" });
    Thread.hasMany(Like, { as: "likes", foreignKey: "thread_id" });
    Thread.belongsTo(Thread, { as: "parent_thread_thread", foreignKey: "parent_thread" });
    Thread.hasMany(Thread, { as: "threads", foreignKey: "parent_thread" });
    FollowingFollower.belongsTo(User, { as: "followee", foreignKey: "followee_id" });
    User.hasMany(FollowingFollower, { as: "following_followers", foreignKey: "followee_id" });
    FollowingFollower.belongsTo(User, { as: "follower", foreignKey: "follower_id" });
    User.hasMany(FollowingFollower, { as: "follower_following_followers", foreignKey: "follower_id" });
    Like.belongsTo(User, { as: "user", foreignKey: "user_id" });
    User.hasMany(Like, { as: "likes", foreignKey: "user_id" });
    Thread.belongsTo(User, { as: "creator_user", foreignKey: "creator" });
    User.hasMany(Thread, { as: "threads", foreignKey: "creator" });

    return {
        FollowingFollower,
        Like,
        NotificationStatus,
        Thread,
        User,
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
