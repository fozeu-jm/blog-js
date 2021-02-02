const express = require("express");
const router = express.Router();
const feedsController = require("../controllers/feed.controller");
const {body} = require("express-validator");
const isAuth = require("../middlewares/is-auth");

router.get("/posts", isAuth, feedsController.getPosts);

router.post("/post", isAuth,  [
    body("title").trim().isLength({min: 5}).withMessage("title should be at least 5 characters long"),
    body("content").trim().isLength({min: 5}).withMessage("content should be at least 5 characters long")
], feedsController.createPost);

router.get('/post/:postId', isAuth, feedsController.getPost);

router.put("/post/:postId", isAuth,  [
    body("title").trim().isLength({min: 5}).withMessage("title should be at least 5 characters long"),
    body("content").trim().isLength({min: 5}).withMessage("content should be at least 5 characters long")
], feedsController.putPost)

router.delete("/post/:postId", isAuth, feedsController.deletePost);

module.exports = router;