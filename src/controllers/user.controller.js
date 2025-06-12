const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

const getUsers = async (_, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario inexistente" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createUser = async (req, res) => {
  try {
    const { userName, email } = req.body;
    //para manejar si el user ya existe
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Este userName ya está siendo utilizado" });
    }

    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res
      .status(200)
      .json({ message: "Usuario actualizado", usuario: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteById = async (req, res) => {
  try {
    const userId = req.params.id;
    await Comment.deleteMany({ user: userId });
    await Post.deleteMany({ user: userId });

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res
      .status(200)
      .json({ message: "Usuario eliminado", usuario: deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteById };
