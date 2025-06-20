const { Router } = require("express");
const { userController } = require("../controllers");
const validarObjectId = require('../middlewares/validatorObjectId');
const router = Router();

router.get("/", userController.getUsers);
router.get("/:id",validarObjectId, userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", validarObjectId, userController.updateUser);
router.delete("/:id", validarObjectId, userController.deleteById);

module.exports = router;
