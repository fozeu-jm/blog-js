const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {body} = require("express-validator");
const User = require("../models/user");

router.post("/signup",  [
    body("email").isEmail().withMessage("Invalid email address !")
        .custom((value) => {
            return User.findOne({email: value}).then(user => {
                if (user) {
                    return Promise.reject("Email already exist");
                }
            });
        }).normalizeEmail({gmail_remove_dots:false}),
    body("password").isStrongPassword({minLength:5}).withMessage("Password should be at least 5 characters " +
        "and contain a uppercase letter, number and a symbol").trim(),
    body("name").trim().not().isEmpty()
], authController.signUp);

router.post('/login', authController.postLogin);

module.exports = router;