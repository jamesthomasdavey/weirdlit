// package
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

// validation
import isEmpty from '../../../validation/is-empty';

// component
import Navbar from '../../layout/Navbar/Navbar';

// image
import goodreadsIcon from './../../../img/icons/goodreads.svg';
import facebookIcon from './../../../img/icons/facebook.svg';
import instagramIcon from './../../../img/icons/instagram.svg';

// css
import classes from './Profile.module.css';

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
        authors: '',
        publishedDate: '',
        image: '',
        description: ''
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
    this.updateFromProfile();
  };

  updateFromProfile = () => {
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

    let heading;
    let about;

    if (!this.state.isLoading) {
      const nameHeading = <h2>{this.state.profile.name}</h2>;
      const date = new Date(this.state.profile.date);
      const userSince = (
        <span>
          User since {date.toLocaleString('en-us', { month: 'long' })} {date.getFullYear()}
        </span>
      );

      heading = (
        <Fragment>
          {nameHeading}
          {userSince}
          <Link to="/profile/edit" className="ui right floated button tiny">
            Edit Profile
          </Link>
        </Fragment>
      );

      let favoriteBookObj;
      let favoriteBook;
      let location;
      let bio;
      let social;

      if (this.state.profile.favoriteBookObj._id) {
        favoriteBookObj = (
          <div className="column">
            <h5>Favorite Book</h5>
            <div className="ui items">
              <div className="ui item">
                <div className="ui small image">
                  <img
                    src={this.state.profile.favoriteBookObj.image}
                    alt={this.state.profile.favoriteBookObj.title}
                  />
                </div>
                <div className="content">
                  <div className="header">{this.state.profile.favoriteBookObj.title}</div>
                  <div className="meta">{this.state.profile.favoriteBookObj.publishedDate}</div>
                  {this.state.profile.favoriteBookObj.authors.length > 0 && (
                    <div className="meta">
                      {this.state.profile.favoriteBookObj.authors.length > 1
                        ? this.state.profile.favoriteBookObj.authors.reduce(
                            (acc, current) => acc + ', ' + current
                          )
                        : this.state.profile.favoriteBookObj.authors[0]}
                    </div>
                  )}
                  {this.state.profile.favoriteBookObj.description && (
                    <div className="description">
                      {this.state.profile.favoriteBookObj.description}
                    </div>
                  )}
                  <Link
                    to={`/books/${this.state.profile.favoriteBookObj._id}`}
                    className="button ui"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (!favoriteBookObj && this.state.profile.favoriteBook) {
        favoriteBook = (
          <Fragment>
            <h5>Favorite Book</h5>
            <span>{this.state.profile.favoriteBook}</span>
          </Fragment>
        );
      }

      if (this.state.profile.location) {
        location = (
          <Fragment>
            <h5>Location</h5>
            <span>{this.state.profile.location}</span>
          </Fragment>
        );
      }

      if (this.state.profile.bio) {
        bio = (
          <Fragment>
            <h5>Bio</h5>
            <span>{this.state.profile.bio}</span>
          </Fragment>
        );
      }

      if (
        this.state.profile.social.goodreads ||
        this.state.profile.social.facebook ||
        this.state.profile.social.instagram
      ) {
        social = (
          <Fragment>
            <h5>Social</h5>
            <div>
              {this.state.profile.social.goodreads && (
                <Fragment>
                  <a
                    href={this.state.profile.social.goodreads}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img className={classes.social__icon} alt="goodreads" src={goodreadsIcon} />
                  </a>
                </Fragment>
              )}
              {this.state.profile.social.facebook && (
                <Fragment>
                  <a
                    href={this.state.profile.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img className={classes.social__icon} alt="facebook" src={facebookIcon} />
                  </a>
                </Fragment>
              )}
              {this.state.profile.social.instagram && (
                <a
                  href={this.state.profile.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img className={classes.social__icon} alt="instagram" src={instagramIcon} />
                </a>
              )}
            </div>
          </Fragment>
        );
      }

      if (favoriteBook || location || bio || social) {
        about = (
          <Fragment>
            <h5 className="ui horizontal divider header">
              <i className="user icon" />
              About
            </h5>
            <div className="ui raised segment">
              <div
                className={['ui stackable two column grid', favoriteBookObj ? 'two' : 'one'].join(
                  ' '
                )}
              >
                {favoriteBookObj}
                <div className="column">
                  {favoriteBook}
                  {location}
                  {bio}
                  {social}
                </div>
              </div>
            </div>
          </Fragment>
        );
      }
    }

    let profileContent = (
      <Fragment>
        {heading}
        {about}
      </Fragment>
    );

    return (
      <Fragment>
        <Navbar />
        <div
          className={[
            'ui container',
            !isEmpty(this.state.profile.favoriteBookObj) ? '' : 'text'
          ].join(' ')}
        >
          <div className={['ui segment', this.state.isLoading ? 'loading' : ''].join(' ')}>
            {this.state.isLoading && (
              <Fragment>
                <br />
                <br />
                <br />
                <br />
              </Fragment>
            )}
            {profileContent}
          </div>
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
