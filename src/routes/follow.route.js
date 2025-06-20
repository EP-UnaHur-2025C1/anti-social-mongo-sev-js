const { Router } = require("express");
const router = Router();
const { followController } = require("../controllers");
const validarObjectId = require('../middlewares/validatorObjectId');

router.get("/followers/:userId", validarObjectId, followController.getFollowers);

router.get("/following/:userId", validarObjectId, followController.getFollowing);

router.post("/", followController.createFollow);

router.delete("/:follower/:followed", followController.deleteFollow);

module.exports = router;