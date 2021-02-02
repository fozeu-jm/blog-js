const Post = require("../models/post");

exports.getPosts = () => {
 return Post.find();
};

exports.savePost = (req) => {
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: "uploads/book.jpg",
        creator: {name: 'JeanMarie'},
    });
    return post.save();
};

exports.singlePost = (req) => {
    const postId = req.params.postId;
    return Post.findById(postId);
}
