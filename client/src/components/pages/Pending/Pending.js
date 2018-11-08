// package
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import arrayToSentence from 'array-to-sentence';

// component
import Spinner from './../../layout/Spinner/Spinner';

class Pending extends Component {
  state = {
    books: [],
    isLoading: false,
    errors: {}
  };
  componentDidMount = () => {
    this.updateFromPendingBooks();
  };
  updateFromPendingBooks = () => {
    this.setState({ isLoading: true }, () => {
      axios
        .get('/api/books/pending')
        .then(res => {
          this.setState({ books: res.data, isLoading: false });
        })
        .catch(err => {
          this.setState({ books: [], isLoading: false });
        });
    });
  };
  approveBookHandler = book => {
    this.setState({ isLoading: true }, () => {
      axios
        .put(`/api/books/${book._id}/approve`)
        .then(() => {
          return axios.post(`/api/users/${book.creator._id}/notifications`, {
            content: `<strong>${book.title}</strong> has been added.`,
            link: `/books/${book._id}`
          });
        })
        .then(this.updateFromPendingBooks)
        .catch(this.updateFromPendingBooks);
    });
  };
  rejectBookHandler = book => {
    this.setState({ isLoading: true }, () => {
      axios
        .put(`/api/books/${book._id}/reject`)
        .then(res => {
          this.updateFromPendingBooks();
        })
        .catch(err => {
          this.updateFromPendingBooks();
        });
    });
  };
  render() {
    let pendingResults;
    if (this.state.isLoading) {
      pendingResults = <Spinner />;
    } else if (this.state.books.length === 0) {
      pendingResults = <h5 style={{ textAlign: 'center', padding: '2rem' }}>No pending books.</h5>;
    } else {
      pendingResults = this.state.books.map(book => {
        return (
          <div className="item book__item" key={book._id}>
            <div className="ui small image">
              <img alt="cover" src={book.image.mediumThumbnail} />
            </div>
            <div className="content">
              <div className="header">{book.title}</div>
              {book.subtitle && <div className="meta">{book.subtitle}</div>}
              <div className="meta">{book.publishedDate}</div>
              {book.authors && (
                <div className="meta">
                  {arrayToSentence(book.authors, { lastSeparator: ' & ' })}
                </div>
              )}
              <button
                className="ui teal labeled tiny icon button"
                onClick={() => this.approveBookHandler(book)}
              >
                Approve
                <i className="add icon" />
              </button>
              <button
                className="ui red labeled tiny icon button"
                onClick={() => this.rejectBookHandler(book)}
              >
                Reject
                <i className="x icon" />
              </button>
              <Link to={`/books/${book._id}/edit`} className="ui labeled tiny icon button">
                Edit
                <i className="edit icon" />
              </Link>
            </div>
          </div>
        );
      });
    }
    return (
      <Fragment>
        <div className="ui container">
          <div className="ui text container">
            <div className="ui divided items">{pendingResults}</div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Pending;
