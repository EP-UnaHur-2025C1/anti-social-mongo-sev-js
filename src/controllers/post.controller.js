const mongoose = require("mongoose");
const Post = require("../models/post");
const Comment = require("../models/comment");
const PostImage = require("../models/postImage");
const { saveImage } = require('../aditionalFunctions/image')

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .select("description")
      .populate("userId", "userName email");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const post = await Post.findById(id)
      .select("description")
      .populate("userId", " userName email")

    if (!post) {
      return res.status(404).json({ message: "Post inexistente" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostwithImagesTagsById = async (req, res) => {
    try { 
      const id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
      }
      const data = await Post.findById(id)
        .select("description createdAt")
        .populate("tags", "name")
        .populate("images", "imageUrl")
      res.status(200).json(data);
    } catch(e) {
      res.status(500).json({message: "Ocurrió un error en el servidor", error: e.message})
    }
};

const createPost = async (req, res) => {
  try {
    const { description, userId } = req.body;
    if (!userId || !description) {
      return res
        .status(400)
        .json({ message: "Faltan datos que son requeridos" });
    }

    const newPost = new Post({
      userId,
      description
    });
    await newPost.save();

    if (req.files) {
        req.files.map(file => saveImage(file))
        const imageRecords = req.files.map((file) => ({
          postId: newPost._id,
          imageUrl: file.destination + file.originalname, 
        }));
        await PostImage.create(imageRecords)
        const idImages = await PostImage.find({postId: newPost._id}).select('_id')
        await Post.updateOne({_id: newPost._id}, {$set: {images: idImages}})
    }

    const postWithImages = await Post.find({_id: newPost._id})
        .select('-__v')

    res.status(201).json(postWithImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const { description, userId } = req.body;

    if (!description || !userId) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    post.description = description;
    post.userId = userId;

    await post.save();  

    if(req.files) {
      req.files.map(file => saveImage(file))
      await PostImage.findOneAndDelete({postId: id});

      const postImages = req.files.map((file) => ({
        imageUrl:  file.destination + file.originalname,
        postId: id,
      }));
      await PostImage.create(postImages);
      const idImages = await PostImage.find({postId: post._id}).select('_id')
      await Post.updateOne({_id: post._id}, {$set: {images: idImages}})
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post no existente" });
    }
    await Comment.deleteMany({ post: postId });
    await PostImage.deleteMany({ postId })
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post eliminado correctamente", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePostImage = async (req, res) => {
    try {
      const { id, imageId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(imageId)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      await PostImage.findOneAndDelete({ postId: id, _id: imageId });
      const post = await Post.findById(id)
      post.images.pull(imageId);
      await post.save();

      res.status(200).json({ message: "Imagen eliminada correctamente" });
    } catch(e) {
      res.status(500).json({message: "Ocurrió un error en el servidor", error: e.message})
    }
};

const updatePostImagesById = async (req, res) => {
  try {
    const { id } = req.params 

    const postImages = await Post.findById(id).select('images')

    req.files.map(file => saveImage(file))
    const imagesRecords = req.files.map((file) => ({
      imageUrl: file.destination + file.originalname, 
      postId: id
    }));
    await PostImage.deleteMany({ postId: id })
    await PostImage.create(imagesRecords)

    const idImages = await PostImage.find({postId: id}).select('_id')
    await Post.updateOne({_id: id}, {$set: {images: idImages}})

      res
        .status(201)
        .json({ message: `Imagenes actualizadas correctamente ${postImages}` });
  } catch(e) {
    res.status(500).json({message: "Ocurrió un error en el servidor", error: e.message})
  }
};

module.exports = { getPosts, getPostById, getPostwithImagesTagsById, createPost, updatePost, deleteById, deletePostImage, updatePostImagesById };
