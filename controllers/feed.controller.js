const {validationResult} = require("express-validator/check");
const Post = require("../models/post");
const postService = require("../services/posts.service");
const config = require("../utils/config");
const io = require("../socket");

exports.getPosts = async (req, res, next) => {
    try {
        const totalItems = await Post.find().countDocuments();
        const page = parseInt(req.query.page || "1");
        const itemsPerPage = parseInt(req.query.limit || config.defaultElmtPerPage);
        const posts = await postService.getPosts(req);
        return res.json({message: "Fetched posts successfully.", posts: posts, totalItems: totalItems});
    } catch (err) {
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
    if (!req.file) {
        const error = new Error("No image provided");
        error.statusCode = 422;
        return (next);
    }

    try {
        const response = await postService.savePost(req);
        //broadcast() sends event to all users except this one
        io.getIO().emit('posts', {action: 'create', post: response.post});

        return res.status(201).json(response);
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        return next(err);
    }
};

exports.getPost = async (req, res, next) => {
    try {
        const post = await postService.singlePost(req).populate("creator");
        if (!post) {
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

exports.putPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.fields = errors.array();
        return next(error);
    }
    try {
        const post = await postService.updatePost(req);
        io.getIO().emit('posts', {action: 'update', post: post});

        return res.json({message: "Post updated !", post: post});
    } catch (err) {
        if(err.signal){
            const error = new Error(err.message);
            error.statusCode = parseInt(err.signal);
            return next(error);
        }else{
            if (!err.statusCode)
                err.statusCode = 500;
            return next(err);
        }
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const post = await postService.deletePost(req);
        io.getIO().emit('posts', {action: 'delete', post: req.params.postId});
        return res.json({message: "Deleted post."});
    } catch (err) {
        if(err.signal){
            const error = new Error(err.message);
            error.statusCode = parseInt(err.signal);
            return next(error);
        }else{
            if (!err.statusCode)
                err.statusCode = 500;
            return next(err);
        }
    }
}

