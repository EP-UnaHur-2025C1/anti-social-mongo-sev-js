const { Router } = require("express");
const router = Router();
const { followController } = require("../controllers");

router.get("/followers/:userId", followController.getFollowers);

router.get("/following/:userId", followController.getFollowing);

router.post("/", followController.createFollow);

router.delete("/:follower/:followed", followController.deleteFollow);

module.exports = router;