import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from './../../../actions/profileActions';

import Navbar from './../../layout/Navbar/Navbar';
import Spinner from './../../layout/Spinner/Spinner';
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
    errors: {}
  };
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  changeInputHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  formSubmitHandler = e => {
    e.preventDefault();
    console.log('submit');
  };
  render() {
    const { errors } = this.state;
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let editProfileContent;

    if (loading) {
      editProfileContent = (
        <form onSubmit={this.formSubmitHandler} noValidate className="ui loading form">
          <TextInputField
            name="handle"
            label="Handle"
            value=""
            onChange={this.changeInputHandler}
            error=""
            info="A unique handle for your profile URL."
          />
          <TextInputField
            name="favoriteBook"
            label="Favorite Book"
            value={this.state.favoriteBook}
            onChange={this.changeInputHandler}
            error={errors.favoriteBook}
          />
          <TextInputField
            name="location"
            label="Location"
            value=""
            onChange={this.changeInputHandler}
            error=""
          />
          <TextAreaInputField
            name="bio"
            placeholder=""
            label="Bio"
            rows="3"
            value=""
            onChange={this.changeInputHandler}
            error={errors.bio}
            minHeight="100px"
          />
          <SocialInputField
            name="goodreads"
            placeholder=""
            value=""
            icon="goodreads"
            onChange={this.changeInputHandler}
            error=""
          />
          <SocialInputField
            name="facebook"
            placeholder=""
            value=""
            icon="facebook"
            onChange={this.changeInputHandler}
            error=""
          />
          <SocialInputField
            name="instagram"
            placeholder=""
            value=""
            icon="instagram"
            onChange={this.changeInputHandler}
            error=""
          />
          <input type="submit" className="ui primary button" value="Save" />
          <Link to="/profile" className="ui button">
            Discard
          </Link>
        </form>
      );
    } else {
      editProfileContent = (
        <form onSubmit={this.formSubmitHandler} noValidate className="ui form">
          <TextInputField
            name="handle"
            label="Handle"
            value={this.state.handle}
            onChange={this.changeInputHandler}
            error={errors.handle}
            info={
              this.state.handle
                ? 'Preview: weirdl.it/profile/' + this.state.handle
                : 'A unique handle for your profile URL.'
            }
          />
          <TextInputField
            name="favoriteBook"
            label="Favorite Book"
            value={this.state.favoriteBook}
            onChange={this.changeInputHandler}
            error={errors.favoriteBook}
          />
          <TextInputField
            name="location"
            label="Location"
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
          />
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
          <input type="submit" className="ui primary button" value="Save" />
          <Link to="/profile" className="ui button">
            Discard
          </Link>
        </form>
      );
    }

    return (
      <Fragment>
        <Navbar />
        <div className="ui text container">
          <h1 className="ui header" style={{ textAlign: 'center' }}>
            Edit Profile
          </h1>
          {editProfileContent}
        </div>
      </Fragment>
    );
  }
}

EditProfile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(EditProfile);
