const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return FollowingFollower.init(sequelize, DataTypes);
}

class FollowingFollower extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    follower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    followee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    notif_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'notification_status',
        key: 'status_id'
      }
    }
  }, {
    sequelize,
    tableName: 'following_follower',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "following_follower_pkey",
        unique: true,
        fields: [
          { name: "follower_id" },
          { name: "followee_id" },
        ]
      },
    ]
  });
  }
}
