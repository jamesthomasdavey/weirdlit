// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';

class AuthorBooksHeader extends Component {
  state = {
    authorName: '',
    isLoading: true
  };
  componentDidMount = () => {
    axios.get(`/api/authors/${this.props.authorId}`).then(res => {
      this.setState({ authorName: res.data.name, isLoading: false });
    });
  };
  render() {
    let authorLink;

    if (!this.state.isLoading) {
      authorLink = <Link to={`/authors/${this.props.authorId}`}>{this.state.authorName}</Link>;
    }

    return (
      <div style={{ width: '100%', padding: '12px' }}>
        {!this.state.isLoading && <h3 className="ui dividing header">Books by {authorLink}</h3>}
      </div>
    );
  }
}

AuthorBooksHeader.propTypes = {
  authorId: PropTypes.string.isRequired
};

export default AuthorBooksHeader;
