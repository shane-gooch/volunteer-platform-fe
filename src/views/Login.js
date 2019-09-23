import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { StyledButton, StyledForm, StyledInput } from '../styled';
import { Form, Icon } from 'antd';
import {
  signIn,
  GOOGLE_PROVIDER,
  FACEBOOK_PROVIDER,
  TWITTER_PROVIDER,
  EMAIL_PROVIDER,
} from '../actions';
import { useStateValue } from '../hooks/useStateValue';

const StyledLogin = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const Inline = styled.div`
  display: flex;
`;

export const Login = props => {
  const [state, dispatch] = useStateValue();
  const [localState, setState] = useState({});
  const [pathName, setPathName] = useState(props.location.pathname);
  const onChange = e => {
    setState({ ...localState, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setPathName(props.location.pathname);
  }, [props.location.pathname]);
  return (
    <StyledLogin>
      <h1>{pathName === `/login` ? 'Login with' : 'Sign Up'}</h1>
      <br></br>
      <Inline>
        <StyledButton
          type={'primary'}
          style={{ margin: ' 0 2rem 1rem 0' }}
          onClick={() => signIn(GOOGLE_PROVIDER, dispatch)}
        >
          <Icon type="google" />
        </StyledButton>
        <StyledButton
          type={'primary'}
          style={{ margin: ' 0 2rem 1rem 0' }}
          onClick={() => signIn(FACEBOOK_PROVIDER, dispatch)}
        >
          <Icon type="facebook" theme="filled" />
        </StyledButton>
        <StyledButton
          type={'primary'}
          onClick={() => signIn(TWITTER_PROVIDER, dispatch)}
        >
          <Icon type="twitter-square" theme="filled" />
        </StyledButton>
      </Inline>
      <StyledForm
        onSubmit={e => {
          e.preventDefault();
          signIn(
            EMAIL_PROVIDER,
            dispatch,
            localState.email,
            localState.password
          );
        }}
      >
        <StyledInput
          values={localState}
          name={'Email'}
          onChange={onChange}
          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="Email"
        />
        <Form.Item>
          <StyledInput
            values={localState}
            name={'Password'}
            onChange={onChange}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <StyledButton type="primary" htmlType="submit">
            {pathName === `/login` ? 'Login' : 'Register'}
          </StyledButton>
        </Form.Item>
      </StyledForm>
    </StyledLogin>
  );
};

export default Login;
