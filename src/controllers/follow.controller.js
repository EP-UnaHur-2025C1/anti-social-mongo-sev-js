const Follow = require("../models/follow");
const User = require("../models/user");

const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const user = await User.findById(userId)
      .select("userName")
      .populate("followers");
    if (!user) {
      return res.status(404).json({ message: "Usuario inexistente" });
    }
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};

const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const user = await User.findById(userId)
      .select("userName")
      .populate("followed");
    if (!user) {
      return res.status(404).json({ message: "Usuario inexistente" });
    }
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};

const createFollow = async (req, res) => {
  try {
    const { followerId, followedId } = req.body;

    if (followerId === followedId) {
      return res
        .status(400)
        .json({ message: "Datos Erróneos: no puede seguirse a si mismo" });
    }

    const follower = await User.findById(followerId);
    const followed = await User.findById(followedId);

    if (!follower || !followed) {
      return res.status(404).json({ message: "Usuario no existente" });
    }
    const existingFollow = await Follow.findOne({ followerId, followedId });
    if (existingFollow) {
      return res
        .status(400)
        .json({ message: `Ya sigue al usuario ${followed.userName}` });
    }
    const newFollow = await Follow.create({ followerId, followedId });
    res.status(201).json(newFollow);
  } catch (e) {
    console.error(e);
    res.status(500).json("Error interno del servidor ");
  }
};

const deleteFollow = async (req, res) => {
  try {
    const { follower, followed } = req.params;
    const follow = await Follow.findOneAndDelete({ followerId: follower, followedId: followed });

    if (!follow) {
      return res.status(404).json({ message: "Solicitud Incorrecta" });
    }
    res.status(200).json({ message: "Se dejó de seguir al usuario" });
  } catch (e) {
    console.error(e);
    res.status(500).json("Error interno del servidor ");
  }
};

module.exports = { getFollowers, getFollowing, createFollow, deleteFollow };
