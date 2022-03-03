import React, { useState } from 'react';
import {
  Segment,
  Image,
  Grid,
  Divider,
  Header,
  Button,
  List,
} from 'semantic-ui-react';
import { followUser, unfollowUser } from '../../util/profileActions';

const ProfileHeader = ({
  profile,
  ownAccount,
  loggedUserFollowStats,
  setLoggedUserFollowStats,
  setActiveItem
}) => {
  const [loading, setLoading] = useState(false);
  const isFollowing = loggedUserFollowStats.following.some(
    (eachUser) => eachUser.user === profile.user._id
  );
  const isDefaultBio = (profile.bio === "Click here to make a bio") && ownAccount;

  return (
    <>
      <Segment>
        <Grid stackable>
          <Grid.Column width={11}>
            <Grid.Row>
              <Header 
                as="h2"
                content={profile.user.name}
                style={{marginBottom: "5px"}}
              />
            </Grid.Row>
            <Grid.Row stretched>
              {isDefaultBio ? (
                <p
                  style={{cursor: 'pointer'}}
                  onClick={() => setActiveItem('updateProfile')}
                >{profile.bio}</p>
              ) : (
                <p>{profile.bio}</p>
              )}
              <Divider hidden />
            </Grid.Row>
            <Grid.Row>
              {profile.social ? (
                <></>
              ) : (
                <p>No Social Media Links</p>
              )}
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Segment>
    </>
  );
};

export default ProfileHeader;
