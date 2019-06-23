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

import { Route, Switch, withRouter } from 'react-router-dom';

import RoomInfo from './RoomInfo';
import EventHistory from './EventHistory';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Login from './Login';
import Token from './Token';
import PayResult from './Result/PayResult';
import BidResult from './Result/BidResult';
import { TOKEN_KEY } from './constants';

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

const InRoom = withRouter(props => {
  switch (props.tabId) {
    case 0:
      return <RoomInfo {...props} />;
    case 1:
      return <EventHistory {...props} />;
    default:
      return <RoomInfo {...props} />;
  }
});

function Content(props) {
  const { classes, tabId } = props;

  const token = localStorage.getItem(TOKEN_KEY);
  console.log('first token', token);
  // const token = 'token';

  if (token) {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/room/:id" render={() => <InRoom tabId={tabId} />} />
          <Route path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/pay-result/:id" component={PayResult} />
          <Route path="/bid-result/:id" component={BidResult} />
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

export default withRouter(withStyles(styles)(Content));
