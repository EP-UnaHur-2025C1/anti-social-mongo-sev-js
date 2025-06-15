const Comment = require("../models/comment");
const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const { obtenerFechaLimite } = require("../aditionalFunctions/comment");

//crear un nuevo comentario ok

const createComment = async (req, res) => {
  try {
    //la fecha de creacion se requiere para poder crear comments con fechas
    // que superen el limite y probar la funcionalidad
    const { postId, userId, text, createdAt } = req.body;
    if (!postId || !userId || !text) {
      return res
        .status(400)
        .json({ error: "Faltan  datos que son requeridos" });
    }
    const newComment = new Comment({ postId, userId, text, createdAt });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Obtener todos los comentarios que no superen la fecha limite -ok

const getComments = async (req, res) => {
  try {
    const fechaLimite = obtenerFechaLimite();
    const comments = await Comment.find({
      visible: true,
      createdAt: { $gte: fechaLimite },
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Obtener un comentario por id - lo trae aunque sea antigua ok
const getCommentById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const comment = await Comment.findById(id).populate("userId", "userName");
    if (!comment) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener comentarios de un post (solo los visibles)
const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.id;
    //verificar si el id tiene el formato correcto de mongoDB
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "ID de post inválido" });
    }
    const fechaLimite = obtenerFechaLimite();

    const comments = await Comment.find({
      postId,
      visible: true,
      //$gte greater than or equal -mayor o igual que en mongoDB
      createdAt: { $gte: fechaLimite },
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Actualizar un comentario

const updateComment = async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }); //new para que me devuelva actualizado
    if (!updated) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Eliminar comentario

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment)
      return res.status(404).json({ error: "Comentario no encontrado" });

    res.status(200).json({ message: "Comentario eliminado", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment,
  getComments,
  getCommentById,
  getCommentsByPost,
  updateComment,
  deleteComment,
};
