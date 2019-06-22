import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';
import {
  Container,
  Card,
  CardHeader,
  Avatar,
  Fab,
  Modal,
  CardContent,
  TextField,
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { db } from '../firebase';

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

function removeTimeFromDate(date) {
  const oldDateISO = date.toISOString();
  const newDateStr = oldDateISO.substring(0, oldDateISO.indexOf('T'));
  return new Date(newDateStr);
}

function RoomItem({ roomId, roomItem }) {
  const currentTime = removeTimeFromDate(new Date()).getTime();
  const startDateTime = removeTimeFromDate(roomItem.startDate).getTime();
  const diffTime = startDateTime - currentTime;
  let diffDate = diffTime / day;

  const period = roomItem.period;

  let round = 0;
  if (diffDate < 0) {
    round = Math.floor(Math.abs(diffDate) / period);
    diffDate = period * (round + 1);
  }

  let timeText = '';
  if (diffDate === 0) {
    timeText = 'Today!';
  } else if (diffDate === 1) {
    timeText = `In ${diffDate} day`;
  } else if (diffDate <= 7) {
    timeText = `In ${diffDate} days`;
  } else {
    const startDate = roomItem.startDate;
    startDate.setDate(startDate.getDate() + diffDate);
    timeText = new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(startDate);
  }

  return (
    <Link to={`/room/${roomId}`} style={{ textDecoration: 'none' }}>
      <Card style={{ marginTop: '1em', marginBottom: '1em' }}>
        <CardHeader
          avatar={
            <Avatar>{roomItem.name ? roomItem.name.charAt(0) : '?'}</Avatar>
          }
          title={roomItem.name || 'No name'}
          subheader={'฿ ' + roomItem.amount + ' - ' + timeText}
        />
      </Card>
    </Link>
  );
}

function CreateRoomModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          width: '100%',
          transform: 'translate(0, -50%)',
        }}
      >
        <Card>
          <CardHeader title="Create new room" />
          <CardContent>
            <form>
              <TextField
                name="roomName"
                label="Room Name"
                placeholder="Peer Share 009"
                fullWidth
              />
              <br />
              <TextField
                type="date"
                name="StartDate"
                label="Start Date"
                defaultValue={new Date()
                  .toISOString()
                  .substr(0, new Date().toISOString().indexOf('T'))}
                fullWidth
              />
              <TextField
                type="number"
                name="periodWeek"
                label="Peer Period (Week)"
                defaultValue={2}
                fullWidth
              />
              <TextField
                type="number"
                name="shareAmount"
                label="Share Amount"
                defaultValue={2000}
                fullWidth
              />
              <div>
                <Button variant="text">Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
}

function Dashboard({ userId }) {
  // const [open, setOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const [roomsSnapshot, loading, error] = useCollectionOnce(
    db.collection('rooms').where('users', 'array-contains', userId || 'test'),
    // .where('users', 'array-contains', {
    //   ref: db.doc(`/users/${userId || 'test'}`),
    //   peerOnRound: 1
    // }),
  );

  const onClose = () => setOpen(false);

  if (loading || error) {
    return null;
  }

  return (
    <div>
      <Container>
        {/* {roomItemList.map(roomItem => (
          <RoomItem roomItem={roomItem} />
        ))} */}
        {roomsSnapshot.docs.map(doc => {
          const roomItem = doc.data();
          roomItem.startDate = roomItem.startDate.toDate();
          return <RoomItem roomId={doc.id} roomItem={roomItem} />;
        })}
      </Container>
      <CreateRoomModal open={open} onClose={onClose} />
      <Fab
        style={{ position: 'absolute', bottom: '2em', right: '2em' }}
        color="primary"
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}

export default Dashboard;
