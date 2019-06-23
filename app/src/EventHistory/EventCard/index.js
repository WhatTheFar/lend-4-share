import React from 'react';
import { LocalAtm, AccountBalance } from '@material-ui/icons';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Container,
  Avatar,
} from '@material-ui/core';

import RoundStartCard from './RoundStartCard';
import PayShareCard from './PayShareCard';
import BidPeerCard from './BidPeerCard';
import PeerResultsCard from './PeerResultsCard';

function EventCard({ event, roomId }) {
  switch (event.type) {
    case 'roundStart':
      return <RoundStartCard roomId={roomId} event={event} />;
    case 'payShare':
      return <PayShareCard roomId={roomId} event={event} />;
    case 'bidPeer':
      return <BidPeerCard roomId={roomId} event={event} />;
    case 'peerResults':
      return <PeerResultsCard roomId={roomId} event={event} />;
    default:
      return (
        <Card>
          <CardContent> EventCard </CardContent>
        </Card>
      );
  }
}

export default EventCard;
