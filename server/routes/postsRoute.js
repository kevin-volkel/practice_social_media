const router = require('express').Router();
const { 
  createPost, 
  getAllPosts,
  getPostById,
  deletePost
} = require('../controllers/posts');

router.route('/').post(createPost).get(getAllPosts);
router.route('/:postId').get(getPostById).delete(deletePost)

module.exports = router;
