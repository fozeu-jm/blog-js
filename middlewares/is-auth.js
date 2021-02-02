const jwt = require("jsonwebtoken");
const privateConfigs = require("../secrets/config");


module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error("Unauthorized access !");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, privateConfigs.secretKey);
    }catch (err) {
        err.statusCode = 500;
    }
    if(!decodedToken){
        const error = new Error("Unauthorized access !");
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};