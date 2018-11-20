// package
import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// validation
import isEmpty from './../../../validation/is-empty';

// component
import TextInputField from './../../layout/TextInputField/TextInputField';

class DeleteReview extends Component {
  state = {
    title: '',
    bookTitle: '',
    isLoading: true,
    isDeleting: false,
    errors: {}
  };
  componentDidMount = () => {
    axios
      .get(
        `/api/books/${this.props.match.params.bookId}/reviews/${this.props.match.params.reviewId}`
      )
      .then(res => {
        this.setState({ bookTitle: res.data.book.title, isLoading: false });
      })
      .catch(() => {
        this.props.history.push('/404');
      });
  };
  changeInputHandler = e => {
    const value = e.target.value;
    this.setState({ title: value });
  };
  formSubmitHandler = e => {
    e.preventDefault();
    this.setState({ isDeleting: true }, () => {
      axios
        .delete(
          `/api/books/${this.props.match.params.bookId}/reviews/${this.props.match.params.reviewId}`
        )
        .then(res => {
          if (res.data.errors && !isEmpty(res.data.errors)) {
            this.setState({ errors: res.data.errors, isDeleting: false });
          } else {
            this.props.history.push(`/books/${this.props.match.params.bookId}`);
          }
        });
    });
  };
  render() {
    document.title = this.state.bookTitle
      ? `Delete Your Review for ${this.state.bookTitle} | WeirdLit`
      : 'Delete Your Review | WeirdLit';
    return (
      <Fragment>
        <div className="ui container">
          <div className="ui text container">
            <h1>Delete Your Review for {this.state.bookTitle || 'this Book'}</h1>
            <h3>Are you sure? This cannot be undone.</h3>
            <form
              onSubmit={this.formSubmitHandler}
              className={['ui form', this.state.isLoading && 'loading'].join(' ')}
            >
              <TextInputField
                label="Please type the name of the book to delete your review:"
                value={this.state.title || ''}
                onChange={this.changeInputHandler}
                type="text"
                name="title"
              />
              <button
                type="submit"
                className={[
                  'button negative ui',
                  this.state.title === this.state.bookTitle ? '' : 'disabled',
                  this.state.isDeleting ? 'loading' : ''
                ].join(' ')}
                disabled={this.state.title !== this.state.bookTitle}
              >
                Delete Review
              </button>
              <Link
                to={`/books/${this.props.match.params.bookId}/reviews/${
                  this.props.match.params.reviewId
                }`}
                className="button ui"
                style={{ marginLeft: '1rem' }}
              >
                Cancel
              </Link>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DeleteReview;
