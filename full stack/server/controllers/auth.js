const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const login = async (req, res) => {
    const { username, password, role } = req.body;
    if(role === 'admin'){
        if (username !== 'root' || password !== '123') {
            return res.status(404).json({msg: 'Invalid credentials'});
        }
        const token = jwt.sign({ name: username }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
        return res.status(200).json({ msg: 'success', token});
    }
    else {
        const emp = await Employee.findAll({
            where: {
                email: username
            }
        })
        console.log(emp.password);
        
        if(emp.length === 0 || (emp.length > 0 && emp[0].password != password)) {
            return res.status(404).json({msg: 'Invalid credentials'});
        }
        const token = jwt.sign({ id: emp[0].id, role: "employee" }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
        return res.status(200).json({ msg: 'success', token});
    }
}

module.exports = {login}