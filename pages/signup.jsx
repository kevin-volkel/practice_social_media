import { HeaderMessage, FooterMessage } from './components/common/Messages';
import { useRef, useState, useEffect } from 'react';
import { Divider, Form, Segment, TextArea, Button, Message } from 'semantic-ui-react';
import catchErrors from './util/catchErrors';
import { setToken } from './util/auth'
import CommonSocials from './components/common/CommonSocials';
import DragNDrop from './components/common/DragNDrop';
import axios from 'axios'
let cancel;

const signup = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    facebook: '',
    twitter: '',
    youtube: '',
    instagram: '',
  });

  const { name, email, password, bio } = user;

  //* Form States
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [username, setUsername] = useState('');

  const [showSocialLinks, setShowSocialLinks] = useState(false);

  const inputRef = useRef(null);
  const [highlighted, setHighlighted] = useState(false);
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true)

    let profilePicURL;

    if(media !== null) {
      const formData = new FormData();
      formData.append("image", media, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      const res = await axios.post('/api/v1/upload', formData)
      profilePicURL = res.data.src;
    }

    if (media !== null && !profilePicURL) {
      setFormLoading(false)
      return res.status(500).send("Image Upload Error")
    }

    try{
      const res = await axios.post('/api/v1/user/signup', {
        user,
        profilePicURL
      });

      setToken(res.data)
    } catch (err) {
      const errorMsg = catchErrors(err);
      setErrorMsg(errorMsg)
    }

    setFormLoading(false)
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if(name == "media" && files.length) {
      setMedia(() => files[0])
      setMediaPreview( () => URL.createObjectURL(files[0]))
      setHighlighted(true)
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const checkUsername = async () => {
    const cancelToken = axios.CancelToken;

    setUsernameLoading(true)
    try {
      cancel && cancel();
      const res = await axios.get(`/api/v1/user/${username}`, {
        cancelToken: new cancelToken( (canceler) => {
          cancel = canceler;
        })
      })
      if(res.data === 'Affirmative') {
        setUsernameAvailable(true);
        setErrorMsg(null)
        setUser( (prev) => ({ ...prev, username}))
      }
    } catch (err) {
      setErrorMsg('Username is not available')
      setUsernameAvailable(false)
      console.error(err);
    }
    setUsernameLoading(false)
  }

  //* EFFECTS 
  useEffect(() => {
    // const isUser = Object.values({name, email, password}).every( (item) => Boolean(item))
    // const isUser = name && email && password
    setSubmitDisabled( !(name && email && password && username) )
  }, [user, username]);
  

  useEffect( () => {
    username === '' ? setUsernameAvailable(false) : checkUsername(  )
  },[username])

  return (
    <>
      <HeaderMessage />
      <Form
        loading={formLoading}
        error={errorMsg !== null}
        onSubmit={handleSubmit}
      >
        <Segment>
          <DragNDrop
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            inputRef={inputRef}
            handleChange={handleChange}
            media={media}
            setMedia={setMedia}
            mediaPreview={mediaPreview}
            setMediaPreview={setMediaPreview}
          />
          <Message 
            error 
            content={errorMsg} 
            header="Oops All Berries!" 
            icon='meh'
          />
          {/* DRAG AND DROP IMAGE HERE */}
          <Form.Input
            required
            label="Name"
            placeholder="name"
            name="name"
            value={name}
            onChange={handleChange}
            icon="user"
            iconPosition="left"
          />
          <Form.Input
            required
            label="Email"
            placeholder="email"
            name="email"
            value={email}
            onChange={handleChange}
            icon="envelope"
            iconPosition="left"
            type="email"
          />
          <Form.Input
            required
            label="Password"
            placeholder="password"
            name="password"
            value={password}
            onChange={handleChange}
            icon={{
              name: showPassword ? 'eye slash' : 'eye',
              circular: true,
              link: true,
              onClick: () => setShowPassword(!showPassword),
            }}
            iconPosition="left"
            type={showPassword ? 'text' : 'password'}
          />
          <Form.Input
            loading={usernameLoading}
            error={!usernameAvailable}
            required
            label="Username"
            placeholder="username"
            name="username"
            value={username}
            icon={usernameAvailable ? 'check' : 'close'}
            iconPosition="left"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Divider hidden />
          <Form.Field
            control={TextArea}
            name="bio"
            value={bio}
            onChange={handleChange}
            placeholder="bio"
          />
          <CommonSocials
            user={user}
            handleChange={handleChange}
            showSocialLinks={showSocialLinks}
            setShowSocialLinks={setShowSocialLinks}
          />
          <Button 
            type="submit"
            icon="signup"
            content="Sign Up"
            color="green"
            disabled={submitDisabled || !usernameAvailable}
          />
        </Segment>
      </Form>
      <FooterMessage />
    </>
  );
};

export default signup;
