const userController = require("./user.controller");
const postController = require("./post.controller");
const tagController = require("./tag.controller");
const postImageController = require("./postImage.controller");
const followController = require("./follow.controller");


module.exports = { 
    userController, 
    postController,
    tagController,
    postImageController,
    followController
};
