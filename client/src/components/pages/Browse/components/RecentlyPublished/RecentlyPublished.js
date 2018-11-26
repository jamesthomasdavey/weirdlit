// package
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// component
import Spinner from './../../../../layout/Spinner/Spinner';
import BookThumb from './../../../../layout/BookThumb/BookThumb';

// css
import classes from './RecentlyPublished.module.css';

class RecentlyPublished extends Component {
  state = {
    books: [],
    isLoading: true
  };
  componentDidMount = () => {
    axios.get(`/api/books/sort/publishedDate/limit/6/skip/0`).then(res => {
      this.setState({ books: res.data, isLoading: false });
    });
  };
  render() {
    let recentlyPublishedContent;
    if (this.state.isLoading) {
      recentlyPublishedContent = <Spinner />;
    } else {
      recentlyPublishedContent = this.state.books.map(book => {
        return <BookThumb book={book} key={book._id} />;
      });
    }
    return (
      <Fragment>
        <h5 className="ui horizontal divider header">
          <i className="book icon" />
          Recently Published
        </h5>
        <div className="ui raised segment">
          <div className={classes.books__wrapper}>{recentlyPublishedContent}</div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/books" className="ui tiny button" style={{ marginTop: '16px' }}>
              View All
            </Link>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default RecentlyPublished;
