const fs = require("fs");
const path = require("path");
const { Resume } = require("../models/resumeModel");
const upload = require("../middleware/upload");

exports.uploadResumeImages = async (req, res) => {
  upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(
    req,
    res,
    async (err) => {
      if (err)
        return res
          .status(400)
          .json({ message: "Upload failed", error: err.message });

      try {
        const resume = await Resume.findOne({
          _id: req.params.id,
          userId: req.user._id,
        });
        if (!resume)
          return res.status(404).json({ message: "Resume not found" });

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const uploadsDir = path.join(__dirname, "..", "uploads");

        // ✅ Thumbnail Update
        if (req.files.thumbnail?.[0]) {
          const newFile = req.files.thumbnail[0];
          if (resume.thumbnailLink) {
            const oldFile = path.join(
              uploadsDir,
              path.basename(resume.thumbnailLink)
            );
            if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
          }
          resume.thumbnailLink = `${baseUrl}/uploads/${newFile.filename}`;
        }

        // ✅ Profile Image Update
        if (req.files.profileImage?.[0]) {
          const newFile = req.files.profileImage[0];
          if (resume.profileInfo?.profilePreviewUrl) {
            const oldFile = path.join(
              uploadsDir,
              path.basename(resume.profileInfo.profilePreviewUrl)
            );
            if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
          }
          resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newFile.filename}`;
        }

        await resume.save();

        res.status(200).json({
          message: "Images uploaded successfully",
          thumbnailLink: resume.thumbnailLink,
          profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
        });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Something went wrong", error: error.message });
      }
    }
  );
};
