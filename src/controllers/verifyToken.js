const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(req, res, next) {
    //responder información solo cuando el usuario tiene authenticación
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        })
    }

    try {

        const decoded = jwt.verify(token, config.secret);
        req.userId = decoded.id;
        next();

    } catch (err) {
        res.status(401).json({
            auth: false,
            message: 'error with token' //token expiró
        })
    }




}

module.exports = verifyToken;