import React, { useState, useEffect } from 'react';
import { Typography, Container, Fab } from '@material-ui/core';
import { SERVER_URL } from '../constants';
import axios from 'axios';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

function SetRoomData({ roomId, room }) {
  console.log('BidResult -> SetRoomData');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function call() {
      const snapshot = await db
        .doc(`rooms/${roomId}`)
        .set({ peerList: room.peerList }, { merge: true });
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

function BidResult({ match }) {
  console.log('BidResult');

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

  if (room.peerList == null) {
    room.peerList = [];
  }
  const userId = localStorage.getItem('userId');
  room.peerList = [userId, ...room.peerList];

  // Set complete status
  if (room.maxUser == room.peerList.length) {
    room.peerCompleted = true;
  }

  return <SetRoomData roomId={roomId} room={room} />;
}

export default BidResult;
