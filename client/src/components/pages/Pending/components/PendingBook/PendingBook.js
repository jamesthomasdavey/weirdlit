// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

// css
import classes from './PendingBook.module.css';
import AuthorLinks from './../../../../layout/AuthorLinks/AuthorLinks';

class PendingBook extends Component {
  state = {
    isBeingDeleted: false,
    isApproving: false,
    isRejecting: false
  };
  approveBookHandler = bookId => {
    this.setState({ isApproving: true }, () => {
      axios.put(`/api/books/${bookId}/approve`).then(res => {
        this.setState({ isBeingDeleted: true }, () => {
          this.props.deletePendingBookHandler();
        });
      });
    });
  };
  rejectBookHandler = bookId => {
    this.setState({ isRejecting: true }, () => {
      axios.put(`/api/books/${bookId}/reject`).then(res => {
        this.setState({ isBeingDeleted: true }, () => {
          this.props.deletePendingBookHandler();
        });
      });
    });
  };
  render() {
    return (
      <div
        className={[
          'item',
          classes.bookItem,
          this.state.isBeingDeleted ? classes.deleted : ''
        ].join(' ')}
      >
        <div className="ui small image">
          <img alt="cover" src={this.props.book.image.mediumThumbnail} />
        </div>
        <div className="content">
          <div className="header">{this.props.book.title}</div>
          {this.props.book.subtitle && <div className="meta">{this.props.book.subtitle}</div>}
          <div className="meta">{this.props.book.publishedDate}</div>
          {this.props.book.authors && (
            <div className="meta">
              <AuthorLinks authors={this.props.book.authors} />
            </div>
          )}
          <div className="meta">
            Requested by{' '}
            <Link to={`/profile/user/${this.props.book.creator._id}`}>
              {this.props.book.creator.name}
            </Link>
          </div>
          <button
            className={[
              'ui teal labeled tiny icon button',
              this.state.isApproving ? 'loading' : '',
              this.state.isRejecting ? 'disabled' : ''
            ].join(' ')}
            onClick={() => this.approveBookHandler(this.props.book._id)}
          >
            Approve
            <i className="add icon" />
          </button>
          <button
            className={[
              'ui red labeled tiny icon button',
              this.state.isRejecting ? 'loading' : '',
              this.state.isApproving ? 'disabled' : ''
            ].join(' ')}
            onClick={() => this.rejectBookHandler(this.props.book._id)}
          >
            Reject
            <i className="x icon" />
          </button>
          <Link to={`/books/${this.props.book._id}/edit`} className="ui labeled tiny icon button">
            Edit
            <i className="edit icon" />
          </Link>
        </div>
      </div>
    );
  }
}

PendingBook.propTypes = {
  book: PropTypes.object.isRequired,
  deletePendingBookHandler: PropTypes.func.isRequired
};

export default PendingBook;
