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
      publishedDate: '',
      pageCount: '',
      identifiers: {
        googleId: '',
        isbn10: '',
        isbn13: ''
      },
      tags: [],
      description: ''
    },
    isLoading: true
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
      // .catch(() => {
      //   this.props.history.push('/404');
      //   window.location.reload();
      // });
  };
  render() {
    document.title = this.state.book.title
      ? `${this.state.book.title} | WeirdLit`
      : 'WeirdLit | The Database for Strange Writings';
    return (
      <Fragment>
        {!this.state.isLoading && <Heading book={this.state.book} />}
        <div className="ui container">
          {!this.state.isLoading && (
            <div className="ui segment">
              <Reviews
                book={this.state.book}
                history={this.props.history}
              />
            </div>
          )}
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
