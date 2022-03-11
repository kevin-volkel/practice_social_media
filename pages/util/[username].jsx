import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { baseURL } from './auth';
import { parseCookies } from 'nookies';
import { Grid } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import CardPost from '../components/post/CardPost';
import ProfileMenuTabs from '../components/profile/ProfileMenuTabs'
import ProfileHeader from '../components/profile/ProfileHeader';
import { PlaceholderPosts } from '../components/layout/PlaceHolderGroup';
import { NoProfilePost } from '../components/layout/NoData'
import Followers from '../components/profile/Followers';

const ProfilePage = ({
  errorLoading,
  profile,
  followersLength,
  followingLength,
  user,
  followStats
}) => {
  const Router = useRouter();
  const { username } = Router.query;
  const ownAccount = profile.user._id === user._id;
  
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeItem, setActiveItem] = useState('profile')
  const [loggedUserFollowStats, setLoggedUserFollowStats] = useState(followStats)
  
  const handleItemClick = (clickedTab) => setActiveItem(clickedTab)

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseURL}/api/v1/profile/posts/${username}`, {
          headers: {Authorization: `Bearer ${Cookies.get("token")}`}
        })
        setPosts(res.data);
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    getPosts();
  }, [Router.query.username])
  
  
  if(!profile) return null;
  return <Grid stackable>
    <Grid.Row>
      <Grid.Column>
        <ProfileMenuTabs 
          activeItem={activeItem}
          handleItemClick={handleItemClick}
          followersLength={followersLength}
          followingLength={followingLength}
          ownAccount={ownAccount}
          loggedUserFollowStats={loggedUserFollowStats}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        {activeItem === "profile" && (
          <>
            <ProfileHeader 
              profile={profile}
              ownAccount={ownAccount}
              loggedUserFollowStats={loggedUserFollowStats}
              setLoggedUserFollowStats={setLoggedUserFollowStats}
              setActiveItem={setActiveItem}
            />
            {loading ? (
              <PlaceholderPosts />
              ) : posts ? (
                posts.map(post => (
                  <CardPost 
                  key={post._id}
                  post={post}
                  user={user}
                  setPosts={setPosts}
                />
              ))
            ) : (
              <NoProfilePost/>
            )}
          </>
        )}
        {activeItem == "followers" && (
          <Followers 
            user={user}
            loggedUserFollowStats={loggedUserFollowStats}
            setLoggedUserFollowStats={setLoggedUserFollowStats}
            profileUserId={profile.user._id}
            profile={profile}
          />
        )}
      </Grid.Column>
    </Grid.Row>
  </Grid>;
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
    // console.log(profile);
    return { profile, followersLength, followingLength }

  } catch (err) {
    console.error(err)
    return { errorLoading: true }
  }
}

export default ProfilePage;
