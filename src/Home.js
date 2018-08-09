import React from 'react';
import './App.css';
import Media from "react-media";
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
import EditIcon from '@material-ui/icons/Edit';
import PageviewIcon from '@material-ui/icons/Visibility';
import Inactive from '@material-ui/icons/NotInterested';
import Active from '@material-ui/icons/VerifiedUser';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';


function getModalStyle() {
  const top = 50;
  const left = 50;
  var width = 400;

  if(window.innerWidth < 599){
   width = 280;
  }

  return {
    width: `${width}px`,
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
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
  clickCursor:{
      cursor: 'pointer',
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
    if(localStorage.getItem('data') == null) {
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
    } else {
        this.setState({items: JSON.parse(localStorage.getItem('data'))});
        this.setState({initialItems:  JSON.parse(localStorage.getItem('data'))});
    }
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

    var dateOfBirth = month + '/' + date + '/' + year;  

    var parseDate = Date.parse(dateOfBirth);
    var birthDate = new Date(parseDate);
   // console.log(birthDate, dateOfBirth);
    var d = Date.parse(month + '/' + date + '/' + year );
    var t = new Date(d);
    var age = today.getFullYear() - t.getFullYear();
    var m = today.getMonth() - t.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if(age < 0){
        age = 0;
    }else{
        age = age;
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

  changeDate = function(evt, index){
    //console.log(evt)
    this.state.items[index].dob = evt;
    this.setState({items: this.state.items});
    var d = new Date(evt);
    this.state.results.dob = d;
    //console.log(this.state.results);
  }

  updateInputValue = function(evt, index) {    
  const characterRegex = new RegExp('^[A-Za-z]+$');
  const numberRegex = new RegExp('^[0-9]+$')
  const emailRegex = new RegExp('/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$;/');
  //console.log(evt.target.value);
    if(evt.target.value != ''){
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

  routePage = function(index){
    localStorage.setItem('results', JSON.stringify(this.state.items[index]));
    this.props.history.push('/schedule')
  }

  render() {
  const { classes } = this.props;

  return (
    <div>
    <AppBar className={classes.appBar}>
      <Toolbar>
      <Typography variant="title" color="inherit" className={classes.flex}>
          Grey Atom
        </Typography>
        </Toolbar>
      </AppBar>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <div className="form-group">
          <Media query="(max-width: 640px)">
          {matches =>
            matches ? (
            <input type="text" className="form-control search-bar form-control-lg" placeholder="Search" onChange={this.filterList}/>
            ) : (
                <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filterList}/>
              )
            }
            </Media>            
            </div>
      </Grid>
      </Grid>

    <Paper className={classes.root}>
      <Table className={classes.table}>
      <Media query="(max-width: 599px)">
          {matches => matches ? (
        <TableHead id="table_head">
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell numeric>Age (Years)</TableCell>
            <TableCell numeric>DOB</TableCell>
            <TableCell numeric>Email</TableCell>
            <TableCell numeric>Mobile</TableCell>
            <TableCell numeric>Active</TableCell>
            <TableCell numeric>Actions</TableCell>
          </TableRow>
        </TableHead>) : (
        <TableHead>
            <TableRow>
            <TableCell>Name</TableCell>
            <TableCell numeric>Age (Years)</TableCell>
            <TableCell numeric>DOB</TableCell>
            <TableCell numeric>Email</TableCell>
            <TableCell numeric>Mobile</TableCell>
            <TableCell numeric>Active</TableCell>
            <TableCell numeric>Actions</TableCell>
          </TableRow>
        </TableHead>)}
      </Media>
        <TableBody>
          {this.state.items.map((n, index) => {
            return (
              <TableRow hover key={index} className={classes.clickCursor}>

                <TableCell component="th" scope="row" onClick={() => this.routePage(index)}>
                {n.first_name + ' ' + n.last_name}                              
                </TableCell>

                <TableCell numeric onClick={() => this.routePage(index)}>{this.createAge(n.dob)}</TableCell>
                <TableCell numeric onClick={() => this.routePage(index)}>{this.createDob(n.dob)}</TableCell>
                <TableCell numeric onClick={() => this.routePage(index)}>{n.email}</TableCell>
                <TableCell numeric onClick={() => this.routePage(index)}>{n.phone}</TableCell>
                <TableCell numeric onClick={() => this.routePage(index)}>{n.active.toString()}</TableCell>
                <TableCell id="table-button" numeric>
                      <Button variant="fab" color="secondary" aria-label="Edit" className={classes.button} onClick={() => this.handleOpen(index, 'editing')}>
                          <EditIcon style={{ fontSize: 30 }} className={classNames(classes.leftIcon, classes.iconSmall)} />
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
                                    <Input type="text" error={this.state.first_name}
                                      placeholder="First Name"
                                      className={classes.input}
                                      inputProps={{
                                        'aria-label': 'first_name',
                                      }}
                                      name='first_name'
                                      onChange={(event) => this.updateInputValue(event, index)}
                                      value={this.state.results.first_name}
                                    /><br/>
                                  
                                  <Input type="text" error={this.state.last_name}
                                      placeholder="Last Name"
                                      className={classes.input}
                                      inputProps={{
                                        'aria-label': 'last_name',
                                      }}
                                      name='last_name'
                                       onChange={(event) => this.updateInputValue(event, index)}
                                      value={this.state.results.last_name}
                                    /><br/>
                                    
                                  <Input type="email" error={this.state.email}
                                      placeholder="Email"
                                      className={classes.input}
                                      inputProps={{
                                        'aria-label': 'email',
                                      }}
                                      name='email'
                                       onChange={(event) => this.updateInputValue(event, index)}
                                      value={this.state.results.email}
                                    /><br/>
                                  
                                  <Input type="number" error={this.state.phone}
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
                                    <Grid item xs={12}>
                                    <FormLabel id="date_label" component="legend">Date of Birth</FormLabel>
                                    </Grid>
                                    <Grid id="date_picker" item xs={12}>
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
