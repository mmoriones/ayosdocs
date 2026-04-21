const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');


router.post('/update-progress', protect, async (req, res) => {
    try {
        const { guideSlug, completedTasks } = req.body;
        
        const userId = req.user.id; 

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const progressIndex = user.savedProgress.findIndex(p => p.guideSlug === guideSlug);

        if (progressIndex > -1) {
            user.savedProgress[progressIndex].completedTasks = completedTasks;
            user.markModified('savedProgress');
        } else {
            user.savedProgress.push({ guideSlug, completedTasks });
        }

        await user.save();
        res.status(200).json({ message: "Progress saved successfully", savedProgress: user.savedProgress });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;