const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');
const Employee = require('./Employee'); 
const Training = require('./Training'); 

const Performance = sequelize.define('Performance', {
    emp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: 'id'
        }
    },
    training_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Training,
            key: 'id'
        }
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    trainer_feedback: {
        type: DataTypes.TEXT, // or DataTypes.STRING if you have a length constraint
        allowNull: true // Feedback can be null
    },
    employee_feedback: {
        type: DataTypes.FLOAT,
        allowNull: true // This can also be null
    }
}, {
    tableName: 'performance',
    timestamps: false
});


// Define relationships
Employee.hasMany(Performance, { foreignKey: 'emp_id' });
Training.hasMany(Performance, { foreignKey: 'training_id' });
Performance.belongsTo(Employee, { foreignKey: 'emp_id' });
Performance.belongsTo(Training, { foreignKey: 'training_id' });

module.exports = Performance;
