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
        Headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.error(err)
    }
  }

  return <>

  </>;
};

messages.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseURL}/api/v1/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { chatsData: res.data };
  } catch (err) {
    console.error(err);
    return { errorLoading: true };
  }
};

export default messages;
