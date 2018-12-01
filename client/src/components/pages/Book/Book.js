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
    colors: [],
    isLoading: true
  };
  componentWillReceiveProps = nextProps => {
    if (nextProps.match.params.bookId !== this.props.match.params.bookId) {
      this.setState({ book: {}, isLoading: true }, () => {
        this.updateFromBook(nextProps.match.params.bookId);
      });
    }
  };
  componentDidMount = () => {
    if (this.props.match.params.bookId) {
      this.updateFromBook(this.props.match.params.bookId);
    }
  };
  updateFromBook = bookId => {
    axios
      .get(`/api/books/${bookId}/gradient`)
      .then(res => {
        this.setState({ book: res.data.book, colors: res.data.colors, isLoading: false });
      })
      .catch(() => {
        this.props.history.push('/404');
        window.location.reload();
      });
  };
  render() {
    if (!this.state.isLoading) {
      document.title = `${this.state.book.title} | WeirdLit`;
    }
    return (
      <Fragment>
        {!this.state.isLoading && <Heading book={this.state.book} colors={this.state.colors} />}
        <div className="ui container">
          {!this.state.isLoading && (
            <div className="ui segment">
              <Reviews book={this.state.book} history={this.props.history} />
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
