const { Router } = require("express");
const { postController } = require("../controllers");
const router = Router();

router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deleteById);

module.exports = router;
