const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Like.init(sequelize, DataTypes);
}

class Like extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    thread_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'thread',
        key: 'thread_id'
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
    tableName: 'like',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "like_pkey",
        unique: true,
        fields: [
          { name: "user_id" },
          { name: "thread_id" },
        ]
      },
    ]
  });
  }
}
