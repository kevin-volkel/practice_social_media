import React, { useState, useRef } from 'react';
import { Form, Button, Image, Divider, Message, Icon } from 'semantic-ui-react';
import { submitNewPost } from '../../util/postActions';
import axios from 'axios';

const CreatePost = ({ user, setPosts }) => {
  const [newPost, setNewPost] = useState({ text: '', location: '' });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  //* HANDLERS

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (name === 'media') {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const addStyles = () => ({
    textAlign: 'center',
    height: '150px',
    width: '150px',
    border: 'dotted',
    paddingTop: media === null && '60px',
    cursor: 'pointer',
    borderColor: highlighted ? 'green' : 'black',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let picURL;

    if (media) {
      const formData = new FormData();
      formData.append('image', media, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const res = await axios.post('/api/v1/upload', formData);
      picURL = res.data.src;
      console.log(`PicUrl: ${picURL}`)
    }

    await submitNewPost(
      newPost.text,
      newPost.location,
      picURL,
      setPosts,
      setNewPost,
      setError
    );

    setMedia(null);
    setMediaPreview(null);
    setLoading(false);
  };

  return (
    <>
      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header="Oops!"
        />
        <Form.Group>
          <Image src={user.profilePicURL} circular avatar inline />
          <Form.TextArea
            placeholder="What's happening?"
            width={15}
            rows={4}
            onChange={handleChange}
            name="text"
            value={newPost.text}
          />
        </Form.Group>
        <Form.Group>
          <Form.Input
            value={newPost.location}
            name="location"
            onChange={handleChange}
            label="Add Location"
            icon="map marker alternate"
            placeholder="Where?"
          />
          <input
            ref={inputRef}
            onChange={handleChange}
            name="media"
            style={{ display: 'none' }}
            type="file"
            accept="image/*"
          />
        </Form.Group>
        <div
          onClick={() => inputRef.current.click()}
          style={addStyles()}
          onDrag={(e) => {
            e.preventDefault();
            setHighlighted(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setHighlighted(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setHighlighted(true);

            const droppedFile = Array.from(e.dataTransfer.files);
            setMedia(droppedFile[0]);
            setMediaPreview(URL.createObjectURL(droppedFile[0]));
          }}
        >
          {media === null ? (
            <Icon name="plus" size="big" />
          ) : (
            <Image
              style={{ height: '150px', width: '150px', objectFit: "contain" }}
              src={mediaPreview}
              alt="Post Image"
              centered
              size="medium"
            />
          )}
        </div>
        <Divider hidden />
        <Button 
          circular
          color="orange"
          disabled={newPost.text === "" || loading}
          icon="send"
          content={<strong>Post</strong>}
          loading={loading}
        />
      </Form>
      <Divider />
    </>
  );
};

export default CreatePost;
