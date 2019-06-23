import React, { useState, useEffect } from 'react';
import { Typography, Container, Fab } from '@material-ui/core';
import { SERVER_URL } from '../constants';
import { Redirect } from 'react-router';
import axios from 'axios';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

function SetRoomData({ roomId, room }) {
  console.log('PayResult -> SetRoomData');
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function call() {
      const snapshot = await db
        .doc(`rooms/${roomId}`)
        .set({ payList: room.payList }, { merge: true });
      setLoading(false);
    }

    call();
  }, []);

  if (loading) {
    return (
      <React.Fragment>
        <Typography variant="h4" style={{ marginBottom: '1em' }}>
          Loading...
        </Typography>
      </React.Fragment>
    );
  }

  return <Redirect to="/" />;
}

function PayResult({ match }) {
  console.log('PayResult');

  const roomId = match.params.id;
  const [roomSnapshot, loading, error] = useDocumentOnce(
    db.doc(`rooms/${roomId}`),
  );
  if (loading) {
    return (
      <React.Fragment>
        <Typography variant="h4" style={{ marginBottom: '1em' }}>
          Loading...
        </Typography>
      </React.Fragment>
    );
  }
  if (error) {
    return (
      <React.Fragment>
        <Typography variant="h4" style={{ marginBottom: '1em' }}>
          Error...
        </Typography>
      </React.Fragment>
    );
  }
  const room = roomSnapshot.data();

  if (room.payList == null) {
    room.payList = [];
  }
  const userId = localStorage.getItem('userId');
  room.payList = [userId, ...room.payList];

  // Set complete status
  if (room.maxUser == room.payList.length) {
    room.payCompleted = true;
  }

  return <SetRoomData roomId={roomId} room={room} />;
}

export default PayResult;
