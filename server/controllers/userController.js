const userService = require('../services/userService');

/**
 * Controller to handle progress updates for a guide.
 * 
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 */
const updateProgress = async (req, res) => {
  try {
    const { guideSlug, completedTasks } = req.body;
    const userId = req.user.id;
    const savedProgress = await userService.updateProgress(userId, guideSlug, completedTasks);
    res.status(200).json({ message: "Progress saved successfully", savedProgress });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Update Progress Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Controller to retrieve progress for a specific guide.
 * 
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 */
const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const slug = req.params.slug;
    const completedTasks = await userService.getProgressBySlug(userId, slug);
    res.status(200).json({ completedTasks });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Controller to retrieve all progress data for the authenticated user.
 * 
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 */
const getAllData = async (req, res) => {
  try {
    const userId = req.user.id;
    const savedProgress = await userService.getAllProgress(userId);
    
    if (savedProgress && savedProgress.length > 0) {
      res.status(200).json({
        message: "Progress data retrieved successfully",
        savedProgress
      });
    } else {
      res.status(200).json({
        message: "No saved progress found",
        savedProgress: []
      });
    }
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Fetch Data Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Controller to delete progress for a specific guide.
 * 
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 */
const deleteProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const slug = req.params.slug;
    const savedProgress = await userService.deleteProgressBySlug(userId, slug);
    res.status(200).json({ message: "Progress deleted successfully", savedProgress });
  } catch (error) {
    if (error.message === "User not found" || error.message === "Progress entry not found") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Delete Progress Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  updateProgress,
  getProgress,
  getAllData,
  deleteProgress
};
