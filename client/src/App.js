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

// css
import './App.css';

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000;
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
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
