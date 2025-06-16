const PostImage = require('../models/postImage')
const Post = require('../models/post')
const { saveImage, deleteImage } = require('../aditionalFunctions/image')
const mongoose = require("mongoose");

const getAllPostImages = async (req, res) => {
  try {
    const images = await PostImage.find({}).select('-__v');
    res.status(200).json(images);
  } catch(e) {
    res.status(500).json({message: "Ocurrió un error en el servidor", error: e.message})
  }
};

const createPostImages = async (req, res) => {
    try {
      const { postId } = req.body;

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const post = await Post.findById(postId)
      if (!post) {
      return res.status(404).json({ message: "Post inexistente" });
      }

      req.files.map(file => saveImage(file))

      const newImages = req.files.map((file) => ({
        imageUrl: file.destination + file.originalname, 
        postId,
      }));
      await PostImage.create(newImages) 
      const idImages = await PostImage.find({postId}).select('_id')
      await Post.updateOne({_id: postId}, {$push: {images: idImages}})
      res.status(201).json(post);
    } catch(e) {
      res.status(500).json({message: "Ocurrió un error en el servidor", error: e.message})
    }
};

const updatePostImage = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      saveImage(req.file)
      const image = await PostImage.findOneAndUpdate({_id: id}, {$set: {imageUrl: req.file.destination + req.file.originalname}}, { runValidators: true })
      deleteImage(image.imageUrl)
      const imageId = await PostImage.findById(id).select('id')
      await Post.updateOne({_id: id}, {$push: {images: imageId}})
      res.status(201).json({message: "Imagen actualizada correctamente"});
    } catch(e) {
      res.status(500).json({message: "Ocurrió un error en el servidor", error: e.message})
    }
};

const deleteById = async (req, res) => {
    try { 
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const data = await PostImage.findOneAndDelete({_id: id}).select('postId -_id');
      // Hay que eliminar del array de images en post la imagen borrada
      res.status(200).json(data);
    } catch(e) {
      res.status(500).json({message: "Ocurrió un error en el servidor", error: e.message})
    }
};

module.exports = { getAllPostImages, createPostImages, updatePostImage, deleteById }
