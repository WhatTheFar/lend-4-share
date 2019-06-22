import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';

import { Route, Switch } from 'react-router-dom';

import RoomInfo from './RoomInfo';
import EventHistory from './EventHistory';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Login from './Login';
import Token from './Token';

const styles = theme => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
});

function Content(props) {
  const { classes } = props;

  // const token = localStorage.getItem('token');
  const token = "token"

  if (token) {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/room/:id" component={RoomInfo} />
          <Route path="/events" component={EventHistory} />
          <Route path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/" component={Dashboard} />
        </Switch>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/token" component={Token} />
          <Route path="/" component={Login} />
        </Switch>
      </React.Fragment>
    );
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
