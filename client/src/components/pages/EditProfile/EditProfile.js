import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from './../../../actions/profileActions';

import Navbar from './../../layout/Navbar/Navbar';
import Spinner from './../../layout/Spinner/Spinner';
import TextInputField from '../../layout/TextInputField/TextInputField';

class EditProfile extends Component {
  state = {
    displaySocialInputs: false,
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
  render() {
    const { errors } = this.state;
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let editProfileContent;

    if (loading) {
      editProfileContent = <Spinner />;
    } else {
      editProfileContent = (
        <form noValidate className="ui fluid form">
          <TextInputField
            name="handle"
            placeholder="Handle"
            value={this.state.handle}
            onChange={this.changeInputHandler}
            error={errors.handle}
          />
        </form>
      );
    }

    return (
      <Fragment>
        <Navbar />
        <div className="ui container">
          <h1>Edit Profile</h1>
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
