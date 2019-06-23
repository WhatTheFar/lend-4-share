import React, { useState, useEffect } from 'react';
import { Person, AccountCircle } from '@material-ui/icons'
import { Typography, Container, Fab, Divider } from '@material-ui/core';
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
      <Container fixed style={{height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '-2em'}}>
        {/* <AccountCircle style={{fontSize: '20em', textAlign: 'center'}} color="disabled" /> */}
        <img src="https://i.imgur.com/ldbQaSn.png" style={{width: '70vw', objectFit: 'contain'}} />
        <div style={{height: '1em'}}></div>
        <Typography variant="h4" style={{ marginBottom: '1em' }} align="center">
          Login
        </Typography>
        {/* <Fab variant="extended" href={`${SERVER_URL}/login`} color="primary" aria-label="Add" style={{margin: "10px"}}>
          Login with SCB
        </Fab> */}
        <Fab
          variant="extended"
          disabled={!url}
          aria-label="Add"
          style={{ margin: '10px'}}
        >
          <a href={url} style={{textDecoration: 'none' }}>Login with SCB</a>
        </Fab>
      </Container>
    </div>
  );
}

export default Login;
