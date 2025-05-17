const { Resume } = require("../models/resumeModel");
const path = require("path");
const fs = require("fs");

exports.createResume = async (req, res) => {
  try {
    const { title } = req.body;

    // Default template
    const defaultResumeData = {
      profileInfo: {
        profileImg: null,
        previewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      workExperience: [
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          degree: "",
          institution: "",
          startDate: "",
          endDate: "",
        },
      ],
      skills: [
        {
          name: "",
          progress: 0,
        },
      ],
      projects: [
        {
          title: "",
          description: "",
          github: "",
          liveDemo: "",
        },
      ],
      certifications: [
        {
          title: "",
          issuer: "",
          year: "",
        },
      ],
      languages: [
        {
          name: "",
          progress: 0,
        },
      ],
      interests: [""],
    };

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
    });

    res.status(201).json(newResume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create resume", error: error.message });
  }
};

exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create resume", error: error.message });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const { id } = req.params; // URL se resume ID
    const userId = req.user._id; // Logged-in user ID

    const resume = await Resume.findOne({ _id: id, userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json(resume);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch resume",
      error: err.message,
    });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const resume = await Resume.findOne({ _id: id, userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    // Delete images if they exist
    const uploadsPath = path.join(__dirname, '..', 'uploads');

    const deleteFileIfExists = (url) => {
      if (url) {
        const filePath = path.join(uploadsPath, path.basename(url));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    };

    deleteFileIfExists(resume.thumbnailLink);
    deleteFileIfExists(resume.profileInfo?.profilePreviewUrl);

    // Delete resume from database
    await Resume.findOneAndDelete({ _id: id, userId });

    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete resume",
      error: err.message,
    });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const resume = await Resume.findOne({ _id: id, userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    // Update resume fields with new data
    Object.assign(resume, req.body);

    const updatedResume = await resume.save();

    res.status(200).json(updatedResume);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update resume",
      error: err.message,
    });
  }
};


