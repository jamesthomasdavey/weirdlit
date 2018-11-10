// packages
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import jwt_decode from 'jwt-decode';

// components
// parts
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';

// components
// pages
import Root from './components/pages/Root/Root';
import Landing from './components/pages/Landing/Landing';
import Register from './components/pages/Register/Register';
import Login from './components/pages/Login/Login';
import Browse from './components/pages/Browse/Browse';
import Profile from './components/pages/Profile/Profile';
import EditProfile from './components/pages/EditProfile/EditProfile';
import Pending from './components/pages/Pending/Pending';
import Book from './components/pages/Book/Book';
import AddBook from './components/pages/AddBook/AddBook';
import Account from './components/pages/Account/Account';
import Notifications from './components/pages/Notifications/Notifications';
import DeleteAccount from './components/pages/DeleteAccount/DeleteAccount';
import Unauthorized from './components/pages/Unauthorized/Unauthorized';

// protected routes
import PrivateRoute from './components/layout/PrivateRoute/PrivateRoute';
import AdminRoute from './components/layout/AdminRoute/AdminRoute';

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
            <Navbar />
            <Route exact path="/" component={Root} />
            <Route exact path="/landing" component={Landing} />
            <Route exact path="/browse" component={Browse} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/authorized" component={Unauthorized} />
            <Route exact path="/profile/:handle" component={Profile} />
            <Route exact path="/profile/user/:userId" component={Profile} />
            <Route exact path="/books/:bookId" component={Book} />
            <Switch>
              <PrivateRoute exact path="/profile" component={Profile} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/edit-profile" component={EditProfile} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/account" component={Account} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/notifications" component={Notifications} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/account/delete" component={DeleteAccount} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/books/add" component={AddBook} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/pending-books" component={Pending} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
