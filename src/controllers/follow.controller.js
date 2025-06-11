const Follow = require("../models/Follow");
const User = require("../models/User");

const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params; // id del usuario del que queremos saber quienes lo siguen
    const user = await User.findByPk(userId, {
      include: {
        model: User,
        as: "Followers",
        through: { attributes: [] },
        attributes: ["id", "userName", "email"],
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Ususario inexistente" });
    }
    res.status(200).json(user.Followers); //asi obtenemos solo los seguidores
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};
const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params; // id del usuario que queremos saber a quienes sigue
    const user = await User.findByPk(userId, {
      include: {
        model: User,
        as: "Following",
        through: { attributes: [] },
        attributes: ["id", "userName", "email"],
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Ususario inexistente" });
    }
    res.status(200).json(user.Following); //asi obtenemos solo quienes lo siguen
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

    const follower = await User.findByPk(followerId);
    const followed = await User.findByPk(followedId);

    if (!follower || !followed) {
      return res.status(404).json({ message: "Ususario no existente" });
    }
    const existingFollow = await Follow.findOne({
      where: { followerId, followedId },
    });
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
    const follow = await Follow.findOne({
      where: { followerId: follower, followedId: followed },
    });
    if (!follow) {
      return res.status(404).json({ message: "Solicitud Icorrecta" });
    }
    await follow.destroy();
    res.status(200).json({ message: "Se dejó de seguir al usuario" });
  } catch (e) {
    console.error(e);
    res.status(500).json("Error interno del servidor ");
  }
};

module.exports = { getFollowers, getFollowing, createFollow, deleteFollow };