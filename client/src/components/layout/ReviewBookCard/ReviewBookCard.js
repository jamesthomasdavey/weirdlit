// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class ReviewBookCard extends Component {
  state = {
    book: {},
    isLoading: true
  };
  componentDidMount = () => {
    axios.get(`/api/books/${this.props.bookId}`).then(res => {
      this.setState({ book: res.data, isLoading: false });
    });
  };
  render() {
    if (!this.state.isLoading) {
      return (
        <div className="ui segment">
          <div className="ui medium image">
            <img src={this.state.book.image.largeThumbnail} />
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

ReviewBookCard.propTypes = {
  bookId: PropTypes.string.isRequired
};

export default ReviewBookCard;
