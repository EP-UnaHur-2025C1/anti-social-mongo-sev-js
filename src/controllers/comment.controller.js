const Comment = require("../models/comment");
const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");

//crear un nuevo comentario

const createComment = async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

//Obtener todos los comentarios

const getComments = async(req, res) => {

    try {
        const comments = await Comment.find()
        res.status(200).json(comments)
    } catch (error) {
        res.staus(500).json({error : error.message})
    }
}



//Obtener un comentario por id

const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findByid(req.params.id).populate("userId", "userName");
        if(!comment) return res.status(404).json({error: "Comentario no encontrado"});
            res.json(comment);
    } catch (error) {
        res.status(500).json({error: error.message});
        
    }
}


// Obtener comentarios de un post (solo los visibles)
const getCommentsByPost = async (req, res) => {
    try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId, visible: true }).sort({ createdAt: -1 });
    res.status(200).json(comments);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};


//Actualizar un comentario

const updateComment = async (req, res) => {
    try {
        const updated = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true }); //new para que me devuelva actualizado
        if (!updated) return res.status(404).json({ error: 'Comentario no encontrado' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

//Eliminar comentario

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });
        res.json({ message: 'Comentario eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createComment, getCommentById, getCommentsByPost, updateComment, deleteComment };