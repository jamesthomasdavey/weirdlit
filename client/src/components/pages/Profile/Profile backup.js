// package
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

// validation
import isEmpty from '../../../validation/is-empty';

// component
import Spinner from '../../layout/Spinner/Spinner';
import Navbar from '../../layout/Navbar/Navbar';

class Profile extends Component {
  state = {
    profile: {
      name: '',
      handle: '',
      favoriteBook: '',
      favoriteBookObj: {
        _id: '',
        title: '',
        subtitle: '',
        authors: [],
        image: ''
      },
      location: '',
      bio: '',
      social: {
        goodreads: '',
        facebook: '',
        instagram: ''
      },
      date: ''
    },
    isLoading: true,
    errors: {}
  };

  componentDidMount = () => {
    axios
      .get('/api/profile')
      .then(res => {
        const profile = res.data;
        const currentState = this.state;
        currentState.profile = profile;
        currentState.isLoading = false;
        this.setState(currentState);
      })
      .catch(err => {
        this.setState({ errors: err });
      });
  };

  render() {
    document.title = `${this.state.profile.name || 'Profile'} | WeirdLit`;

    let profileContent;
    let handleUrl;
    let favoriteBook;
    let about;
    let bio;
    let goodreads;
    let facebook;
    let instagram;

    if (this.state.isLoading) {
      profileContent = <Spinner />;
    } else {
      const date = new Date(this.state.profile.date);
      const userSince = (
        <span>
          User since {date.toLocaleString('en-us', { month: 'long' })} {date.getFullYear()}
        </span>
      );

      // if (this.state.profile.handle) {
      //   handleUrl = (
      //     <div>
      //       <small>
      //         weirdl.it/profile/
      //         {this.state.profile.handle}
      //       </small>
      //     </div>
      //   );
      // }

      if (this.state.profile.favoriteBookObj._id) {
        favoriteBook = (
          <div>
            <h4 className="ui horizontal divider header">
              <i className="book icon" />
              Favorite Book
            </h4>
            <div className="ui card">
              <div className="content">
                <div className="ui small image">
                  <img
                    src={this.state.profile.favoriteBookObj.image}
                    alt={this.state.profile.favoriteBookObj.title}
                  />
                </div>
              </div>
            </div>
            <br />
          </div>
        );
      } else if (this.state.profile.favoriteBook) {
        favoriteBook = (
          <div>
            <h5 className="ui horizontal divider header">
              <i className="bar chart icon" />
              Favorite Book
            </h5>
            <div>{this.state.profile.favoriteBook}</div>
            <br />
          </div>
        );
      }

      if (this.state.profile.location || this.state.profile.goodreads || this.state.profile.facebook || this.state.profile.instagram) {
        about = (
          <div>
            <h5 className="ui horizontal divider header">
              <i className="location arrow icon" />
              About
            </h5>
            <div>{this.state.profile.location}</div>
            <br />
          </div>
        );
      }

      if (this.state.profile.bio) {
        bio = (
          <div>
            <h5 className="ui horizontal divider header">
              <i className="user icon" />
              Bio
            </h5>
            <div>{this.state.profile.bio}</div>
            <br />
          </div>
        );
      }

      if (this.state.profile.goodreads) {
      }

      profileContent = (
        <Fragment>
          <div className="ui segment">
            <h2>{this.state.profile.name}</h2>
            {handleUrl}
            {userSince}
          </div>
          <div className="ui segment">
            {favoriteBook}
            {about}
            {bio}
          </div>
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
