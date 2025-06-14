const { Router } = require("express");
const router = Router();
const { postImageController } = require("../controllers");
const { fileFilter } = require('../aditionalFunctions/image')


const multer = require('multer')
const upload = multer ({ dest: 'uploads/', fileFilter, limits: { fileSize: 1024 * 1024 * 4 }})

router.get("/", 
    postImageController.getAllPostImages
);

router.post("/", 
    upload.array('images', 6),
    postImageController.createPostImages
);

router.put("/:id", 
    upload.single('image'),
    postImageController.updatePostImage
);

router.delete("/:id", 
    postImageController.deleteById
);


module.exports =  router ;