const PostImage = require('../models/postImage')
const Post = require('../models/post')
const { saveImage, deleteImage } = require('../aditionalFunctions/image')
const mongoose = require("mongoose");

const getAllPostImages = async (req, res) => {
  try {
    const images = await PostImage.find({}).select('-__v');
    res.status(200).json(images);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Ocurrió un error en el servidor", error: e.message });
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
        postId,
        imageUrl: file.destination + file.originalname, 
      }));

      const createdImages = await PostImage.create(newImages); 
      post.images.push(createdImages.map((img) => img._id))
      await post.save()
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

      const image = await PostImage.findById(id)
      deleteImage(image.imageUrl.toString()); // Borro la imagen anterior de la carpeta uploads
      image.imageUrl = req.file.destination + req.file.originalname // Actualizo la url por la nueva
      image.save()
      saveImage(req.file)  // Guardo la nueva imagen en la carpeta uploads
      const post =  await Post.findById(image.postId);

      post.images.pull(id)   // Quito la imagen anterior del array en post
      post.images.push(image._id)   // Agrego la imagen nueva al array en post
      await post.save()
      res.status(201).json({message: `Imagen actualizada correctamente ${image.imageUrl}`});
    } catch(e) {
      res.status(500).json({message: "Ocurrió un error en el servidor", error: e.message})
    }
};

const deleteById = async (req, res) => {
    try { 
      const { postId, id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const oldImage = await PostImage.findOneAndDelete({_id: id});
      const post = await Post.findById(postId);
      deleteImage(oldImage.imageUrl.toString());
      post.images.pull(id)
      await post.save()
      res.status(200).json("Imagen eliminada correctamente", post);
    } catch(e) {
      res.status(500).json({message: "Ocurrió un error en el servidor", error: e.message})
    }
};

module.exports = {
  getAllPostImages,
  createPostImages,
  updatePostImage,
  deleteById,
};
