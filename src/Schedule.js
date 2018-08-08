import React from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Phone from '@material-ui/icons/Phone';
import Cake from '@material-ui/icons/Cake';
import Email from '@material-ui/icons/Email';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/ArrowBackIos';
import Typography from '@material-ui/core/Typography';
import Inactive from '@material-ui/icons/NotInterested';
import Active from '@material-ui/icons/VerifiedUser';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  root: {
    flexGrow: 1,
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  button: {
    margin: theme.spacing.unit,
  },
  rightAlign: {
    margin: theme.spacing.unit,
    float: 'right', 
    cursor: 'pointer'
  },
  leftAlign:{
    margin: theme.spacing.unit,
    float: 'left', 
  },
  table: {
    minWidth: 500,
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    position: 'absolute',
    width: theme.spacing.unit,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  userPaper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  input: {
    margin: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  spacing: '16'
});


class InteractiveList extends React.Component {
  state = {
    results: []
  }

  componentWillMount = function(){
    if(!localStorage.getItem('results')) {
      this.props.history.push('/');
    } else {
      this.setState({results: JSON.parse(localStorage.getItem('results'))});
    }
  }

  createDob = function(value){
    var givenBirthDate = new Date(value);
    var date = givenBirthDate.getDate();
    var month = givenBirthDate.getMonth() + 1;
    var year = givenBirthDate.getFullYear();
    var dateOfBirth = date + '/' + month + '/' + year;
    return dateOfBirth;
  }

  handleDailogClose = () => {
    this.props.history.push('/');
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
      <AppBar className={classes.appBar}>
      <Toolbar>
      <IconButton className={classes.rightAlign} color="inherit" onClick={this.handleDailogClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
        <Typography variant="title" color="inherit" className={classes.flex}>
          User Detail : {this.state.results.first_name + ' ' + this.state.results.last_name}
        </Typography>
      </Toolbar>
    </AppBar>
    <Grid container className={classes.root} spacing={16}>
          <Grid item xs></Grid>
          <Grid item xs={10}>
            <Paper className={classes.userPaper}>
              <List>
                <ListItem>
                  <Avatar>
                    <AccountCircle />
                  </Avatar>
                  <ListItemText primary="Name" secondary={this.state.results.first_name + ' ' + this.state.results.last_name} />
                </ListItem>
                <ListItem>
                  <Avatar>
                    <Email />
                  </Avatar>
                  <ListItemText primary="Email" secondary={this.state.results.email} />
                </ListItem>
                <ListItem>
                  <Avatar>
                    <Phone />
                  </Avatar>
                  <ListItemText primary="Phone" secondary={this.state.results.phone} />
                </ListItem>
                <ListItem>
                  <Avatar>
                    <Cake />
                  </Avatar>
                  <ListItemText primary="Date of Birth" secondary={this.createDob(this.state.results.dob)} />
                </ListItem>
                { this.state.results.active ?
                <ListItem>
                  <Avatar>
                    <Active />
                  </Avatar>
                  <ListItemText primary="Active" secondary='Active User' />
                </ListItem> :
                <ListItem>
                <Avatar>
                  <Inactive />
                </Avatar>
                <ListItemText primary="Active" secondary='Inactive User' />
              </ListItem>
                }
            </List>
            </Paper>
          </Grid>
          <Grid item xs></Grid>
    </Grid>
    </div>
    );
  }
}

InteractiveList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InteractiveList);