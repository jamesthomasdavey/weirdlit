import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from './../../../actions/profileActions';
import Spinner from './../../layout/Spinner/Spinner';

import Navbar from './../../layout/Navbar/Navbar';

class Profile extends Component {
  componentDidMount = () => {
    this.props.getCurrentProfile();
  };
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    document.title = user.name ? user.name + ' | WeirdLit' : 'Profile | WeirdLit';
    let profileContent;
    if (profile === null || loading) {
      profileContent = <Spinner />;
    } else {
      const date = (
        <span>
          {profile &&
            new Date(this.props.profile.profile.date).toLocaleString('en-us', { month: 'long' }) +
              ' ' +
              new Date(this.props.profile.profile.date).getFullYear()}
        </span>
      );
      profileContent = (
        <Fragment>
          <div style={{ paddingBottom: '24px' }}>
            <h2>{profile && profile.user.name}</h2>
            {profile.social.instagram && (
              <Fragment>
                <div>
                  <a href={profile.social.instagram} className="ui">
                    <i className="instagram icon large" />
                  </a>
                </div>
              </Fragment>
            )}
            <small>User since {date}</small>
          </div>
          {profile.favoriteBook && (
            <Fragment>
              <h5>Favorite Book</h5>
              <p>{profile.favoriteBook}</p>
            </Fragment>
          )}
          {profile.location && (
            <Fragment>
              <h5>Location</h5>
              <p>{profile.location}</p>
            </Fragment>
          )}
          {profile.bio && (
            <Fragment>
              <h5>Bio</h5>
              <p>{profile.bio}</p>
            </Fragment>
          )}
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
  auth: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Profile);
