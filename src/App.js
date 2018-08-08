import React from 'react';
// import './App.css';  
import { BrowserRouter as Router, Route  } from 'react-router-dom';
import Home from './Home';
import Schedule from './Schedule';

const App = () =>
<Router>
<div>
  <Route exact path="/" component={Home}/>
  <Route path="/schedule" component={Schedule}/>
</div>
</Router>

export default App