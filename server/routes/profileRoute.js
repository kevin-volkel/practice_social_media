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
router.route('/posts/:username').get(getUserPosts);
router.route('/following/:userId').get(getFollowing)
router.route('/followers/:userId').get(getFollowers)
router.route('/follow/:userToFollowId').post(followUser)
router.route('/unfollow/:userToUnfollowId').post(unfollowUser)


module.exports = router;
