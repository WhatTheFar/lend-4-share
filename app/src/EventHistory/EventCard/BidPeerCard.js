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
import { BILLER_ID, SERVER_URL, CLIENT_URL } from '../../constants';

function BidPeerCard() {
  console.log('BidPeerCard');

  const [url, setUrl] = useState('');

  useEffect(() => {
    async function call() {
      const result = await axios.post(
        `${SERVER_URL}/deeplink`,
        {
          paymentAmount: '2000',
          accountTo: BILLER_ID,
        },
        { headers: { token: '81cba5ac-c747-41e1-b861-e8e124dc3238' } },
      );
      console.log('url', result.data);
      setUrl(
        result.data.deeplinkUrl + `?callback_url=${CLIENT_URL}/bid-result`,
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
      <CardContent>
        <Typography variant="subtitle1" color="textSecondary" align="center">
          Bid ended.
        </Typography>
        <Fab
          variant="extended"
          disabled={!url}
          color="primary"
          aria-label="Add"
          style={{ margin: '10px' }}
        >
          <a href={url}>Pay with SCB</a>
        </Fab>
      </CardContent>
    </Card>
  );
}

export default BidPeerCard;
