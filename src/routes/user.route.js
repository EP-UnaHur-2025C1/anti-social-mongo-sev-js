const { Router } = require("express");
const { userController } = require("../controllers");
const router = Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteById);

module.exports = router;
