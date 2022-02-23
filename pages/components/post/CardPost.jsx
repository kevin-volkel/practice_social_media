import React, { useEffect, useState } from 'react'
import {
  Card,
  Icon,
  Image,
  Divider,
  Segment,
  Button,
  Popup,
  Header,
  Modal
} from 'semantic-ui-react'
import PostComments from './PostComments'
import CommentInputField from './CommentInputField'
import Link from 'next/link'
import LikesList from './LikesList'
import ImageModal from './ImageModal'
import NoImageModal from './NoImageModal'
import calculateTime from '../../util/calculateTime'
import { deletePost, likePost } from '../../util/postActions'
import { getIcon } from '../../util/getIcon'

const CardPost = ({ post, user, setPosts, setShowToastr }) => {

  const [icon, setIcon] = useState(getIcon())
  
  
  
  const [likes, setLikes] = useState(post.likes)
  const isLiked = likes.find( (like) => like.user === user._id)
  
  const [comments, setComments] = useState(post.comments)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  useEffect(() => {
    setIcon(getIcon())
  }, [isLiked])

  const addPropsToModal = () => ({
    post,
    user,
    setLikes,
    likes,
    isLiked,
    comments,
    setComments
  })

  return <>
    <Segment basic>
      <Card color="orange" fluid>
        {post.picURL && (
          <Image 
            src={post.picURL}
            style={{ cursor: "pointer" }}
            floated='left'
            wrapped
            ui={false}
            alt="Post Image"
            onClick= {() => setShowModal(true)}
          />
        )}
        <Card.Content>
          <Image 
            floated="left"
            src={post.user.profilePicURL}
            avatar
            circular
          />
          {(user.role === 'admin' || post.user._id === user._id) && (
            <>
              <Popup 
                on={'click'}
                position="top right"
                trigger={<Image 
                    src='/deleteIcon.svg'
                    style={{cursor: 'pointer'}}
                    size="mini"
                    floated="right"
                  />
                }
              >
                <Header as={'h4'} content="Are you sure?"/>
                <p>This action is irreversable</p>
                
                <Button 
                  color="red"
                  icon="trash"
                  content="Delete"
                  onClick={() => deletePost(post._id, setPosts, setShowToastr)}
                />
              </Popup>
            </>
          )}

          <Card.Header>
            <Link href={`/${post.user.username}`}>
              <a>{post.user.name}</a>
            </Link>
          </Card.Header>

          <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>
          {post.location && <Card.Meta
            content={post.location}
          />}

          <Card.Description
            style={{ fontSize: '1.5rem', letterSpacing: '0.2px'}}
          >{post.text}</Card.Description>
        </Card.Content>
        <Card.Content extra>
            <Icon 
              name={icon}
              color={isLiked ? 'red' : undefined}
              style={{ cursor: 'pointer' }}
              onClick={() => likePost(post._id, user._id, setLikes, !isLiked)}
            />
            <LikesList 
              postId={post._id}
              trigger={
                likes.length > 0 && (
                  <span className="spanLikesList">
                    {`${likes.length} ${likes.length === 1 ? 'like' : 'likes'}`}
                  </span>
                )
              }
            />
            <Icon 
              name="comment outline"
              style={{ marginLeft: '7px' }}
              color='blue'
            />
            {comments.length && (
              comments.map((comment, i) => (
                (i < 3) && (
                  <PostComments 
                    key={comment._id}
                    comment={comment}
                    postId={post._id}
                    user={user}
                    setComments={setComments}
                  />
                )
              ))
            )}
            {comments.length > 3 && (
              <Button 
                content="View More"
                color='orange'
                basic
                circular
                onClick={() => setShowModal(true)}
              />
            )}
        </Card.Content>
      </Card>
    </Segment>
  </>
}

export default CardPost;