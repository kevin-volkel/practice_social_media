import {Message, Button} from 'semantic-ui-react'

export const NoProfilePost = () => {
  return (
    <>
      <Message 
        info
        icon="meh"
        header="Sorry!"
        content="User has not posted anything yet"
      />
      <Button 
        icon="long arrow alternate left"
        content="Go Back"
        as="a"
        href="/"
      />
    </>
  );
}

export const NoFollowData = ({
  profileName,
  followersComponent = true,
  followingComponent = true,
}) => {
  <>
    {followersComponent && (
      <Message 
        icon="user outline"
        info
        content={`${profileName.split(' ')[0]} does not have followers`}
      />
    )}
    {followingComponent && (
      <Message 
        icon="user outline"
        info
        content={`${profileName.split(' ')[0]} does not follow anyone`}
      />
    )}
  </>
}

export const NoMessages = () => {
  return <Message 
    info
    icon='telegram plane'
    header="Sorry"
    content="You have not messaged anyone yet. Search above to find a friend"
  />
}

export const NoPosts = () => {
  return <Message 
    info
    icon='meh'
    header='Hey!'
    content="No Posts. Make sure you follow someone"
  />
}