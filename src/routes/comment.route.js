const { Router } = require("express");
const { commentController } = require("../controllers");
const router = Router();

router.get("/", commentController.getComments);
router.get("/", commentController.getCommentById);
router.get("/", commentController.getCommentsByPost);
router.post("/", commentController.createComment);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
