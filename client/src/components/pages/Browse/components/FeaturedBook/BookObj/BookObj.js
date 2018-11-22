// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import renderHTML from 'react-render-html';

// component
import Spinner from './../../../../../layout/Spinner/Spinner';
import AuthorLinks from './../../../../../layout/AuthorLinks/AuthorLinks';
import BookThumb from './BookThumb/BookThumb';

// css
import classes from './BookObj.module.css';

class BookObj extends Component {
  state = {
    title: '',
    subtitle: '',
    authors: [],
    publishedDate: '',
    description: '',
    image: {},
    isLoading: true
  };
  componentDidMount = () => {
    axios.get(`/api/books/${this.props.bookId}`).then(res => {
      this.setState({
        title: res.data.title,
        subtitle: res.data.subtitle,
        authors: res.data.authors,
        publishedDate: new Date(res.data.publishedDate),
        description: res.data.description,
        image: res.data.image,
        isLoading: false
      });
    });
  };
  render() {
    let bookObjContent;

    if (this.state.isLoading) {
      bookObjContent = <Spinner />;
    } else {
      let descriptionContent;

      if (this.state.description.length < 300) {
        descriptionContent = this.state.description;
      } else {
        const descriptionArray = this.state.description.substring(0, 300).split(' ');
        descriptionArray.pop();
        descriptionContent = descriptionArray.join(' ') + '...';
      }

      const moreByLink = this.state.authors.map((author, index) => {
        if (index < 2) {
          return (
            <Link
              to={`/authors/${author._id}/books`}
              key={author._id}
              className={classes.moreByLink}
            >
              More by {author.name}
            </Link>
          );
        } else return null;
      });

      bookObjContent = (
        <div className={classes.wrapper}>
          <BookThumb book={{ image: this.state.image, _id: this.props.bookId }} />
          <div className={classes.content}>
            <div className={classes.header}>{this.state.title}</div>
            <div className={classes.authors}>
              <AuthorLinks authors={this.state.authors} inverted />
            </div>
            <div className={classes.year}>{this.state.publishedDate.getFullYear()}</div>
            <div className={classes.description}>{renderHTML(descriptionContent)}</div>
            <div className={classes.viewButton}>
              <Link to={`/books/${this.props.bookId}`} className="tiny primary button ui">
                View
              </Link>
            </div>
            <div className={classes.moreByLinks}>{moreByLink}</div>
          </div>
        </div>
      );
    }
    return <div>{bookObjContent}</div>;
  }
}

BookObj.propTypes = {
  bookId: PropTypes.string.isRequired
};

export default BookObj;
