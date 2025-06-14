const { Router } = require("express");
const commentController = require("../controllers/comment");
const router = Router();


router.get("/", commentController.createComment);
router.get("/", commentController.getCommentById);
router.get("/", getCommentsByPost);
router.post("/", commentController.createComment);
router.put("/:id",commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;