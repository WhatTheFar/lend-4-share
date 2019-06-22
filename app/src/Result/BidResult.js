import React, { useState, useEffect } from 'react';
import { Typography, Container, Fab } from '@material-ui/core';
import { SERVER_URL } from '../constants';
import axios from 'axios';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

function UpdateFirebase() {
  // const [userDoc, loading, error] = useDocumentOnce(
  //   db.doc(`users/${userId}`).set({
  //     firstName,
  //     lastName,
  //   }),
  // );
}

function BidResult({ location }) {
  console.log('Login');

  const query = queryString.parse(location.search);
  const status = query.status;

  if (status === 'success') {
  }
  if (status === 'failed') {
    return <Redirect to="/" />;
  }

  return (
    <div>
    </div>
  );
}

export default BidResult;
