const User = require('../models/User');

/**
 * Updates the user's progress for a specific guide.
 * 
 * @param {string} userId - The unique identifier of the user.
 * @param {string} guideSlug - The slug of the guide being updated.
 * @param {Array<string>} completedTasks - An array of completed task IDs.
 * @returns {Promise<Array>} The updated savedProgress array.
 * @throws {Error} If the user is not found.
 */
const updateProgress = async (userId, guideSlug, completedTasks) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const progressIndex = user.savedProgress.findIndex(p => p.guideSlug === guideSlug);

  if (progressIndex > -1) {
    user.savedProgress[progressIndex].completedTasks = completedTasks;
    user.markModified('savedProgress');
  } else {
    user.savedProgress.push({ guideSlug, completedTasks });
  }

  await user.save();
  return user.savedProgress;
};

/**
 * Retrieves the user's completed tasks for a specific guide.
 * 
 * @param {string} userId - The unique identifier of the user.
 * @param {string} slug - The slug of the guide.
 * @returns {Promise<Array<string>|string>} The array of completed tasks or an empty string if none found.
 * @throws {Error} If the user is not found.
 */
const getProgressBySlug = async (userId, slug) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const progress = user.savedProgress.find(p => p.guideSlug === slug);
  return progress ? progress.completedTasks : "";
};

/**
 * Retrieves all progress entries for a specific user.
 * 
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Array>} The savedProgress array.
 * @throws {Error} If the user is not found.
 */
const getAllProgress = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user.savedProgress || [];
};

/**
 * Deletes a progress entry for a specific guide.
 * 
 * @param {string} userId - The unique identifier of the user.
 * @param {string} slug - The slug of the guide to remove progress for.
 * @returns {Promise<Array>} The updated savedProgress array.
 * @throws {Error} If the user is not found or progress entry is not found.
 */
const deleteProgressBySlug = async (userId, slug) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const progressExists = user.savedProgress.some(p => p.guideSlug === slug);
  if (!progressExists) throw new Error("Progress entry not found");

  user.savedProgress = user.savedProgress.filter(p => p.guideSlug !== slug);
  await user.save();
  return user.savedProgress;
};

module.exports = {
  updateProgress,
  getProgressBySlug,
  getAllProgress,
  deleteProgressBySlug
};
