// package
import React, { Component } from 'react';
import axios from 'axios';

// component
import BookObj from './BookObj/BookObj';

// css
import classes from './FeaturedBook.module.css';

class FeaturedBook extends Component {
  state = {
    book: {},
    isLoading: true
  };
  componentDidMount = () => {
    axios
      .get('/api/books/featured')
      .then(res => {
        return axios.get(`/api/books/${res.data.bookId}`);
      })
      .then(res => {
        this.setState({ book: res.data, isLoading: false });
      });
  };
  render() {
    let backgroundImage;
    let bookObj;

    if (!this.state.isLoading) {
      backgroundImage = this.state.book.image.hugeThumbnail;
    }

    if (!this.state.isLoading) {
      bookObj = <BookObj bookId={this.state.book._id} />;
    }

    return (
      <div className={classes.wrapper}>
        <div
          className={classes.backdrop}
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
        <div className={classes.backdrop__cover} />
        <h2 className={classes.featuredHeader}>FEATURED</h2>
        {bookObj}
      </div>
    );
  }
}

export default FeaturedBook;
