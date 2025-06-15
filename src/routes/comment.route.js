const { Router } = require("express");
const {commentController} = require("../controllers");
const router = Router();

router.get("/", commentController.getComments);
router.get("/:id", commentController.getCommentById);
router.get("/post/:id", commentController.getCommentsByPost);
router.post("/", commentController.createComment);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;