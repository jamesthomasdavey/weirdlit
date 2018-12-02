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
    colors: [],
    featuredDate: '',
    isLoading: true
  };
  componentDidMount = () => {
    axios
      .get('/api/books/featured')
      .then(res => {
        this.setState({ featuredDate: res.data.featuredDate });
        return axios.get(`/api/books/${res.data.bookId}/gradient`);
      })
      .then(res => {
        this.setState({ book: res.data.book, colors: res.data.colors, isLoading: false });
      });
  };
  render() {
    let backdrop;
    let dateHeading;
    let bookObj;

    if (!this.state.isLoading) {
      if (!this.state.colors) {
        backdrop = (
          <div
            className={[classes.backdrop, classes.blur].join(' ')}
            style={{ backgroundImage: `url('${this.state.book.image.largeThumbnail}')` }}
          />
        );
      } else {
        const newColors = this.state.colors.map(color => {
          return `rgb(${color._rgb[0]}, ${color._rgb[1]}, ${color._rgb[2]})`;
        });
        backdrop = (
          <div
            className={classes.backdrop}
            style={{
              backgroundImage: `linear-gradient(135deg, ${newColors[0]}, ${newColors[1]}, ${
                newColors[2]
              })`
            }}
          />
        );
      }
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
        {backdrop}
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
