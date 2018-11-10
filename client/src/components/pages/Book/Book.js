// package
import React, { Component, Fragment } from 'react';
import axios from 'axios';

// component
import Reviews from './components/Reviews/Reviews';

class Book extends Component {
  state = {
    book: {
      _id: '',
      title: '',
      subtitle: '',
      authors: [],
      pageCount: '',
      publishedDate: '',
      identifiers: {
        googleId: '',
        isbn10: '',
        isbn13: ''
      }
    },
    isLoading: true
  };
  componentDidMount = () => {
    if (this.props.match.params.bookId) {
      this.updateFromBook(this.props.match.params.bookId);
    } else {
      console.log('unauthorized');
    }
  };
  updateFromBook = bookId => {
    axios.get(`/api/books/${bookId}`).then(res => {
      this.setState({ book: res.data, isLoading: false });
    });
  };
  render() {
    return (
      <Fragment>
        <div className="ui container">
          <div className="ui segment">
            {this.state.book._id && (
              <Reviews bookId={this.state.book._id} bookTitle={this.state.book.title} />
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Book;
