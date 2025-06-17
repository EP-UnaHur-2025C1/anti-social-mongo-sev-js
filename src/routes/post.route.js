const { Router } = require("express");
const { postController } = require("../controllers");
const { fileFilter } = require("../aditionalFunctions/image");
const multer = require("multer");

const router = Router();
const upload = multer({
  dest: "uploads/",
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 4 },
});
//rutas get
router.get("/full/:id", postController.getPostwithImagesTagsCommentsById);
router.get("/:id", postController.getPostById);
router.get("/", postController.getPosts);
//post
router.post("/", upload.array("images", 6), postController.createPost);

//put
router.put("/:id", upload.array("images", 6), postController.updatePost);
router.put(
  "/:id/images",
  upload.array("images", 6),
  postController.updatePostImagesById
);
//patch - agregar tags a post
router.patch("/addTags/:id", postController.addTagsToPost);
//delete
router.delete("/:id/:imageId", postController.deletePostImage);
router.delete("/:id", postController.deleteById);

module.exports = router;
