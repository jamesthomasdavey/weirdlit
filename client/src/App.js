// packages
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { ConnectedRouter as Router, Route, Switch } from 'react-router-redux';

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
import NotFound from './components/pages/NotFound/NotFound';
import Root from './components/pages/Root/Root';
import Landing from './components/pages/Landing/Landing';
import Register from './components/pages/Register/Register';
import Login from './components/pages/Login/Login';
import Browse from './components/pages/Browse/Browse';
import Profile from './components/pages/Profile/Profile';
import EditProfile from './components/pages/EditProfile/EditProfile';
import ProfileBooks from './components/pages/ProfileBooks/ProfileBooks';
import ProfileReviews from './components/pages/ProfileReviews/ProfileReviews';
import Pending from './components/pages/Pending/Pending';
import Book from './components/pages/Book/Book';
import Books from './components/pages/Books/Books';
import AddBook from './components/pages/AddBook/AddBook';
import EditBook from './components/pages/EditBook/EditBook';
import DeleteBook from './components/pages/DeleteBook/DeleteBook';
import AddCustomBook from './components/pages/AddCustomBook/AddCustomBook';
import RandomBook from './components/pages/RandomBook/RandomBook';
import Author from './components/pages/Author/Author';
import AuthorBooks from './components/pages/AuthorBooks/AuthorBooks';
import EditAuthor from './components/pages/EditAuthor/EditAuthor';
// import BookReviews from './components/pages/BookReviews/BookReviews';
import Review from './components/pages/Review/Review';
import NewReview from './components/pages/NewReview/NewReview';
import EditReview from './components/pages/EditReview/EditReview';
import DeleteReview from './components/pages/DeleteReview/DeleteReview';
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
            <Route exact path="/unauthorized" component={Unauthorized} />
            <Route exact path="/404" component={NotFound} />
            <Switch>
              <AdminRoute exact path="/books/pending" component={Pending} />
              <PrivateRoute exact path="/books/add" component={AddBook} />
              <Route exact path="/books/random" component={RandomBook} />
              <PrivateRoute exact path="/books/add/custom" component={AddCustomBook} />
              <Route exact path="/books" component={Books} />
              <Route exact path="/books/filter/:tags" component={Books} />
              <Route
                exact
                path="/books/filter/:tags/sort/:sortMethod/:sortOrder"
                component={Books}
              />
              <Route exact path="/books/:bookId" component={Book} />
              <AdminRoute exact path="/books/:bookId/edit" component={EditBook} />
              <AdminRoute exact path="/books/:bookId/delete" component={DeleteBook} />
              {/* <Route exact path="/books/:bookId/reviews" component={BookReviews} /> */}
              <PrivateRoute exact path="/books/:bookId/reviews/new" component={NewReview} />
              <Route exact path="/books/:bookId/reviews/:reviewId" component={Review} />
              <PrivateRoute
                exact
                path="/books/:bookId/reviews/:reviewId/edit"
                component={EditReview}
              />
              <PrivateRoute
                exact
                path="/books/:bookId/reviews/:reviewId/delete"
                component={DeleteReview}
              />
            </Switch>
            <Switch>
              <Route exact path="/authors/:authorId" component={Author} />
              <Route exact path="/authors/:authorId/books" component={AuthorBooks} />
              <AdminRoute exact path="/authors/:authorId/edit" component={EditAuthor} />
              <Route
                exact
                path="/authors/:authorId/books/filter/:tags/sort/:sortMethod/:sortOrder"
                component={AuthorBooks}
              />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/profile" component={Profile} />
              <PrivateRoute exact path="/profile/edit" component={EditProfile} />
              <Route exact path="/profile/user/:userId" component={Profile} />
              <Route exact path="/profile/user/:userId/reviews" component={ProfileReviews} />
              <Route
                exact
                path="/profile/user/:userId/reviews/sort/:sortMethod/:sortOrder"
                component={ProfileReviews}
              />
              <Route exact path="/profile/user/:userId/books" component={ProfileBooks} />
              <Route
                exact
                path="/profile/user/:userId/books/filter/:tags/sort/:sortMethod/:sortOrder"
                component={ProfileBooks}
              />
              <Route exact path="/profile/:handle" component={Profile} />
              {/* <Route exact path="/profile/:handle/books" component={ProfileBooks} /> */}
            </Switch>
            <Switch>
              <PrivateRoute exact path="/account" component={Account} />
              <PrivateRoute exact path="/account/delete" component={DeleteAccount} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/notifications" component={Notifications} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
