import axios from 'axios'
import { baseURL } from './auth'
import Cookies from 'js-cookie'
import catchErrors from './catchErrors'

const postAxios = axios.create({
  baseURL: `${baseURL}/api/v1/posts`,
  headers: {
    Authorization: `Bearer ${Cookies.get('token')}`
  }
})

export const deletePost = async (postId, setPosts, setShowToastr) => {
  try {
    await postAxios.delete(`/${postId}`)
    setPosts( (prev) => prev.filter( (post) => post._id !== postId));
    setShowToastr(true)
  } catch (err) {
    console.error(err);
  }
};

export const likePost = async (postId, userId, setLikes, like = true) => {
  try {
    if(like){
      await postAxios.post(`/likes/${postId}`)
      setLikes( (prev) => [...prev, { user: userId }])
    } else {
      await postAxios.put(`/likes/${postId}`)
      setLikes((prev) => prev.filter( (like) => like.user !== userId))
    }
  } catch (err) {
    console.error(err)
  }
};

