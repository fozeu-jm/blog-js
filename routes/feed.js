const express = require("express");
const router = express.Router();
const feedsController = require("../controllers/feed.controller");
const {body} = require("express-validator");

router.get("/posts",feedsController.getPosts);

router.post("/post",  [
    body("title").trim().isLength({min: 5}).withMessage("title should be at least 5 characters long"),
    body("content").trim().isLength({min: 5}).withMessage("content should be at least 5 characters long")
], feedsController.createPost);

router.get('/post/:postId', feedsController.getPost);

module.exports = router;