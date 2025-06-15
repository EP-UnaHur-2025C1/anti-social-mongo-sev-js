const { Router } = require("express");
const { postController } = require("../controllers");
const router = Router();
const { fileFilter } = require('../aditionalFunctions/image')
const multer = require('multer')

const upload = multer ({ dest: 'uploads/', fileFilter, limits: { fileSize: 1024 * 1024 * 4 }})


router.get("/", 
    postController.getPosts
);

router.get("/:id", 
    postController.getPostById
);

router.get("/full/:id", 
    postController.getPostwithImagesTagsById
);

router.post("/", 
    upload.array('images', 6),
    postController.createPost
);

router.put("/:id", 
    upload.array('images', 6),
    postController.updatePost
);

router.delete("/:id", 
    postController.deleteById
);

router.delete("/:id/:imageId", 
    postController.deletePostImage
);

router.put("/:id/images", 
    upload.array('images', 6),
    postController.updatePostImagesById
);

module.exports = router;
