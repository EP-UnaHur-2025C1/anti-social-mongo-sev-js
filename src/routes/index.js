const userRoute = require("./user.route");
const commentRoute = require("./comment.route");
const postRoute = require("./post.route");
const tagRoute = require("./tag.route");
const postImageRoute = require("./postImage.route");
const followRoute = require("./follow.route");


module.exports = { 
    userRoute,
    commentRoute,
    postImageRoute,
    postRoute,
    tagRoute,
    followRoute
};
