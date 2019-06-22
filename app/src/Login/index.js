import React, { useState, useEffect } from 'react';
import { Typography, Container, Fab } from '@material-ui/core';
import { SERVER_URL } from '../constants';
import { Redirect } from 'react-router';
import axios from 'axios';

function Login() {
  console.log('Login');

  const [url, setUrl] = useState('');

  useEffect(() => {
    async function call() {
      const result = await axios(`${SERVER_URL}/login`);
      console.log('url', result.data);
      setUrl(result.data.callbackUrl);
    }
    call();
  }, []);

  return (
    <div>
      <Container fixed>
        <Typography variant="h4" style={{ marginBottom: '1em' }}>
          Login
        </Typography>
        {/* <Fab variant="extended" href={`${SERVER_URL}/login`} color="primary" aria-label="Add" style={{margin: "10px"}}>
          Login with SCB
        </Fab> */}
        <Fab
          variant="extended"
          // onClick={onClick}
          // href={url}
          disabled={!url}
          color="primary"
          aria-label="Add"
          style={{ margin: '10px' }}
        >
          <a href={url}>Login with SCB</a>
        </Fab>
      </Container>
    </div>
  );
}

export default Login;
