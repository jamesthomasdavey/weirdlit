// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

// component
import Heading from './components/Heading/Heading';
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
    isLoading: true,
    errors: []
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
        {!this.state.isLoading && <Heading book={this.state.book} />}
        <div className="ui container">
          <div className="ui segment">
            {!this.state.isLoading && (
              <Reviews
                bookId={this.state.book._id}
                bookTitle={this.state.book.title}
                history={this.props.history}
              />
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

Book.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Book);
