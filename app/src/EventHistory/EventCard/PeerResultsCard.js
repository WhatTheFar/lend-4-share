import React from 'react';
import { Card, Avatar, CardHeader, Typography } from '@material-ui/core';

function PeerResultsCard({ event }) {
  return (
    <Card>
      <CardHeader
        avatar={<Avatar>{event.name.charAt(0)}</Avatar>}
        title={<Typography variant="h5">{event.name} win!</Typography>}
        subheader="Bid: 10฿, Total Peered Fund: 4010"
      />
    </Card>
  );
}

export default PeerResultsCard;
