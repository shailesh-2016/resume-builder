const router=require("express").Router()
const userController=require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/register",userController.register)
router.post("/login",userController.login)
router.get("/profile", protect,userController.getUserProfile); 

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ imageUrl });
});

module.exports=router