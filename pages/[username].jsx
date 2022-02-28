import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { baseURL } from './util/auth';
import { parseCookies } from 'nookies';
import { Grid } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import CardPost from './components/post/CardPost';

const ProfilePage = ({
  errorLoading,
  profile,
  followersLength,
  followingLength,
  user,
  userFollowStats
}) => {
  const Router = useRouter();
  const { username } = Router.query;

  return <div>{username}</div>;
};

ProfilePage.getInitialProps = async (ctx) => {
  try {
    const { username } = ctx.query;
    const { token } = parseCookies(ctx)
    const res = await axios.get(`${baseURL}/api/v1/profile/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const { profile, followersLength, followingLength } = res.data;
    return { profile, followersLength, followingLength }

  } catch (err) {
    console.error(err)
    return { errorLoading: true }
  }
}

export default ProfilePage;
