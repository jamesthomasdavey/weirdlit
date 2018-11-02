// package
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

// component
import Spinner from './../../layout/Spinner/Spinner';
import Navbar from './../../layout/Navbar/Navbar';

class Profile extends Component {
  state = {
    name: '',
    // favoriteBook: '',
    location: '',
    bio: '',
    goodreads: '',
    facebook: '',
    instagram: '',
    date: '',
    isLoading: true,
    errors: {}
  };

  componentDidMount = () => {
    axios
      .get('/api/profile')
      .then(res => {
        const profile = res.data;
        const currentState = this.state;
        currentState.name = profile.user.name;
        // currentState.favoriteBook = profile.favoriteBook;
        currentState.location = profile.location;
        currentState.bio = profile.bio;
        currentState.goodreads = profile.social.goodreads;
        currentState.facebook = profile.social.facebook;
        currentState.instagram = profile.social.instagram;
        currentState.date = profile.date;
        currentState.isLoading = false;
        this.setState(currentState);
      })
      .catch(err => {
        this.setState({ errors: err });
      });
  };

  render() {
    document.title = `${this.state.name || 'Profile'} | WeirdLit`;

    let favoriteBook;

    if (this.state.favoriteBook) {
      if (typeof this.state.favoriteBook === 'string') {
        favoriteBook = <span>{this.state.favoriteBook}</span>;
      } else {
        favoriteBook = (
          <div className="ui card">
            <h3>{this.state.favoriteBook.title}</h3>
            <span>{this.state.favoriteBook.subtitle}</span>
            <span>
              {this.state.favoriteBook.authors.reduce((acc, current) => {
                return `${acc}, ${current}`;
              })}
            </span>
          </div>
        );
      }
    }

    let profileContent;
    if (this.state.isLoading) {
      profileContent = <Spinner />;
    } else {
      const date = new Date(this.state.date);
      const userSince = (
        <span>
          User since {date.toLocaleString('en-us', { month: 'long' })} {date.getFullYear()}
        </span>
      );
      profileContent = (
        <Fragment>
          <div style={{ paddingBottom: '20px' }}>
            <h2>{this.state.name}</h2>
            {userSince}
          </div>
          {this.state.favoriteBook && favoriteBook}
          <div />
          <Link to="/profile/edit" className="ui button">
            Edit Profile
          </Link>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <Navbar />
        <div className="ui container">
          <div className="ui text container">{profileContent}</div>
        </div>
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
