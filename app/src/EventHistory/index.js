import React, { useState } from 'react';
import { Typography, Avatar, Paper } from '@material-ui/core';
import { useDocument } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

import EventCard from './EventCard';

const events = [
  {
    type: 'roundStart',
    roundNumber: 1,
  },
  {
    type: 'payShare',
    payList: ['P', 'W', 'J', 'N', 'T'],
    everyonePaid: true,
    paid: false,
  },
  {
    type: 'bidPeer',
  },
  {
    type: 'peerResults',
  },
];

function EventHistory({ match }) {
  const roomId = match.params.id;

  // const [eventId, setEventId] = useState(5);

  const [roomSnapshot, loading, error] = useDocument(db.doc(`rooms/${roomId}`));

  if (loading || error) return null;

  const room = roomSnapshot.data();
  const userId = localStorage.getItem('userId');

  let eventId = 5;

  let paid = false;
  let everyonePaid = false;
  let peered = false;
  let everyonePeer = false;

  let events = [];

  events = [
    ...events,
    {
      type: 'roundStart',
      roundNumber: 1,
    },
  ];
  if (room.payList) {
    paid = room.payList.reduce((prev, value) => value == userId || prev, false);
    everyonePaid = room.payList.length >= room.maxUser;
  }
  events = [
    ...events,
    {
      type: 'payShare',
      payList: ['P', 'W', 'J', 'N', 'T'],
      everyonePaid: everyonePaid,
      paid: paid,
    },
  ];
  eventId = 1;

  if (room.peerList) {
    peered = room.peerList.reduce(
      (prev, value) => value == userId || prev,
      false,
    );
    everyonePeer = room.peerList.length >= room.maxUser;
  }
  if (everyonePaid) {
    events = [
      ...events,
      {
        type: 'bidPeer',
        paid: peered,
      },
    ];
    eventId = 2;
  }
  if (everyonePeer) {
    events = [
      ...events,
      {
        type: 'peerResults',
        name: room.winner,
        amount: room.amount,
      },
    ];
    eventId = 3;
  }

  return (
    <div>
      <Typography variant="h6">Event History</Typography>

      {events.map(event => (
        <EventCard roomId={roomId} event={event} />
      ))}
    </div>
  );
}
export default EventHistory;
