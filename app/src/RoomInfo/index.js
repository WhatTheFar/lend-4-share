import React from 'react';
import { Typography } from '@material-ui/core';
import MemberCard from './MemberCard';
import {
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

const members = [
  {
    name: 'Piriyapong Laopongsit',
    status: {
      peered: false,
    },
  },
  {
    name: 'Jakpat Mingmongkolmitr',
    status: {
      peered: true,
      peeredOnRound: 1,
    },
  },
  {
    name: 'Natchapol Srisang',
    status: {
      peered: true,
      peeredOnRound: 2,
    },
  },
  {
    name: 'Wattanai Thangsrirojkul',
    status: {
      peered: false,
    },
  },
  {
    name: 'Thad Benjapolpitak',
    status: {
      peered: false,
    },
  },
];

function RoomInfo({ match }) {
  console.log('RoomInfo');
  const roomId = match.params.id;
  const [roomSnapshot, loading, error] = useDocumentData(
    db.doc(`rooms/${roomId}`),
  );
  if (loading || error) {
    return null;
  }

  const room = roomSnapshot;
  room.startDate = room.startDate.toDate();
  console.log(room);

  return (
    <div>
      <Typography variant="h6">Room info</Typography>
      <Typography variant="h5" gutterBottom>
        <strong>แชร์ตังสบายจัย</strong>
      </Typography>

      <hr />

      <Typography gutterBottom>
        Members: <strong>5</strong>
        <br />
        Share Date: <strong>{room.startDate.toISOString()}</strong>
        <br />
        Share Amount: <strong> ฿ {room.amount} </strong>
        <br />
        Peer Dates: <strong> Every {room.period} days</strong>
      </Typography>

      <hr style={{ marginTop: '1em', marginBottom: '1em' }} />

      <Typography variant="h6">Members</Typography>
      {/* {members.map(member => (
        <MemberCard member={member} />
      ))} */}
      {room.users.map(userId => (
        <MemberCard userId={userId} />
      ))}
    </div>
  );
}

export default RoomInfo;
