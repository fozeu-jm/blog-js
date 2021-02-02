const bcrypt = require('bcryptjs');
const User = require("../models/user");
const privateConfigs = require("../secrets/config");
const jwt = require("jsonwebtoken");

exports.signUp = async (req) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    try {
        const hashedPass = await bcrypt.hash(password, 12);
        const newUser = new User({email: email, password: hashedPass, name: name});
        return newUser.save();
    } catch (err) {
        return Promise.reject(err);
    }
}

exports.login = async (req) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email: email});
        if (!user) {
            return Promise.reject("401");
        }
        const doMatch = await bcrypt.compare(password, user.password);
        if(doMatch){
            const token = jwt.sign({
                email: user.email,
                userId: user._id.toString()
            }, privateConfigs.secretKey, {expiresIn: "1h"});
            return Promise.resolve({token: token, userId: user._id.toString()});
        }else{
            return Promise.reject("401");
        }
    }catch (error) {
        return Promise.reject(error);
    }
};