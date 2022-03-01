const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const FollowerModel = require('../models/FollowerModel');
const ProfileModel = require('../models/ProfileModel');
const bcrypt = require('bcryptjs');

const getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(404).send('No User Found');

    const profile = await ProfileModel.findOne({ user: user._id }).populate(
      'user'
    );
    
    const profileFollowStats = await FollowerModel.findOne({ user: user._id });
    console.log(profileFollowStats)
    return res.status(200).json({
      profile,
      followersLength:
        profileFollowStats.followers.length > 0
          ? profileFollowStats.followers.length
          : '0',
      followingLength:
        profileFollowStats.following.length > 0
          ? profileFollowStats.following.length
          : '0',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('error @ getProfile');
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if(!user) return res.status(404).send('User Not Found')

    const posts = await PostModel.find({user: user._id})
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("comments.user")
      .populate("likes.user");

      return res.status(200).json(posts)
  } catch (err) {
    console.error(err);
    return res.status(500).send('error @ getUserPosts');
  }
};

const getFollowers = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    return res.status(500).send('error @ getFollowers');
  }
};

const getFollowing = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    return res.status(500).send('error @ getFollowing');
  }
};

const followUser = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    return res.status(500).send('error @ followUser');
  }
};

const unfollowUser = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    return res.status(500).send('error @ unfollowUser');
  }
};

const updateProfile = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    return res.status(500).send('error @ updateProfile');
  }
};

const updatePassword = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    return res.status(500).send('error @ updatePassword');
  }
};

module.exports = {
  getProfile,
  getUserPosts,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  updatePassword,
  updateProfile,
};
