const Post = require("../models/post");
const helpers = require("../utils/helper");
const config = require("../utils/config");
const User = require("../models/user");

exports.getPosts = (req) => {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || config.defaultElmtPerPage);
    const startIndex = (page - 1) * limit;

    return Post.find().skip(startIndex).limit(limit)
        .populate('creator').sort({createdAt: -1});
};

exports.savePost = async (req) => {
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });
    try {
        const savedPost = await post.save();
        let user = await User.findById(req.userId);
        user.posts.push(post);
        user = await user.save();
        return Promise.resolve({
            message: "Post created successfully !",
            post: {...savedPost._doc, creator: {_id: req.userId, name: user.name}},
            creator: {_id: user._id, name: user.name}
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

exports.singlePost = (req) => {
    const postId = req.params.postId;
    return Post.findById(postId);
}

exports.updatePost = async (req) => {
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.file;

    try {
        const post = await Post.findById(postId).populate("creator");

        if (post.creator._id.toString() !== req.userId) {
            return Promise.reject({signal: "403", message: "Unauthorized action!"});
        }
        if (!post) {
            return Promise.reject({signal: "404", message: "No resource matching the criteria was found."});
        }
        if (imageUrl) {
            helpers.deleteFile(post.imageUrl);
        }
        post.title = title;
        if (imageUrl) {
            post.imageUrl = imageUrl.path;
        }
        post.content = content;
        return post.save();
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.deletePost = async (req) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        //check logged in user
        if (!post) {
            return Promise.reject({signal: "404", message: "No resource matching the criteria was found."});
        }
        if (post.creator.toString() !== req.userId) {
            return Promise.reject({signal: "403", message: "Unauthorized action!"});
        }

        helpers.deleteFile(post.imageUrl);
        const data = await Post.findByIdAndRemove(postId);
        let user = await User.findById(req.userId);
        user.posts.pull(postId);
        const savedUser = await user.save();
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject(error);
    }
}