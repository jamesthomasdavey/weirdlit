// package
import React, { Component, Fragment } from 'react';
import axios from 'axios';

// component
import PendingBook from './components/PendingBook/PendingBook';

class Pending extends Component {
  state = {
    books: [],
    isLoading: true,
    errors: {}
  };
  componentDidMount = () => {
    this.updateFromPendingBooks();
  };
  updateFromPendingBooks = () => {
    axios
      .get('/api/books/pending')
      .then(res => {
        this.setState({ books: res.data, isLoading: false });
      })
      .catch(err => {
        this.setState({ books: [], isLoading: false });
      });
  };
  deletePendingBookHandler = () => {
    setTimeout(() => {
      this.updateFromPendingBooks();
    }, 400);
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
    document.title = 'Pending Books | WeirdLit';
    let pendingResults;
    if (!this.state.isLoading) {
      if (this.state.books.length === 0) {
        pendingResults = (
          <h5 style={{ textAlign: 'center', padding: '2rem' }}>No pending books.</h5>
        );
      } else {
        pendingResults = this.state.books.map(book => {
          return (
            <PendingBook book={book} deletePendingBookHandler={this.deletePendingBookHandler} />
          );
        });
      }
    }
    return (
      <Fragment>
        <div className="ui container">
          <div className="ui text container">
            <div className={['ui segment', this.state.isLoading ? 'loading' : ''].join(' ')}>
              {this.state.isLoading && (
                <Fragment>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </Fragment>
              )}
              {!this.state.isLoading && <div className="ui divided items">{pendingResults}</div>}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Pending;
