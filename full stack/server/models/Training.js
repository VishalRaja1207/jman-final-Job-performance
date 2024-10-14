const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');

const Training = sequelize.define('Training', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'trainings',
    timestamps: false
});

module.exports = Training;
