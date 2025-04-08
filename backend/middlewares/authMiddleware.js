const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = async (req, res, next) =>{
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'user not fount'
            })
        }

        req.user = user;
        next();

    }catch(err){
        console.log("Error: authenticate middleware");
        console.log(err);
        return res.status(401).json({
            success: false,
            message: 'Token is not valid',
            error: err.message
        })
    }
}


module.exports = authenticate;