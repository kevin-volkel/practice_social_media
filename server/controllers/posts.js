const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const uuid = require('uuid').v4;

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* CREATE A POST
* .post('/')
* req.body {text, location, picUrl}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const createPost = async (req, res) => {
  const { text, location, picUrl } = req.body;

  if(!text.length) return res.status(401).send('Text must be at least 1 character')

  try {
    const newPost = {
      user: req.userId,
      text
    }
    if(location) newPost.location = location;
    if(picUrl) newPost.picUrl = picUrl

    const post = await new PostModel(newPost).save();
    const postCreated = await PostModel.findById(post._id).populate('user')


    return res.status(200).json(postCreated)
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error @ createPost')
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

  try{
    let posts;

    if(pageNumber === 1) {
      posts = await PostModel.find()
        .limit(8)
        .sort({createdAt: -1})
        .populate('user')
        .populate('comments.user')
    } else {
      const skips = size * pageNumber - 1
      posts = await PostModel.find()
        .skip(skips)
        .limit(8)
        .sort({createdAt: -1})
        .populate('user')
        .populate('comments.user')
    }
    return res.status(200).json(posts)
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error @ getAllPosts')
  }
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* GET A POST BY Id
* .get('/:postId')
* req.params { postId }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const getPostById = async (req, res) => {
  try{
    const post = await PostModel.findById(req.params.postId)
      .populate('user')
      .populate('comments.user')
    if(!post) return res.status(403).send('Post Not Found')
    return res.status(200).json(post)
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error @ getPostById')
  }
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* DELETE A POST
* .delete('/:postId')
* req.params { postId }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const deletePost = async (req, res) => {
  try{
    const { userId } = req;
    const { postId } = req.params;

    const post = await PostModel.findById(postId)
    if(!post) return res.status(403).send('Post not found')
    const user = await UserModel.findById(userId)
    if(post.user.toString() !== userId) {
      if(user.role === 'root') {
        await post.remove()
        return res.status(200).send('Post Deleted Successfully')
      } else {
        return res.status(401).send('Unauthorized')
      }
    }

    await post.remove()
    return res.status(200).send('Post Deleted Successfully')

  } catch (err) {
    console.error(err)
    return res.status(500).send('Server Error @ deletePost')
  }
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* LIKE A POST
* .post('/like/:postId')
* req.params { postId }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* UNLIKE A POST
* .put('/like/:postId')
* req.params { postId }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* GET ALL LIKES ON A POST
* .get('/like/:postId')
* req.params { postId }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* CREATE A COMMENT 
* .post('/comment/:postId)
* req.params { postId }
* req.body { text }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* DELETE A COMMENT
* .delete('/comment/:postId/:commentId')
* req.params { postId, commentId }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


module.exports = { createPost, getAllPosts, getPostById, deletePost };
