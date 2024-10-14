const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee')

const employee = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(404).json({msg: 'Authentication failed'});
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const emp_id = payload["id"]
        console.log(emp_id);
        
        const emp = await Employee.findOne({
            where: {id: emp_id}
        })
        
        if (emp.length === 0) {
            return res.status(404).json({msg: 'Authentication failed'});
        }
        req.user = {id: payload.id, role: payload.role};
        next();
    } catch (error) {
        return res.status(404).json({msg: 'Authentication invalid', error: error});
    }
}

module.exports = employee;