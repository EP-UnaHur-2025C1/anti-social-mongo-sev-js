const userController = require("./user.controller");
const commentController = require("./comment.controller");
const postController = require("./post.controller");
const tagController = require("./tag.controller");
const postImageController = require("./postImage.controller");
const followController = require("./follow.controller");


module.exports = { 
    userController,
    commentController,
    postController,
    tagController,
    postImageController,
    followController
};
