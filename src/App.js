import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route  } from 'react-router-dom'
import Schedule from './Schedule'
import DatePicker from 'react-date-picker'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import classNames from 'classnames';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Phone from '@material-ui/icons/Phone';
import Cake from '@material-ui/icons/Cake';
import Email from '@material-ui/icons/Email';
import EditIcon from '@material-ui/icons/Edit';
import PageviewIcon from '@material-ui/icons/Visibility';
import Inactive from '@material-ui/icons/NotInterested';
import Active from '@material-ui/icons/VerifiedUser';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import FormLabel from '@material-ui/core/FormLabel';

import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

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
    width: theme.spacing.unit * 50,
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
      query: '',
      results: [],
      initialItems: [],
      items: [],
      updatedList: [],
      temperoryObject: [],
      open: [false, false],
      dailogOpen: false,
      first_name : false,
      last_name: false,
      email: false,
      phone: false,
      dob: false,
      viewMode: false,
      saveState: false
    };

  componentWillMount = function(){
    this.serverRequest = fetch("https://api.myjson.com/bins/pkisp")
    .then(res => res.json())
    .then(
      (result) => {
      localStorage.setItem('data', JSON.stringify(result.users));
      this.setState({items: result.users});
      this.setState({initialItems: result.users});
    },
    (error) => {
      this.setState({
        isLoaded: true,
        error
      });
    }
  )
}

  handleDailogOpen = (index) => {
    this.setState({results: this.state.items[index]}, () => {
    });
    this.setState({dailogOpen: true});
  }

  handleDailogClose = (index) => {
    this.setState({dailogOpen: false});
  }

  handleOpen = (index, state) => {
    this.state.open[index] = true;
    this.setState({results: this.state.items[index]}, () => {
      if(state === 'editing'){
        this.setState({query: 'User Editing'}, () => {
          this.setState({viewMode: true});
        });
      } else {
        this.setState({query: 'User Detail'}, () => {
          this.setState({viewMode: false});
        });
      }
    })
    
    this.setState({open: this.state.open});
  };


  filterList = (event) => {
    var updatedList = this.state.initialItems;

    updatedList = updatedList.filter(function(item){
      return item.email.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({items: updatedList});
  }

  createAge = function(value) { 
    var today = new Date();
    var givenBirthDate = new Date(value);
    var date = givenBirthDate.getDate();
    var month = givenBirthDate.getMonth() + 1;
    var year = givenBirthDate.getFullYear();

    var dateOfBirth = date + '/' + month + '/' + year;  

    var birthDate = Date.parse(dateOfBirth);

    var d = Date.parse(month + '/' + date + '/' + year );
    var t = new Date(d);
    var age = today.getFullYear() - t.getFullYear();
    var m = today.getMonth() - t.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  createDob = function(value){
    var givenBirthDate = new Date(value);
    var date = givenBirthDate.getDate();
    var month = givenBirthDate.getMonth() + 1;
    var year = givenBirthDate.getFullYear();
    var dateOfBirth = month + '/' + date + '/' +  year;
    return dateOfBirth;
  }

  handleActiveness = function(index, state){
      this.state.items[index].active = !state;
      this.setState({items: this.state.items});
  }

  changeDate = function(evt, index){
    console.log(evt)
    this.state.items[index].dob = evt;
    this.setState({items: this.state.items});
    var d = new Date(evt);
    this.state.results.dob = d;
    console.log(this.state.results);
  }

  updateInputValue = function(evt, index) {    
  const characterRegex = new RegExp('^[A-Za-z]+$');
  const numberRegex = new RegExp('^[0-9]+$')
  const emailRegex = new RegExp('/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$;/');

    switch(evt.target.name){
      case 'first_name':
        this.state.items[index].first_name = evt.target.value;
        if(!characterRegex.test(evt.target.value)){
          this.setState({first_name: true});
        }
        else {
          this.setState({first_name: false});
        }
        break;
      case 'last_name':
        this.state.items[index].last_name = evt.target.value;
        if(!characterRegex.test(evt.target.value)){
          this.setState({last_name: true});
        }
        else {
          this.setState({last_name: false});
        }
        break;
      case 'email':
        this.state.items[index].email = evt.target.value;
        console.log(emailRegex.test(evt.target.value));
        if(!emailRegex.test(evt.target.value)){
          this.setState({email: false});
        }
        break;
      case 'phone':
        this.state.items[index].phone = evt.target.value;
        if(!numberRegex.test(evt.target.value)){
          this.setState({phone: true});
        }
        else {
          this.setState({phone: false});
        }
        break;
      default:
        break;
    }
    this.state.temperoryObject = [];
  }

  saveDetails = function(){
    this.setState({saveState: true});
    localStorage.setItem('data', JSON.stringify(this.state.items));
  }

  handleClose = (index) => {
    this.state.open[index] = false;
    this.setState({open: this.state.open});
    this.setState({saveState: false});
    this.setState({items: JSON.parse(localStorage.getItem('data'))});
  };

  render() {
  const { classes } = this.props;

  return (
    <div>
    <AppBar className={classes.appBar}>
      <Toolbar>
          Grey Atom
        </Toolbar>
      </AppBar>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <div className="form-group">
            <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filterList}/>
          </div>
      </Grid>
      </Grid>

    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell numeric>Age</TableCell>
            <TableCell numeric>DOB</TableCell>
            <TableCell numeric>Email</TableCell>
            <TableCell numeric>Mobile</TableCell>
            <TableCell numeric>Active</TableCell>
            <TableCell numeric>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.items.map((n, index) => {
            return (
              <TableRow hover key={index}>
                <TableCell component="th" scope="row">
                  {n.first_name + ' ' + n.last_name}
                </TableCell>
                <TableCell numeric>{this.createAge(n.dob)}</TableCell>
                <TableCell numeric>{this.createDob(n.dob)}</TableCell>
                <TableCell numeric>{n.email}</TableCell>
                <TableCell numeric>{n.phone}</TableCell>
                <TableCell numeric>{n.active.toString()}</TableCell>
                <TableCell numeric>
                      <Button variant="fab" color="secondary" aria-label="Edit" className={classes.button} onClick={() => this.handleOpen(index, 'editing')}>
                          <EditIcon style={{ fontSize: 30 }} className={classNames(classes.leftIcon, classes.iconSmall)} />
                      </Button>
                      <Router>
                        <span>
                        <Button variant="fab" color="secondary" aria-label="Pageview" className={classes.button} onClick={() => this.handleDailogOpen(index)}>
                          <PageviewIcon style={{ fontSize: 30 }} className={classNames(classes.leftIcon, classes.iconSmall)} />
                        </Button>
                        <Route component={Schedule} path='/schedule' />
                        </span>
                      </Router>
                      { n.active ?
                          <Button variant="fab" color="secondary" aria-label="Active" className={classes.button} onClick={() => this.handleActiveness(index, n.active)}>
                              <Active style={{ fontSize: 30 }} className={classNames(classes.leftIcon, classes.iconSmall)} /> 
                          </Button> :
                          <Button variant="fab" color="secondary" aria-label="Inactive" className={classes.button} onClick={() => this.handleActiveness(index, n.active)}>
                            <Inactive style={{ fontSize: 30 }} className={classNames(classes.leftIcon, classes.iconSmall)} />
                        </Button>
                      }
                      
                </TableCell>
                        <Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={this.state.open[index] ? true : false}
                            onClose={() => this.handleClose(index)}
                            disableBackdropClick={this.state.open[index]}
                          >
                          <div style={getModalStyle()} className={classes.paper}>
                          <Grid container spacing={24}>
                              <Grid item xs={12}>
                            <Typography variant="title" id="modal-title">
                              {this.state.query}
                            </Typography>
                            <Typography variant="title" id="modal-state">
                            { this.state.saveState ? 
                            <FormHelperText className="success">Saved</FormHelperText> : 
                            ''
                            }
                            </Typography>
                            </Grid>
                            </Grid>
                            <Grid container spacing={24}>
                              <Grid item xs={12}>
                              <FormControl id="form_container" fullWidth className={classes.margin}>
                                    <Input error={this.state.first_name} 
                                      placeholder="First Name"
                                      className={classes.input}
                                      inputProps={{
                                        'aria-label': 'first_name',
                                      }}
                                      name='first_name'
                                      onChange={(event) => this.updateInputValue(event, index)}
                                      value={this.state.results.first_name}
                                    /><br/>
                                  
                                  <Input error={this.state.last_name}
                                      placeholder="Last Name"
                                      className={classes.input}
                                      inputProps={{
                                        'aria-label': 'last_name',
                                      }}
                                      name='last_name'
                                       onChange={(event) => this.updateInputValue(event, index)}
                                      value={this.state.results.last_name}
                                    /><br/>
                                    
                                  <Input error={this.state.email}
                                      placeholder="Email"
                                      className={classes.input}
                                      inputProps={{
                                        'aria-label': 'email',
                                      }}
                                      name='email'
                                       onChange={(event) => this.updateInputValue(event, index)}
                                      value={this.state.results.email}
                                    /><br/>
                                  
                                  <Input error={this.state.phone}
                                      placeholder="Mobile"
                                      className={classes.input}
                                      inputProps={{
                                        'aria-label': 'phone',
                                      }}
                                      name='phone'
                                       onChange={(event) => this.updateInputValue(event, index)}
                                      value={this.state.results.phone}
                                    /><br/> 
                                  <Grid container spacing={24}>
                                    <Grid item xs={6}>
                                    <FormLabel id="date_label" component="legend">Date of Birth</FormLabel>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <DatePicker
                                      onChange={(event) => this.changeDate(event, index)}
                                      value={new Date(this.state.results.dob)}/>
                                    </Grid>
                                </Grid>
                               </FormControl>
                                { this.state.viewMode ?       
                                <Grid id="footer" container spacing={24}>
                                  <Grid item xs={6}>
                                      <CloseIcon id="close-button" onClick={() => this.handleClose(index)} style={{ fontSize: 30 }} className={classNames(classes.leftIcon, classes.iconSmall, classes.leftAlign)} />
                                  </Grid>
                                  <Grid item xs={6}>
                                      <SaveIcon id="save-button" onClick={() => this.saveDetails()} style={{ fontSize: 30 }} className={classNames(classes.leftIcon, classes.iconSmall, classes.rightAlign)} />
                                  </Grid>
                                </Grid> : '' }
                              </Grid>
                            </Grid>
                            
                            
                          </div>
                </Modal>

                <Dialog
                    fullScreen
                    open={this.state.dailogOpen}
                    onClose={this.handleDailogClose}
                    TransitionComponent={Transition}
                  >
                    <AppBar className={classes.appBar}>
                      <Toolbar>
                        <IconButton color="inherit" onClick={this.handleDailogClose} aria-label="Close">
                          <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                          Sound
                        </Typography>
                      </Toolbar>
                    </AppBar>
                    <Grid container className={classes.root} spacing={16}>
                        <Grid item xs>
                        </Grid>
                        <Grid item xs={8}>
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
                        <Grid item xs>
                        </Grid>
                      </Grid>
                  </Dialog>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
    </div>
  );
}
}

InteractiveList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InteractiveList);
