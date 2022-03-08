import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { baseURL } from './util/auth';
import { parseCookies } from 'nookies';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { Segment, Header, Divider, Comment, Grid } from 'semantic-ui-react';

const scrollDivToBottom = (divRef) =>
  divRef.current !== null &&
  divRef.current.scrollIntoView({ behavior: 'smooth' });

const messages = ({ chatsData, user }) => {
  const [chats, setChats] = useState(chatsData);
  const router = useRouter();

  const socket = useRef();
  const [connectedUsers, setConnectedUsers] = useState([]);

  const [messages, setMessages] = useState([]);
  const [bannerData, setBannerData] = useState({ name: '', profilePicURL: '' });

  const divRef = useRef();
  const openChatId = useRef();

  // useEffect( () => {
  //   if(!socket.current) {
  //     socket.current = io('http://localhost:3000');
  //   }

  //   if(socket.current) {
  //     socket.current.emit('pingServer', {name: "Jimmy", age: 235})
  //   }
  // }, [])

  const deleteChat = async (messagesWith) => {
    try {
      await axios.delete(`${baseURL}/api/v1/messages/${messagesWith}`, {
        Headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });

      setChats((prev) =>
        prev.filter((chat) => chat.messagesWith !== messagesWith)
      );
      router.push('/messages', undefined, { shallow: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Segment>
      <Header
        icon="home"
        content="Go Back"
        onClick={() => router.push('/')}
        style={{ cursor: 'pointer' }}
      />
      <Divider hidden />
      <div style={{ marginTop: '10px' }}>
        <p>Chat Search Component</p>
      </div>

      {chats.length > 0 ? (
        <>
          <Grid stackable>
            <Grid.Column width={4}>
              <Comment.Group size="big">
                <Segment raised style={{overflow: 'auto', maxHeight: '32rem'}}>
                  {chats.map( (chat, i) => (
                    <p key={i}>Chat component</p>
                  ))}
                </Segment>
              </Comment.Group>
            </Grid.Column>
            <Grid.Column width={14}>
              {router.query.message && (
                <>
                  <div style={{
                    overflow: 'auto',
                    overflowX: 'hidden',
                    maxHeight: "32rem",
                    height: "32rem",
                    backgroundColor: 'whitesmoke'
                  }}>
                    <div style={{position: 'sticky', top: '0'}}>
                      <p>Banner Component</p>
                    </div>
                    {messages.length > 0 && messages.map( (message, i) => {
                      <p key={i}>Message Component</p>
                    })}
                  </div>

                  <p>Message Input Component</p>
                </>
              )}
            </Grid.Column>
          </Grid>
        </>
      ) : (
        <p> No chats </p>
      )}
    </Segment>
  );
};

messages.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseURL}/api/v1/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(res.data);
    return { chatsData: res.data };
  } catch (err) {
    console.error(err);
    return { errorLoading: true };
  }
};

export default messages;
