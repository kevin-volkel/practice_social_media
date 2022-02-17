import { HeaderMessage, FooterMessage } from './components/common/Messages';
import { useRef, useState, useEffect } from 'react';
import { Divider, Form, Segment, TextArea, Button, Message } from 'semantic-ui-react';
import {setToken} from './util/auth'
import catchErrors from './util/catchErrors'
import axios from 'axios';
import Cookies from 'js-cookie';

const login = () => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const {email, password} = user;
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  //! Handlers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser( (prev) => ({...prev, [name]:value}))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormLoading(true)

    try {
      const res = await axios.post('/api/v1/user/login', {user})
      setToken(res.data)
    } catch (err) {
      console.log(err);
      const errorMsg = catchErrors(err)
      setErrorMsg(errorMsg)
    }

    setFormLoading(false)
  }

  //! useEffects ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  useEffect(() => {
    setSubmitDisabled(!(email && password))
  }, [user])

  useEffect( () => {
    document.title = 'Welcome back!'
    const userEmail = Cookies.get('userEmail')
    if(userEmail) setUser((prev) => ({...prev, email: userEmail}))
  }, [])

  return (
    <>
      <HeaderMessage />
      <Form
        loading={formLoading}
        error={errorMsg !== null}
        onSubmit={handleSubmit}
      >
        <Message 
          error
          header="Oops!"
          content={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />
        <Segment>
          <Form.Input 
            label="Email"
            required
            placeholder="Email"
            value={email}
            name="email"
            onChange={handleChange}
            icon="envelope"
            iconPosition='left'
            type="email"
          />
          <Form.Input
            required
            label="Password"
            placeholder="Password"
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
          <Divider hidden/>
          <Button 
            content="Login"
            icon="signup"
            type="submit"
            disabled={submitDisabled}
            color="green"
          />
        </Segment>
      </Form>
      <FooterMessage />
    </>
  );
};

export default login;
