// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';

class ProfileBooksHeader extends Component {
  state = {
    userName: '',
    isLoading: true
  };
  componentDidMount = () => {
    axios.get(`/api/profile/user/${this.props.userId}`).then(res => {
      this.setState({ userName: res.data.user.name, isLoading: false });
    });
  };
  render() {
    let profileLink;

    if (!this.state.isLoading) {
      profileLink = <Link to={`/profile/user/${this.props.userId}`}>{this.state.userName}</Link>;
      document.title = `Books Read by ${this.state.userName.split(' ')[0]} | WeirdLit`;
    }

    return (
      <div style={{ width: '100%', padding: '12px' }}>
        {!this.state.isLoading && <h3>Books read by {profileLink}</h3>}
      </div>
    );
  }
}

ProfileBooksHeader.propTypes = {
  userId: PropTypes.string.isRequired
};

export default ProfileBooksHeader;
