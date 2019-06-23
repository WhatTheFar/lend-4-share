import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  Typography,
  CardContent,
  Container,
  Avatar,
  Fab,
} from '@material-ui/core';
import { LocalAtm } from '@material-ui/icons';
import axios from 'axios';
import { BILLER_ID, SERVER_URL, CLIENT_URL, TOKEN_KEY } from '../../constants';

function PayShareCard({ roomId, event }) {
  console.log('PayShareCard');

  const [url, setUrl] = useState('');

  const token = localStorage.getItem(TOKEN_KEY);

  useEffect(() => {
    async function call() {
      const result = await axios.post(
        `${SERVER_URL}/deeplink`,
        {
          paymentAmount: 2000,
          accountTo: BILLER_ID,
          resourceOwnerId: localStorage.getItem('resourceOwnerId'),
        },
        { headers: { token } },
      );
      console.log('url', result.data);
      setUrl(
        result.data.deeplinkUrl +
          `?callback_url=${CLIENT_URL}/pay-result/${roomId}`,
      );
    }
    call();
  }, []);

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h5" align="center">
            <LocalAtm /> Pay Share
          </Typography>
        }
        titleTypographyProps={{ align: 'center' }}
        style={{ paddingBottom: 0 }}
      />
      <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
        {/* <Container style={{ display: 'flex', justifyContent: 'center' }}>
          {event.payList.map(payerInitial => (
            <Avatar> {payerInitial} </Avatar>
          ))}
        </Container> */}
        {/* <Typography variant="subtitle1" color="textSecondary" align="center">
          {event.everyonePaid ? 'Everyone paid' : 'Waiting...'}
        </Typography> */}
        {event.paid ? (
          <Typography variant="subtitle1" color="textSecondary" align="center">
            You already pay.
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
export default PayShareCard;
