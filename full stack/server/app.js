require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");


//Database
const sequelize = require('./db/connect');
const auth = require('./routes/auth')
const admin = require('./routes/admin')
const employee = require('./routes/employee')

const authMiddleware = require('./middleware/auth')
const employeeMiddleware = require('./middleware/emp')

app.use(express.json());
app.use(cors());

//routes
// app.options("*",cors());
app.use('/api/v1/auth', auth);
app.use('/api/v1/admin', admin);
app.use('/api/v1/employee', employeeMiddleware, employee)

const port = process.env.PORT || 5000;


const start = async() => {
    try {
        await sequelize.authenticate();
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
        await sequelize.sync();
    } catch (error) {
        console.log(error);
    }
};

start();