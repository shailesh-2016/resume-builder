const router = require("express").Router();
const resumeController = require("../controller/resumeController");
const { protect } = require("../middleware/authMiddleware");
const uploadResumeImg=require("../controller/uploadImages")

router.post("/", protect, resumeController.createResume);
router.get("/", protect, resumeController.getUserResumes);
router.get("/:id", protect, resumeController.getResumeById);
router.delete("/:id", protect, resumeController.deleteResume);
router.put("/:id", protect, resumeController.updateResume);
router.put("/:id/upload-images", protect,uploadResumeImg.uploadResumeImages);

module.exports = router;
