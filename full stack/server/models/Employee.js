const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    length_of_service: {
        type: DataTypes.INTEGER,
        allowNull: false,    
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'employees', // Matches the table name in the database
    timestamps: false
});

module.exports = Employee;
