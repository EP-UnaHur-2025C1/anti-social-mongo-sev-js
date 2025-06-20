const { Router } = require("express");
const { postController } = require("../controllers");
const validarObjectId = require('../middlewares/validatorObjectId');
const router = Router();

router.get("/", postController.getPosts);
router.get("/:id", validarObjectId, postController.getPostById);
router.post("/", postController.createPost);
router.put("/:id", validarObjectId, postController.updatePost);
router.delete("/:id", validarObjectId,postController.deleteById);

module.exports = router;
