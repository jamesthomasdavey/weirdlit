// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

// component
import Heading from './components/Heading/Heading';
import About from './components/About/About';
import BooksRead from './components/BooksRead/BooksRead';
import Reviews from './components/Reviews/Reviews';

class Profile extends Component {
  state = {
    profile: {
      _id: '',
      user: {
        _id: '',
        name: ''
      },
      handle: '',
      favoriteBook: {},
      location: '',
      bio: '',
      booksRead: [],
      social: {
        goodreads: '',
        twitter: '',
        facebook: '',
        instagram: ''
      },
      date: '',
      isLoading: true
    }
  };

  componentDidMount = () => {
    if (this.props.match.params.userId) {
      this.updateFromProfileByUserId(this.props.match.params.userId);
    } else if (this.props.match.params.handle) {
      this.updateFromProfileByHandle(this.props.match.params.handle);
    } else {
      this.updateFromProfileByToken();
    }
  };

  updateFromProfileByUserId = userId => {
    axios
      .get(`/api/profile/user/${userId}`)
      .then(res => {
        if (res.data.handle) {
          window.history.pushState('', '', `/profile/${res.data.handle}`);
        }
        const profile = res.data;
        const currentState = this.state;
        currentState.profile = profile;
        currentState.profile.isLoading = false;
        this.setState(currentState);
      })
      .catch(() => {
        this.props.history.push('/404');
      });
  };

  updateFromProfileByHandle = handle => {
    axios
      .get(`/api/profile/handle/${handle}`)
      .then(res => {
        const profile = res.data;
        const currentState = this.state;
        currentState.profile = profile;
        currentState.profile.isLoading = false;
        this.setState(currentState);
      })
      .catch(() => {
        this.props.history.push('/404');
      });
  };

  updateFromProfileByToken = () => {
    axios
      .get('/api/profile')
      .then(res => {
        if (res.data.handle) {
          window.history.pushState('', '', `/profile/${res.data.handle}`);
        } else {
          window.history.pushState('', '', `/profile/user/${this.props.auth.user._id}`);
        }
        const profile = res.data;
        const currentState = this.state;
        currentState.profile = profile;
        currentState.profile.isLoading = false;
        this.setState(currentState);
      })
      .catch(() => {
        this.props.history.push('/404');
      });
  };

  render() {
    document.title = `${this.state.profile.user.name || 'Profile'} | WeirdLit`;
    const profileContent = (
      <div className={['ui segment', this.state.profile.isLoading ? 'loading' : ''].join(' ')}>
        {this.state.profile.isLoading && (
          <Fragment>
            <br />
            <br />
            <br />
            <br />
          </Fragment>
        )}
        {!this.state.profile.isLoading && (
          <Fragment>
            <Heading
              name={this.state.profile.user.name}
              date={this.state.profile.date}
              isCurrentUser={this.state.profile.user._id === this.props.auth.user._id}
            />
            <About
              favoriteBook={this.state.profile.favoriteBook}
              location={this.state.profile.location}
              bio={this.state.profile.bio}
              social={this.state.profile.social}
              // history={this.props.history}
            />
            <BooksRead books={this.state.profile.booksRead} userId={this.state.profile.user._id} />
            <Reviews
              userId={this.state.profile.user._id}
              name={this.state.profile.user.name}
              history={this.props.history}
            />
          </Fragment>
        )}
      </div>
    );

    return <div className="ui container">{profileContent}</div>;
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Profile));
