import React from 'react';
import './App.css';

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
import EditIcon from '@material-ui/icons/Edit';
import PageviewIcon from '@material-ui/icons/Visibility';
import Inactive from '@material-ui/icons/NotInterested';
import Active from '@material-ui/icons/VerifiedUser';



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  button: {
    margin: theme.spacing.unit,
  },
  rightAlign: {
    margin: theme.spacing.unit,
    float: 'right', 
  },
  table: {
    minWidth: 500,
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  input: {
    margin: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});

class InteractiveList extends React.Component {
  state = {
      dense: false,
      secondary: false,
      query: '',
      results: [],
      initialItems: [],
      items: [],
      open: [false, false, false],
      viewMode: false,
    };

  componentWillMount = function(){
    this.serverRequest = fetch("https://api.myjson.com/bins/pkisp")
    .then(res => res.json())
    .then(
      (result) => {
      console.log(result);
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

  handleOpen = (index, state) => {
    this.state.open[index] = true;
    this.setState({results: this.state.items[index]}, () => {
      if(state == 'editing'){
        console.log(state);
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

  handleClose = (index) => {
    this.state.open[index] = false;
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
    var birthDate = new Date(dateOfBirth);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
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
    var dateOfBirth = date + '/' + month + '/' + year;
    return dateOfBirth;
  }

  handleActiveness = function(index, state){
      this.state.items[index].active = !state;
      this.setState({items: this.state.items});
  }

  render() {
  const { classes } = this.props;
  const { dense, secondary } = this.state;

  return (
    <div className={classes.root}>
    <AppBar position="fixed">
      <Toolbar variant="dense">
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
                      <Button variant="fab" color="secondary" aria-label="Pageview" className={classes.button} onClick={() => this.handleOpen(index, 'view')}>
                          <PageviewIcon style={{ fontSize: 30 }} className={classNames(classes.leftIcon, classes.iconSmall)} />
                      </Button>
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
                          >
                          <div style={getModalStyle()} className={classes.paper}>
                          <Grid container spacing={24}>
                              <Grid item xs={12}>
                            <Typography variant="title" id="modal-title">
                              {this.state.query}
                            </Typography>
                            </Grid>
                            </Grid>
                            <Grid container spacing={24}>
                              <Grid item xs={12}>
                              <FormControl fullWidth className={classes.margin}>
                                    <Input 
                                      placeholder="First Name"
                                      className={classes.input}
                                      inputProps={{
                                        'aria-label': 'Description',
                                      }}
                                      value={this.state.results.first_name}
                                    /><br/>
                                  
                                  <Input
                                      placeholder="Last Name"
                                      className={classes.input}
                                      inputProps={{
                                        'aria-label': 'Description',
                                      }}
                                      value={this.state.results.last_name}
                                    /><br/>
                                    
                                  <Input
                                      placeholder="Email"
                                      className={classes.input}
                                      inputProps={{
                                        'aria-label': 'Description',
                                      }}
                                      value={this.state.results.email}
                                    /><br/>
                                  
                                  <Input
                                      placeholder="Mobile"
                                      className={classes.input}
                                      inputProps={{
                                        'aria-label': 'Description',
                                      }}
                                      value={this.state.results.phone}
                                    /><br/>                                    
                                  <Input
                                      placeholder="Date of Birth"
                                      className={classes.input}
                                      inputProps={{
                                        'aria-label': 'Description',
                                      }}
                                      value={this.createDob(this.state.results.dob)}
                                    />
                               </FormControl>
                                { this.state.viewMode ?       
                                <Grid container spacing={24}>
                                  <Grid item xs={6}>
                                      <Button variant="contained" size="large" className={classes.button} onClick={() => this.handleClose(index)}>
                                          Cancel
                                      </Button>
                                  </Grid>
                                  <Grid item xs={6}>
                                      <Button variant="contained" size="large" className={classes.rightAlign}>
                                        <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                                          Save
                                      </Button>
                                  </Grid>
                                </Grid> : '' }
                              </Grid>
                            </Grid>
                            
                            
                          </div>
                </Modal>
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
