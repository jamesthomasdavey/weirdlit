// package
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// validation
import isEmpty from './../../../validation/is-empty';

// component
import BookObj from './../../layout/BookObj/BookObj';
import TextInputField from './../../layout/TextInputField/TextInputField';
import StarRating from './../../layout/StarRating/StarRating';
import TextAreaInputField from './../../layout/TextAreaInputField/TextAreaInputField';

class EditReview extends Component {
  state = {
    form: { headline: '', rating: 0, text: '' },
    oldForm: { headline: '', rating: 0, text: '' },
    bookTitle: '',
    isLoading: true,
    hasSaved: false,
    hasChanged: false,
    errors: {}
  };
  componentDidMount = () => {
    this.updateFromReview();
  };
  updateFromReview = () => {
    axios
      .get(
        `/api/books/${this.props.match.params.bookId}/reviews/${
          this.props.match.params.reviewId
        }/edit`
      )
      .then(res => {
        const currentState = this.state;
        currentState.form = {
          headline: res.data.headline,
          rating: res.data.rating,
          text: res.data.text
        };
        currentState.oldForm = { ...currentState.form };
        currentState.bookTitle = res.data.book.title;
        currentState.isLoading = false;
        this.setState(currentState);
      })
      .catch(() => {
        // this.props.history.push('/404');
      });
  };
  changeInputHandler = e => {
    const currentState = this.state;
    currentState.form[e.target.name] = e.target.value;
    this.setState(currentState, this.checkIfChanged);
  };
  changeRatingHandler = rating => {
    const currentState = this.state;
    currentState.form.rating = rating;
    this.setState(currentState, this.checkIfChanged);
  };
  checkIfChanged = () => {
    const form = this.state.form;
    const oldForm = this.state.oldForm;
    if (
      form.headline !== oldForm.headline ||
      form.rating.toString() !== oldForm.rating.toString() ||
      form.text !== oldForm.text
    ) {
      this.setState({ hasChanged: true, errors: {} });
    } else {
      this.setState({ hasChanged: false });
    }
  };
  formSubmitHandler = e => {
    e.preventDefault();
    this.setState({ isLoading: true }, () => {
      axios
        .put(
          `/api/books/${this.props.match.params.bookId}/reviews/${
            this.props.match.params.reviewId
          }`,
          this.state.form
        )
        .then(res => {
          if (res.data.errors && !isEmpty(res.data.errors)) {
            this.setState({ errors: res.data.errors });
          } else {
            this.setState({ hasSaved: true, hasChanged: false, errors: {} }, this.updateFromReview);
          }
        });
    });
  };
  render() {
    document.title = !this.state.bookTitle
      ? `Edit Your Review | WeirdLit`
      : `Edit Your Review for ${this.state.bookTitle} | WeirdLit`;
    return (
      <div className="ui text container">
        <div className="ui segment">
          <BookObj bookId={this.props.match.params.bookId} />
          <div
            className={['ui raised segment', this.state.isLoading && 'loading'].join(' ')}
            style={{ padding: '22px' }}
          >
            <form
              className={['ui form', this.state.isLoading && 'loading'].join(' ')}
              onSubmit={this.formSubmitHandler}
            >
              <TextInputField
                label="Headline"
                name="headline"
                autoFocus
                value={this.state.form.headline ? this.state.form.headline : ''}
                onChange={this.changeInputHandler}
                maxLength="100"
                error={this.state.errors.headline}
              />
              <div className={['ui field'].join(' ')}>
                <label>Rating</label>
                <StarRating
                  value={this.state.form.rating}
                  changeRatingHandler={this.changeRatingHandler}
                />
                {this.state.errors.rating && (
                  <div className="ui pointing basic label">{this.state.errors.rating}</div>
                )}
              </div>
              <TextAreaInputField
                name="text"
                minHeight="300px"
                rows="1"
                label="Text"
                value={this.state.form.text}
                onChange={this.changeInputHandler}
                maxLength="3000"
                error={this.state.errors.text}
                placeholder={`Edit your review for ${
                  this.state.bookTitle ? this.state.bookTitle : 'this book'
                } here...`}
                info={
                  this.state.form.text &&
                  `Characters remaining: ${3000 - this.state.form.text.length}`
                }
              />
              <input
                type="submit"
                disabled={!this.state.hasChanged}
                className={['ui primary button', this.state.hasChanged ? '' : 'disabled'].join(' ')}
                value={this.state.hasSaved ? 'Saved' : 'Save'}
              />
              <Link
                className={['ui button'].join(' ')}
                to={`/books/${this.props.match.params.bookId}/reviews/${
                  this.props.match.params.reviewId
                }`}
                style={{ marginLeft: '1rem' }}
              >
                {this.state.hasSaved ? `Back to ${this.state.bookTitle}` : 'Cancel'}
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EditReview;
