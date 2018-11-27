// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';

// component
import ReviewSortBar from './../../../../layout/ReviewSortBar/ReviewSortBar';

// css
import classes from './ProfileReviewsHeader.module.css';

class ProfileReviewsHeader extends Component {
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
    let reviewSortBar;

    if (!this.state.isLoading) {
      reviewSortBar = (
        <ReviewSortBar
          sort={this.props.sort}
          sortMethodHandler={this.props.sortMethodHandler}
          toggleSortOrderHandler={this.props.toggleSortOrderHandler}
        />
      );
    }

    if (!this.state.isLoading) {
      profileLink = <Link to={`/profile/user/${this.props.userId}`}>{this.state.userName}</Link>;
      document.title = `Reviews by ${this.state.userName.split(' ')[0]} | WeirdLit`;
    }

    return (
      <div style={{ width: '100%', padding: '12px' }}>
        {!this.state.isLoading && (
          <h3 className={['ui dividing header', classes.h3Wrapper].join(' ')}>
            <span>Reviews by {profileLink}</span>
            {reviewSortBar}
          </h3>
        )}
      </div>
    );
  }
}

ProfileReviewsHeader.propTypes = {
  userId: PropTypes.string.isRequired,
  sort: PropTypes.object.isRequired,
  sortMethodHandler: PropTypes.func.isRequired,
  toggleSortOrderHandler: PropTypes.func.isRequired
};

export default ProfileReviewsHeader;
