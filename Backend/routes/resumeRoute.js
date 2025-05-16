const router = require("express").Router();
const resumeController = require("../controller/resumeController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create",protect,resumeController.createResume)

module.exports = router;
