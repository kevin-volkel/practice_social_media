const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const uuid = require('uuid').v4;

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* CREATE A POST
* .post('/')
* req.body {text, location, picURL}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const createPost = async (req, res) => {
  const { text, location, picURL } = req.body;

  if (!text.length)
    return res.status(401).send('Text must be at least 1 character');

  try {
    const newPost = {
      user: req.userId,
      text,
    };
    if (location) newPost.location = location;
    if (picURL) newPost.picURL = picURL;

    console.log(newPost)
    const post = await new PostModel(newPost).save();
    const postCreated = await PostModel.findById(post._id).populate('user');

    return res.status(200).json(postCreated);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error @ createPost');
  }
};

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* GET ALL POSTS
* .get('/')
* req.query { pageNumber }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const getAllPosts = async (req, res) => {
  const { page } = req.query;
  const pageNumber = Number(page);
  const size = 8;

  try {
    let posts;

    if (pageNumber === 1) {
      posts = await PostModel.find()
        .limit(8)
        .sort({ createdAt: -1 })
        .populate('user')
        .populate('comments.user');
    } else {
      const skips = size * pageNumber - 1;
      posts = await PostModel.find()
        .skip(skips)
        .limit(8)
        .sort({ createdAt: -1 })
        .populate('user')
        .populate('comments.user');
    }
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error @ getAllPosts');
  }
};

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* GET A POST BY Id
* .get('/:postId')
* req.params { postId }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const getPostById = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId)
      .populate('user')
      .populate('comments.user');
    if (!post) return res.status(403).send('Post Not Found');
    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error @ getPostById');
  }
};

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* DELETE A POST
* .delete('/:postId')
* req.params { postId }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const deletePost = async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;

    const post = await PostModel.findById(postId);
    if (!post) return res.status(403).send('Post not found');
    const user = await UserModel.findById(userId);
    if (post.user.toString() !== userId) {
      if (user.role === 'admin') {
        await post.remove();
        return res.status(200).send('Post Deleted Successfully');
      } else {
        return res.status(401).send('Unauthorized');
      }
    }

    await post.remove();
    return res.status(200).send('Post Deleted Successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error @ deletePost');
  }
};

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* LIKE A POST
* .post('/like/:postId')
* req.params { postId }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;

    const post = await PostModel.findById(postId);
    if (!post) return res.status(403).send('Post not found');

    const isLiked = post.likes.find((like) => like.user.toString() === userId);
    if (isLiked) return res.status(401).send('Post already liked');

    await post.likes.unshift({ user: userId });
    await post.save();

    return res.status(200).send('Post liked');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error @ likePost');
  }
};

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* UNLIKE A POST
* .put('/like/:postId')
* req.params { postId }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const unlikePost = async (req, res) => {
  try {
    const { userId, params: { postId } } = req;

    const post = await PostModel.findById(postId);
    if (!post) return res.status(403).send('Post not found');

    const likedIndex = post.likes.findIndex((like) => like.user.toString() === userId)
    if(likedIndex === -1) return res.status(401).send('Post not liked')

    await post.likes.splice(likedIndex, 1)
    await post.save();

    return res.status(200).send('Post unliked')
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error @ unlikePost');
  }
};

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* GET ALL LIKES ON A POST
* .get('/like/:postId')
* req.params { postId }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const getAllLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.findById(postId).populate('likes.user');
    if (!post) return res.status(403).send('Post not found');

    return res.status(200).json(post.likes)
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error @ getAllLikes');
  }
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* CREATE A COMMENT 
* .post('/comment/:postId)
* req.params { postId }
* req.body { text }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const createComment = async (req, res) => {
  try {
    const { userId, params: { postId }, body: { text } } = req;
    
    if(!text) return res.status(403).send('Text Required');
    const post = await PostModel.findById(postId);
    if (!post) return res.status(403).send('Post not found');

    const newComment = {
      user: userId,
      _id: uuid(),
      text
    }

    await post.comments.unshift(newComment)
    await post.save();

    return res.status(200).json(newComment._id)

  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error @ createComment');
  }
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* DELETE A COMMENT
* .delete('/comment/:postId/:commentId')
* req.params { postId, commentId }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const deleteComment = async (req, res) => {
  try {
    const { userId, params: { postId, commentId } } = req;
    
    const post = await PostModel.findById(postId);
    if (!post) return res.status(403).send('Post not found');

    const comment = post.comments.find((comment) => comment._id === commentId)
    if(!comment) return res.status(403).send('Comment not found')

    const user = await UserModel.findById(userId)

    const deleteComment = async () => {
      const indexOf = post.comments.indexOf(comment)
      await post.comments.splice(indexOf, 1)
      await post.save()
      return res.status(200).send('Comment Deleted')
    }

    if(comment.user.toString() !== userId) {
      if(user.role === 'admin') {
        await deleteComment();
      } else {
        return res.status(401).send('Unauthorized')
      }
    }
    await deleteComment();

  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error @ deleteComment');
  }
}


module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
  getAllLikes,
  createComment,
  deleteComment
};
