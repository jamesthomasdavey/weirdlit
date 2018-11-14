// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

// validation
import isEmpty from '../../../validation/is-empty';

// component
import TextInputField from '../../layout/TextInputField/TextInputField';
import TextAreaInputField from '../../layout/TextAreaInputField/TextAreaInputField';
import SocialInputField from './components/SocialInputField/SocialInputField';

class EditProfile extends Component {
  state = {
    form: {
      handle: '',
      favoriteBook: '',
      location: '',
      bio: '',
      goodreads: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    oldForm: {
      handle: '',
      favoriteBook: '',
      location: '',
      bio: '',
      goodreads: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    isLoading: true,
    hasChanged: false,
    errors: {}
  };
  componentDidMount = () => {
    this.updateFromProfile();
  };
  updateFromProfile = () => {
    axios.get('/api/profile').then(res => {
      const profile = {
        handle: res.data.handle,
        favoriteBook: res.data.favoriteBook,
        location: res.data.location,
        bio: res.data.bio,
        goodreads: res.data.social.goodreads,
        twitter: res.data.social.twitter,
        facebook: res.data.social.facebook,
        instagram: res.data.social.instagram,
        date: res.data.date
      };
      const currentState = this.state;
      currentState.form = profile;
      currentState.oldForm = { ...profile };
      currentState.isLoading = false;
      this.setState(currentState);
    });
  };
  changeInputHandler = e => {
    const currentState = this.state;
    currentState.form[e.target.name] = e.target.value;
    if (
      currentState.form.handle !== currentState.oldForm.handle ||
      currentState.form.favoriteBook !== currentState.oldForm.favoriteBook ||
      currentState.form.location !== currentState.oldForm.location ||
      currentState.form.bio !== currentState.oldForm.bio ||
      currentState.form.goodreads !== currentState.oldForm.goodreads ||
      currentState.form.twitter !== currentState.oldForm.twitter ||
      currentState.form.facebook !== currentState.oldForm.facebook ||
      currentState.form.instagram !== currentState.oldForm.instagram
    ) {
      currentState.hasChanged = true;
      currentState.hasSaved = false;
    } else {
      currentState.hasChanged = false;
      currentState.errors = {};
    }
    this.setState(currentState);
  };
  formSubmitHandler = e => {
    e.preventDefault();
    const profileData = this.state.form;
    this.setState({ isLoading: true }, () => {
      axios.put('/api/profile', profileData).then(res => {
        if (!isEmpty(res.data.errors)) {
          this.setState({ errors: res.data.errors, isLoading: false });
        } else {
          this.setState({ hasSaved: true, hasChanged: false, errors: {} }, this.updateFromProfile);
        }
      });
    });
  };
  render() {
    document.title = 'Edit Profile | WeirdLit';

    return (
      <Fragment>
        <div className="ui text container">
          <div className="ui segment">
            <form
              noValidate
              className={['ui form', this.state.isLoading ? 'loading' : ''].join(' ')}
              onSubmit={this.formSubmitHandler}
            >
              <div style={{ paddingBottom: '20px' }}>
                <h2>Edit Profile</h2>
              </div>
              <TextInputField
                name="handle"
                label="Handle"
                maxLength="40"
                autoFocus
                value={this.state.form.handle}
                onChange={this.changeInputHandler}
                error={this.state.errors.handle}
                info={
                  this.state.form.handle
                    ? 'A unique handle for your profile URL. Preview: weirdl.it/profile/' +
                      this.state.form.handle.toLowerCase()
                    : 'A unique handle for your profile URL.'
                }
              />
              <TextInputField
                name="favoriteBook"
                label="Favorite Book"
                maxLength="200"
                value={this.state.form.favoriteBook}
                onChange={this.changeInputHandler}
                error={this.state.errors.favoriteBook}
              />
              <TextInputField
                name="location"
                label="Location"
                maxLength="100"
                value={this.state.form.location}
                onChange={this.changeInputHandler}
                error={this.state.errors.location}
              />
              <TextAreaInputField
                name="bio"
                placeholder="Write a short bio about yourself."
                label="Bio"
                rows="1"
                value={this.state.form.bio}
                onChange={this.changeInputHandler}
                error={this.state.errors.bio}
                minHeight="136px"
                maxLength="1000"
                info={
                  this.state.form.bio &&
                  `Characters remaining: ${1000 - this.state.form.bio.length}`
                }
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
                    value={this.state.form.goodreads}
                    icon="goodreads"
                    onChange={this.changeInputHandler}
                    error={this.state.errors.goodreads}
                  />
                  <SocialInputField
                    name="twitter"
                    placeholder="Twitter"
                    value={this.state.form.twitter}
                    icon="twitter"
                    onChange={this.changeInputHandler}
                    error={this.state.errors.twitter}
                  />
                  <SocialInputField
                    name="facebook"
                    placeholder="Facebook"
                    value={this.state.form.facebook}
                    icon="facebook"
                    onChange={this.changeInputHandler}
                    error={this.state.errors.facebook}
                  />
                  <SocialInputField
                    name="instagram"
                    placeholder="Instagram"
                    value={this.state.form.instagram}
                    icon="instagram"
                    onChange={this.changeInputHandler}
                    error={this.state.errors.instagram}
                  />
                </div>
              </div>
              <input
                type="submit"
                disabled={!this.state.hasChanged}
                className={['ui primary button', this.state.hasChanged ? '' : 'disabled'].join(' ')}
                value={this.state.hasSaved ? 'Saved' : 'Save'}
              />
              <Link
                to={`/profile/user/${this.props.auth.user._id}`}
                style={{ marginLeft: '1rem' }}
                className="ui button"
              >
                {this.state.hasSaved ? 'Back to Profile' : 'Cancel'}
              </Link>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

EditProfile.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(EditProfile);
