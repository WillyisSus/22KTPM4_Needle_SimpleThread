const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    return NotificationStatus.init(sequelize, DataTypes);
}

class NotificationStatus extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({
            status_id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            status_name: {
                type: DataTypes.ENUM('new', 'seen', 'deleted'),
                allowNull: false
            },
            action_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.Sequelize.fn('now')
            }
        }, {
            sequelize,
            tableName: 'notification_status',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: "notification_status_pkey",
                    unique: true,
                    fields: [
                        { name: "status_id" },
                    ]
                },
            ]
        });
    }
}
