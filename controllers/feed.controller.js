const {validationResult} = require("express-validator/check")
const postService = require("../services/posts.service");


exports.getPosts = async (req, res, next) => {
    try {
        const posts = await postService.getPosts();
        return res.json({message: "Fetched posts successfully.", posts:posts});
    }catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        return next(err);
    }
};

exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.fields = errors.array();
        return next(error);
    }

    try {
        const response = await postService.savePost(req);
        return res.json({
            message: "Post created successfully !",
            post: response
        });
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        return next(err);
    }
};

exports.getPost = async (req, res, next) => {
    try {
        const post = await postService.singlePost(req);
        if(!post){
            const error = new Error("No resource matching the criteria was found.");
            error.statusCode = 404;
            return next(error);
        }
        return res.json({message: "Post fetched", post: post});
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        return next(err);
    }
};