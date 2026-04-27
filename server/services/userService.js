const User = require('../models/User');

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

const getProgressBySlug = async (userId, slug) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const progress = user.savedProgress.find(p => p.guideSlug === slug);
  return progress ? progress.completedTasks : "";
};

const getAllProgress = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user.savedProgress || [];
};

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
