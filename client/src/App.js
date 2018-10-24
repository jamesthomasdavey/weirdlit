import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

// import Navbar from './components/layout/Navbar/Navbar';
// import Footer from './components/layout/Footer/Footer';

import Register from './components/pages/auth/Register/Register';
import Login from './components/pages/auth/Login/Login';

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
