import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';
import { getCurrentProfile } from './../../../actions/profileActions';
import { updateCurrentProfile } from './../../../actions/profileActions';
import isEmpty from './../../../validation/is-empty';

import Navbar from './../../layout/Navbar/Navbar';
import TextInputField from '../../layout/TextInputField/TextInputField';
import TextAreaInputField from '../../layout/TextAreaInputField/TextAreaInputField';
import SocialInputField from '../../layout/SocialInputField/SocialInputField';

class EditProfile extends Component {
  state = {
    handle: '',
    favoriteBook: '',
    location: '',
    bio: '',
    goodreads: '',
    facebook: '',
    instagram: '',
    saving: false,
    hasChanged: false,
    errors: {}
  };
  componentDidMount = () => {
    this.props.getCurrentProfile();
  };
  componentWillReceiveProps = nextProps => {
    if (!isEmpty(nextProps.errors)) {
      this.setState({ errors: nextProps.errors });
    } else {
      if (nextProps.profile.profile) {
        const nextProfile = {
          handle: nextProps.profile.profile.handle,
          favoriteBook:
            nextProps.profile.profile.favoriteBook.title || nextProps.profile.profile.favoriteBook,
          location: nextProps.profile.profile.location,
          bio: nextProps.profile.profile.bio,
          goodreads: nextProps.profile.profile.social.goodreads,
          facebook: nextProps.profile.profile.social.facebook,
          instagram: nextProps.profile.profile.social.instagram
        };
        this.setState(nextProfile);
      }
    }
  };
  changeInputHandler = e => {
    this.setState({ [e.target.name]: e.target.value, hasChanged: true });
  };
  formSubmitHandler = e => {
    e.preventDefault();
    const profileData = {
      handle: this.state.handle,
      favoriteBook: this.state.favoriteBook,
      location: this.state.location,
      bio: this.state.bio,
      goodreads: this.state.goodreads,
      facebook: this.state.facebook,
      instagram: this.state.instagram
    };
    this.setState({ saving: true }, () => {
      this.props.updateCurrentProfile(profileData, this.props.history, () => {
        this.setState({ saving: false });
      });
    });
  };
  render() {
    document.title = 'Edit Profile | WeirdLit';
    const { errors } = this.state;
    const { profile, loading } = this.props.profile;

    return (
      <Fragment>
        <Navbar />
        <div className="ui container">
          <div className="ui text container">
            <form
              onSubmit={this.formSubmitHandler}
              noValidate
              className={[
                'ui form',
                !profile || loading || this.state.saving ? 'loading' : ''
              ].join(' ')}
              style={{ marginTop: '2rem' }}
            >
              <TextInputField
                name="handle"
                label="Handle"
                maxLength="40"
                value={this.state.handle}
                onChange={this.changeInputHandler}
                error={errors.handle}
                info={
                  this.state.handle
                    ? 'A unique handle for your profile URL. Preview: weirdl.it/profile/' +
                      this.state.handle
                    : 'A unique handle for your profile URL.'
                }
              />
              <TextInputField
                name="favoriteBook"
                label="Favorite Book"
                maxLength="200"
                value={this.state.favoriteBook}
                onChange={this.changeInputHandler}
                error={errors.favoriteBook}
              />
              <TextInputField
                name="location"
                label="Location"
                maxLength="100"
                value={this.state.location}
                onChange={this.changeInputHandler}
                error={errors.location}
              />
              <TextAreaInputField
                name="bio"
                placeholder="Write a short bio about yourself."
                label="Bio"
                rows="3"
                value={this.state.bio}
                onChange={this.changeInputHandler}
                error={errors.bio}
                minHeight="100px"
                maxLength="1000"
                info={this.state.bio && `Characters remaining: ${1000 - this.state.bio.length}`}
              />
              <div className="ui segments">
                <div className="ui segment">
                  <label htmlFor="goodreads">
                    <h5>Social</h5>
                  </label>
                </div>
                <div className="ui secondary segment">
                  <SocialInputField
                    name="goodreads"
                    placeholder="Goodreads"
                    value={this.state.goodreads}
                    icon="goodreads"
                    onChange={this.changeInputHandler}
                    error={errors.goodreads}
                  />
                  <SocialInputField
                    name="facebook"
                    placeholder="Facebook"
                    value={this.state.facebook}
                    icon="facebook"
                    onChange={this.changeInputHandler}
                    error={errors.facebook}
                  />
                  <SocialInputField
                    name="instagram"
                    placeholder="Instagram"
                    value={this.state.instagram}
                    icon="instagram"
                    onChange={this.changeInputHandler}
                    error={errors.instagram}
                  />
                </div>
              </div>
              <input
                type="submit"
                className={['ui primary button', this.state.hasChanged ? '' : 'disabled'].join(' ')}
                value="Save"
              />
              <Link to="/profile" className="ui button">
                Cancel
              </Link>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

EditProfile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, updateCurrentProfile }
)(EditProfile);
