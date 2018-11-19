// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

// validation
import isEmpty from './../../../validation/is-empty';

// component
import BookObj from './../../layout/BookObj/BookObj';
import TextInputField from './../../layout/TextInputField/TextInputField';
import StarRating from './../../layout/StarRating/StarRating';
import TextAreaInputField from './../../layout/TextAreaInputField/TextAreaInputField';

class NewReview extends Component {
  state = {
    form: {
      headline: '',
      rating: 0,
      text: ''
    },
    errors: {},
    bookId: '',
    bookTitle: '',
    isLoading: true,
    isSubmitting: false
  };
  componentDidMount = () => {
    this.updateFromReviews();
  };
  updateFromReviews = () => {
    axios.get(`/api/books/${this.props.match.params.bookId}/reviews`).then(res => {
      const reviewerIds = res.data.map(review => review.creator._id);
      if (reviewerIds.includes(this.props.auth.user._id)) {
        this.props.history.push('/404');
      } else {
        this.setState(
          { bookId: this.props.match.params.bookId, isLoading: false },
          this.updateFromBook
        );
      }
    });
  };
  updateFromBook = () => {
    axios.get(`/api/books/${this.props.match.params.bookId}`).then(res => {
      this.setState({ bookTitle: res.data.title });
    });
  };
  changeInputHandler = e => {
    const currentState = this.state;
    currentState.form[e.target.name] = e.target.value;
    this.setState(currentState);
  };
  changeRatingHandler = rating => {
    const currentState = this.state;
    currentState.form.rating = rating;
    this.setState(currentState);
  };
  formSubmitHandler = e => {
    e.preventDefault();
    this.setState({ isSubmitting: true });
    axios.post(`/api/books/${this.state.bookId}/reviews`, this.state.form).then(res => {
      if (res.data.errors && !isEmpty(res.data.errors)) {
        this.setState({ errors: res.data.errors, isSubmitting: false });
      } else {
        this.props.history.push(`/books/${this.state.bookId}`);
      }
    });
  };
  render() {
    document.title = !this.state.bookTitle
      ? `Write a Review | WeirdLit`
      : `Write a Review for ${this.state.bookTitle} | WeirdLit`;

    return (
      <div className="ui text container">
        <div className="ui segment">
          <BookObj bookId={this.props.match.params.bookId} />
          <div
            className={['ui raised segment', this.state.isLoading && 'loading'].join(' ')}
            style={{ padding: '22px' }}
          >
            <form className="ui form" onSubmit={this.formSubmitHandler}>
              <TextInputField
                label="Headline"
                name="headline"
                autoFocus
                value={this.state.form.headline}
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
                placeholder={`Write your review for ${
                  this.state.bookTitle ? this.state.bookTitle : 'this book'
                } here...`}
                info={
                  this.state.form.text &&
                  `Characters remaining: ${3000 - this.state.form.text.length}`
                }
              />
              <button
                className={['ui primary button', this.state.isSubmitting && 'loading'].join(' ')}
              >
                Submit
              </button>
              <Link
                to={`/books/${this.props.match.params.bookId}`}
                style={{ marginLeft: '1rem' }}
                className="ui button"
              >
                Cancel
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

NewReview.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(NewReview));
