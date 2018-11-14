// package
import React, { Fragment, Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import isEmpty from './../../../validation/is-empty';
import PropTypes from 'prop-types';

// component
import TextInputField from './../../layout/TextInputField/TextInputField';

class DeleteBook extends Component {
  state = {
    title: '',
    bookTitle: '',
    isLoading: true,
    errors: {}
  };
  componentDidMount = () => {
    axios
      .get(`/api/books/${this.props.match.params.bookId}`)
      .then(res => {
        this.setState({ bookTitle: res.data.title, isLoading: false, errors: {} });
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
    axios.delete(`/api/books/${this.props.match.params.bookId}`).then(res => {
      if (!isEmpty(res.data.errors)) {
        this.setState({ errors: res.data.errors });
      } else {
        this.props.history.push('/books');
      }
    });
  };
  render() {
    return (
      <Fragment>
        <div className="ui container">
          <div className="ui text container">
            <h1>Delete {this.state.bookTitle || 'Book'}</h1>
            <h3>Are you sure? This cannot be undone.</h3>
            <form
              onSubmit={this.formSubmitHandler}
              className={['ui form', this.state.isLoading && 'loading'].join(' ')}
            >
              <TextInputField
                label="Please type the name of the book to delete:"
                value={this.state.title || ''}
                onChange={this.changeInputHandler}
                type="text"
                name="title"
              />
              <input
                type="submit"
                className={[
                  'button negative ui',
                  this.state.title === this.state.bookTitle ? '' : 'disabled'
                ].join(' ')}
                value={`Delete ${this.state.bookTitle || 'Book'}`}
                disabled={this.state.title !== this.state.bookTitle}
              />
              <Link
                to={`/books/${this.props.match.params.bookId}/edit`}
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

DeleteBook.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(DeleteBook));
