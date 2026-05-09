const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// POST: update progress
router.post('/update-progress', protect, userController.updateProgress);

// GET: get the progress of the current user by slug
router.get('/get-progress/:slug', protect, userController.getProgress);

// GET: get all data of the user
router.get('/get-data', protect, userController.getAllData);

// PUT: update onboarding status
router.put('/onboarding', protect, userController.updateOnboarding);

// DELETE: delete progress for a specific guide by slug
router.delete('/delete/:slug', protect, userController.deleteProgress);

module.exports = router;
