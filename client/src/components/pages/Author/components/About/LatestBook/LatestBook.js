// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// component
import BookObj from './../../../../../layout/BookObj/BookObj';
import Spinner from './../../../../../layout/Spinner/Spinner';

class LatestBook extends Component {
  state = {
    bookId: '',
    isLoading: true
  };
  componentDidMount = () => {
    axios.get(`/api/authors/${this.props.authorId}/books/latest`).then(res => {
      this.setState({ bookId: res.data.bookId, isLoading: false });
    });
  };

  render() {
    let bookObj;

    if (this.state.isLoading) {
      bookObj = <Spinner />;
    } else {
      bookObj = <BookObj bookId={this.state.bookId} authorId={this.props.authorId} />;
    }

    return (
      <div className="column">
        <h5>Latest</h5>
        {bookObj}
      </div>
    );
  }
}

LatestBook.propTypes = {
  authorId: PropTypes.string.isRequired
};

export default LatestBook;
