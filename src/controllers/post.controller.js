const mongoose = require("mongoose");
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "userName email")
      .populate("tags", "name");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    //eliminé validación de id, ahora la hace el middleware

    const post = await Post.findById(id)
      .populate("userId", " userName email")
      .populate("tags", "name");

    if (!post) {
      return res.status(404).json({ message: "Post inexistente" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { description, userId, tags } = req.body;
    if (!userId || !description) {
      return res
        .status(400)
        .json({ message: "Faltan datos que son requeridos" });
    }
    const newPost = new Post({
      userId,
      description,
      tags,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    //eliminé validación de id, ahora la hace el middleware
    const { description, userId, tags } = req.body;

    if (!description || !userId) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    post.description = description;
    post.userId = userId;
    post.tags = tags;

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const postId = req.params.id;
    //eliminé validación de id, ahora la hace el middleware

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post no existente" });
    }
    await Comment.deleteMany({ post: postId });
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post eliminado correctamente", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { getPosts, getPostById, createPost, updatePost, deleteById };
