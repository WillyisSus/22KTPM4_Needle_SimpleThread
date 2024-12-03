const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Thread.init(sequelize, DataTypes);
}

class Thread extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    thread_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    creator: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    parent_thread: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'thread',
        key: 'thread_id'
      }
    },
    comment_notif_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'notification_status',
        key: 'status_id'
      }
    }
  }, {
    sequelize,
    tableName: 'thread',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "thread_pkey",
        unique: true,
        fields: [
          { name: "thread_id" },
        ]
      },
    ]
  });
  }
}
