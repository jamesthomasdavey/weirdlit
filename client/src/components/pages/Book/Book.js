// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
      },
      description: '',
      tags: []
    },
    isLoading: true,
    errors: []
  };
  componentDidMount = () => {
    if (this.props.match.params.bookId) {
      this.updateFromBook(this.props.match.params.bookId);
    }
  };
  updateFromBook = bookId => {
    axios
      .get(`/api/books/${bookId}`)
      .then(res => {
        this.setState({ book: res.data, isLoading: false });
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    document.title = `${this.state.book.title} | WeirdLit`;
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

export default withRouter(connect(mapStateToProps)(Book));
