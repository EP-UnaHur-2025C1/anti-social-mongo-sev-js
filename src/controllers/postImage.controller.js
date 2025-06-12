const PostImage = require('../models/postImage')
const { saveImage, deleteImage } = require('../aditionalFunctions/image')

const getAllPostImages = async (req, res) => {
  try {
    const images = await PostImage.find({});
    res.status(200).json(images);
  } catch(e) {
    res.status(500).json({message: "Ocurrió un error en el servidor", error: e.message})
  }
};

const createPostImages = async (req, res) => {
    try {
      const { postId } = req.body;

      req.files.map(file => saveImage(file))

      const newImages = req.files.map((file) => ({
        imageUrl: file.destination + file.originalname, 
        postId,
      }));
      const createdImages = await PostImage.create(newImages);

      res.status(201).json(createdImages);
    } catch(e) {
      res.status(500).json({message: "Ocurrió un error en el servidor", error: e.message})
    }
};

const updatePostImage = async (req, res) => {
    try {
      const { id } = req.params;
      
      saveImage(req.file)
      const image = await PostImage.findOneAndUpdate({_id: id}, {$set: {imageUrl: req.file.destination + req.file.originalname}}, { runValidators: true })
      deleteImage(image.imageUrl)
      res.status(201).json(image);
    } catch(e) {
      res.status(500).json({message: "Ocurrió un error en el servidor", error: e.message})
    }
};

const deleteById = async (req, res) => {
    try { 
      const { id } = req.params;
      const data = await PostImage.findOneAndDelete({_id: id});
      res.status(200).json(data);
    } catch(e) {
      res.status(500).json({message: "Ocurrió un error en el servidor", error: e.message})
    }
};

module.exports = { getAllPostImages, createPostImages, updatePostImage, deleteById }
