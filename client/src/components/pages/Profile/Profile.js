// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

// component
import Navbar from '../../layout/Navbar/Navbar';
import Footer from '../../layout/Footer/Footer';
import Heading from './components/Heading/Heading';
import About from './components/About/About';
import BooksRead from './components/BooksRead/BooksRead';
import Reviews from './components/Reviews/Reviews';

class Profile extends Component {
  state = {
    profile: {
      _id: '',
      user: {
        _id: '',
        name: ''
      },
      handle: '',
      favoriteBook: '',
      favoriteBookObj: {
        _id: '',
        title: '',
        subtitle: '',
        authors: '',
        publishedDate: '',
        image: {},
        description: ''
      },
      location: '',
      bio: '',
      booksRead: [],
      social: {
        goodreads: '',
        facebook: '',
        instagram: ''
      },
      date: '',
      isLoading: true
    },
    errors: {}
  };

  componentDidMount = () => {
    this.updateFromProfile();
  };

  updateFromProfile = () => {
    axios
      .get('/api/profile')
      .then(res => {
        const profile = res.data;
        const currentState = this.state;
        currentState.profile = profile;
        currentState.profile.isLoading = false;
        this.setState(currentState);
      })
      .catch(err => {
        this.setState({ errors: err });
      });
  };

  render() {
    document.title = `${this.state.profile.user.name || 'Profile'} | WeirdLit`;

    let profileContent = (
      <div className={['ui segment', this.state.profile.isLoading ? 'loading' : ''].join(' ')}>
        {this.state.profile.isLoading && (
          <Fragment>
            <br />
            <br />
            <br />
            <br />
          </Fragment>
        )}
        {!this.state.profile.isLoading && (
          <Fragment>
            <Heading
              name={this.state.profile.user.name}
              date={this.state.profile.date}
              isCurrentUser={true}
            />
            <About
              favoriteBook={this.state.profile.favoriteBook}
              favoriteBookObj={this.state.profile.favoriteBookObj}
              location={this.state.profile.location}
              bio={this.state.profile.bio}
              social={this.state.profile.social}
              history={this.props.history}
            />
            <Reviews
              userId={this.state.profile.user._id}
              name={this.state.profile.user.name}
              history={this.props.history}
            />
          </Fragment>
        )}
      </div>
    );

    return (
      <Fragment>
        <Navbar />
        <div
          className={['ui container', this.state.profile.favoriteBookObj._id ? '' : 'text'].join(
            ' '
          )}
        >
          {profileContent}
          {console.log(this.state.profile.booksRead)}
        </div>
        <Footer />
      </Fragment>
    );
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Profile);
