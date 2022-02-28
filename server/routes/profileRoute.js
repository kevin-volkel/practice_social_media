const router = require('express').Router();
const {
  getProfile,
  getUserPosts,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  updatePassword,
  updateProfile,
} = require('../controllers/profile');

router.route('/:username').get(getProfile);

module.exports = router;
