const authService = require("../services/auth.service");
const {validationResult} = require("express-validator/check");

exports.signUp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.fields = errors.array();
        return next(error);
    }

    try {
        const user = authService.signUp(req);
        return res.status(201).json({message: "User created !", userId: user._id});
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        return next(err);
    }
}

exports.postLogin = async (req, res, next) => {
    try {
        const result = await authService.login(req);
        return res.status(200).json(result);
    } catch (err) {
        if (err === "401") {
            if (!err.statusCode) {
                const error = new Error("Wrong username or password.");
                error.statusCode = 401;
                return next(error);
            }
        } else {
            if (!err.statusCode)
                err.statusCode = 500;
            return next(err);
        }
    }

};


