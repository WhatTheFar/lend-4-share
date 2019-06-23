import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Fab,
} from '@material-ui/core';
import { AccountBalance } from '@material-ui/icons';
import axios from 'axios';
import { BILLER_ID, SERVER_URL, CLIENT_URL, TOKEN_KEY } from '../../constants';

function BidPeerCard({ roomId, event }) {
  console.log('BidPeerCard');

  const [url, setUrl] = useState('');

  useEffect(() => {
    async function call() {
      const result = await axios.post(
        `${SERVER_URL}/deeplink`,
        {
          paymentAmount: '2000',
          accountTo: BILLER_ID,
          resourceOwnerId: localStorage.getItem('resourceOwnerId'),
        },
        { headers: { token: localStorage.getItem(TOKEN_KEY) } },
      );
      console.log('url', result.data);
      setUrl(
        result.data.deeplinkUrl +
          `?callback_url=${CLIENT_URL}/bid-result/${roomId}`,
      );
    }
    call();
  }, []);

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h5" align="center">
            <AccountBalance /> Bid Peer
          </Typography>
        }
        style={{ paddingBottom: 0 }}
      />
      <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
        {event.paid ? (
          <Typography variant="subtitle1" color="textSecondary" align="center">
            You already bid.
          </Typography>
        ) : null}
        {event.paid ? null : (
          <Fab
            variant="extended"
            disabled={!url && !event.paid}
            color="primary"
            aria-label="Add"
            style={{ margin: '10px', flex: 1 }}
          >
            <a href={url}>Pay with SCB</a>
          </Fab>
        )}
      </CardContent>
    </Card>
  );
}

export default BidPeerCard;
