// packages
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import jwt_decode from 'jwt-decode';

// components
import Landing from './components/pages/Landing/Landing';
import Register from './components/pages/Register/Register';
import Login from './components/pages/Login/Login';
import Browse from './components/pages/Browse/Browse';
import Dashboard from './components/pages/Dashboard/Dashboard';
import Profile from './components/pages/Profile/Profile';

// css
import './App.css';

// check if there is a token in localstorage
if (localStorage.jwtToken) {
  // add token to the header
  setAuthToken(localStorage.jwtToken);
  // decode the header to get the user payload
  const decoded = jwt_decode(localStorage.jwtToken);
  // set current user in redux
  store.dispatch(setCurrentUser(decoded));
  // get current time in seconds
  const currentTime = Date.now() / 1000;
  // compare expiration time
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={Landing} />
            <Route exact path="/browse" component={Browse} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/profile" component={Profile} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
