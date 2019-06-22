import React from 'react';
import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  LinearProgress,
  Container,
  withStyles,
  Typography,
} from '@material-ui/core';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

function MemberCard({
  userId,
  member = { name: null, status: { peered: false } },
}) {
  const [user, loading, error] = useDocumentData(db.doc(`users/${userId}`));
  if (loading || error) {
    return null;
  }

  return (
    <Card style={{ marginTop: '1em', marginBottom: '1em' }}>
      {/* <CardHeader
        avatar={<Avatar>{member.name ? member.name.charAt(0) : '?'}</Avatar>}
        title={member.name || 'No name'}
        subheader={
          member.status.peered
            ? 'Peered on round ' + member.status.peeredOnRound
            : 'Not peered'
        }
      /> */}
      <CardHeader
        avatar={<Avatar>{user.name ? user.name.charAt(0) : '?'}</Avatar>}
        title={user.name + ' ' + user.surname}
        // subheader={
        //   userInfo.peerOnRound
        //     ? 'Peered on round ' + userInfo.peerOnRound
        //     : 'Not peered'
        // }
      />
    </Card>
  );
}
export default MemberCard;
