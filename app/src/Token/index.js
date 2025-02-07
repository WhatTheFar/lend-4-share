import React from 'react';
import { Typography, Container } from '@material-ui/core';
import { SERVER_URL, TOKEN_KEY } from '../constants';
import useFetch from 'react-fetch-hook';
import { Redirect } from 'react-router';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import queryString from 'query-string';

function CreateUser({ userId, firstName, lastName, onCreate }) {
  const [userDoc, loading, error] = useDocumentOnce(
    db.doc(`users/${userId}`).set({
      name: firstName,
      surname: lastName,
    }),
  );

  if (loading || error) return null;
  if (true) {
    onCreate();
    return <Redirect to="/" />;
  }
}

function CreateUserIfNotExist({ userId, firstName, lastName, onCreate }) {
  const [userDoc, loading, error] = useDocumentOnce(db.doc(`users/${userId}`));

  if (loading || error) return null;
  if (!userDoc.exists) {
    return (
      <React.Fragment>
        <CreateUser
          userId={userId}
          firstName={firstName}
          lastName={lastName}
          onCreate={onCreate}
        />
      </React.Fragment>
    );
  }

  onCreate();
  return <Redirect to="/" />;
}

function RequestToken({ code }) {
  const { isLoading, data } = useFetch(`${SERVER_URL}/token?code=${code}`);

  if (isLoading) {
    return (
      <React.Fragment>
        <Typography variant="h4" style={{ marginBottom: '1em' }}>
          Loading...
        </Typography>
      </React.Fragment>
    );
  }

  if (data) {
    const {
      token: { accessToken },
      resourceOwnerId,
      profile: {
        citizenID: userId,
        engFirstName: firstName,
        engLastName: lastName,
      },
    } = data;
    const onCreate = () => {
      localStorage.setItem('userId', userId);
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem('resourceOwnerId', resourceOwnerId);
      localStorage.setItem('name', firstName);
      localStorage.setItem('surname', lastName);
    };
    return (
      <CreateUserIfNotExist
        userId={userId}
        firstName={firstName}
        lastName={lastName}
        onCreate={onCreate}
      />
    );
  }

  return (
    <React.Fragment>
      <Typography variant="h4" style={{ marginBottom: '1em' }}>
        Unknown error
      </Typography>
    </React.Fragment>
  );
}

function Token({ location }) {
  const query = queryString.parse(location.search);
  const code = query.code;

  if (!code) {
    return (
      <React.Fragment>
        <Container fixed>
          <Typography variant="h4" style={{ marginBottom: '1em' }}>
            Error, no code in query params.
          </Typography>
        </Container>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Container fixed>
        <RequestToken code={code} />
      </Container>
    </React.Fragment>
  );
}

export default Token;
