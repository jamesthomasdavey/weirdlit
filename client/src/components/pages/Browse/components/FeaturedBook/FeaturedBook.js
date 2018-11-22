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
    featuredDate: '',
    isLoading: true
  };
  componentDidMount = () => {
    axios
      .get('/api/books/featured')
      .then(res => {
        this.setState({ featuredDate: res.data.featuredDate });
        return axios.get(`/api/books/${res.data.bookId}`);
      })
      .then(res => {
        this.setState({ book: res.data, isLoading: false });
      });
  };
  render() {
    let backgroundImage;
    let dateHeading;
    let bookObj;

    if (!this.state.isLoading) {
      backgroundImage = this.state.book.image.hugeThumbnail;
    }

    if (!this.state.isLoading) {
      bookObj = <BookObj bookId={this.state.book._id} />;
    }

    if (!this.state.isLoading) {
      const date = new Date(this.state.featuredDate * 24 * 60 * 60 * 1000);
      const month = date.toLocaleString('en-us', { month: 'long' });
      const day = date.getDate();
      const year = date.getFullYear();
      dateHeading = `Week of ${month} ${day}, ${year}`;
    }

    return (
      <div className={classes.wrapper}>
        {!this.state.isLoading && (
          <div
            className={classes.backdrop}
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          />
        )}
        <div className={classes.backdrop__cover} />
        <div className={classes.featuredHeader}>
          <h2>FEATURED</h2>
          <h4>{dateHeading}</h4>
        </div>
        {bookObj}
      </div>
    );
  }
}

export default FeaturedBook;
