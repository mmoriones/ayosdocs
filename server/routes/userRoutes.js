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

// get the progress of the current user by slug
router.get('/get-progress/:slug', protect, async (req, res ) =>{
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Find the specific progress entry for this slug
        const progress = user.savedProgress.find(p => p.guideSlug === req.params.slug);

        if (progress) {
            res.status(200).json({ completedTasks: progress.completedTasks });
        } else {
             res.status(200).json({ completedTasks: "" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

//get all data of the user
router.get('/get-data', protect, async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const data = user.savedProgress;

        if (data && data.length > 0){
            res.status(200).json({
                message: "Progress data retrieved successfully",
                savedProgress: data
            });

        } else {
            res.status(200).json({ 
                message: "No saved progress found", 
                savedProgress: []
            });
        }
    }catch (error) {
        console.error("Fetch Data Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// dlete progress for a specific guide by slug
router.delete('/delete/:slug', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // check if the progress entry exists before attempting to delete
        const progressExists = user.savedProgress.some(p => p.guideSlug === req.params.slug);

        if (!progressExists) {
            return res.status(404).json({ message: "Progress entry not found" });
        }

        // Filter out the specific guideSlug
        user.savedProgress = user.savedProgress.filter(
            (p) => p.guideSlug !== req.params.slug
        );

        await user.save();

        res.status(200).json({ 
            message: "Progress deleted successfully", 
            savedProgress: user.savedProgress 
        });
        
    } catch (error) {
        console.error("Delete Progress Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;