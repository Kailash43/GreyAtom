import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();


// import React from 'react';
// // import './App.css';  


// import React from 'react';
// // import './App.css';  
// import { BrowserRouter as Router, Route, Link  } from 'react-router-dom';
// import Home from './Home';
// import Schedule from './Schedule';

// const App = () =>
// <Router>
// <div>
//   <ul>
//     <li><Link to="/">Home</Link></li>
//     <li><Link to="/schedule">Books</Link></li>
//   </ul>

//   <Route exact path="/" component={Home}/>
//   <Route path="/schedule" component={Schedule}/>
// </div>
// </Router>