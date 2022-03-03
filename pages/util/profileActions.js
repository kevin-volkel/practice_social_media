import axios from 'axios'
import {baseURL} from './auth'
import catchErrors from './catchErrors'
import Cookies from 'js-cookie';
import Router from 'next/router'

const profileAxios = axios.create({
  baseURL: `${baseURL}/api/v1/profile`,
  headers: { Authorization: `Bearer ${Cookies.get('token')}`}
})



export const followUser = async (userToFollowId, setLoggedUserFollowStats) => {
  try {
    await profileAxios.post(`/follow/${userToFollowId}`)

    setLoggedUserFollowStats(prev => ({
      ...prev,
      following: [...prev.following, {user: userToFollowId}]
    }))

  } catch (err) {
    console.error(err)
  }
}

export const unfollowUser = async (userToUnfollowId, setLoggedUserFollowStats) => {
  try {
    await profileAxios.post(`/unfollow/${userToUnfollowId}`)
    setLoggedUserFollowStats( prev => ({
      ...prev,
      following: prev.following.filter( (following) => following.user !== userToUnfollowId)
    }))


  } catch (err) {
    console.error(err)
  }
}