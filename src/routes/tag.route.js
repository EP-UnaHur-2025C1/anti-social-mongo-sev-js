const { Router } = require("express");
const { tagController } = require("../controllers");
const router = Router();

router.get("/", tagController.getTags);
router.post("/", tagController.createTag);
router.put("/:id", tagController.updateTag);
router.delete("/:id", tagController.deleteById);

module.exports = router;
