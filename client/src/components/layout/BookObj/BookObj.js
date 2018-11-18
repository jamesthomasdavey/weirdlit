// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import renderHTML from 'react-render-html';

// component
import Spinner from './../Spinner/Spinner';
import AuthorLinks from './../AuthorLinks/AuthorLinks';

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
    let bookCardContent;

    if (this.state.isLoading) {
      bookCardContent = <Spinner />;
    } else {
      let descriptionContent;

      if (this.state.description.length < 250) {
        descriptionContent = this.state.description;
      } else {
        const descriptionArray = this.state.description.substring(0, 250).split(' ');
        descriptionArray.pop();
        descriptionContent = descriptionArray.join(' ') + '...';
      }

      bookCardContent = (
        <div className={classes.wrapper}>
          <div className="ui items">
            <div className="ui item">
              <Link
                to={`/books/${this.props.bookId}`}
                className={['ui small image', classes.book__image].join(' ')}
              >
                <img
                  src={this.state.image.largeThumbnail}
                  className="book__image"
                  alt={this.state.title}
                />
              </Link>
              <div className="content">
                <div className={['header', classes.header].join(' ')}>{this.state.title}</div>
                <div className={classes.authors}>
                  <AuthorLinks authors={this.state.authors} />
                </div>
                <div className={['meta', classes.year].join(' ')}>
                  {this.state.publishedDate.getFullYear()}
                </div>
                <div className="description">{renderHTML(descriptionContent)}</div>
                <div className={['meta', classes.viewButton].join(' ')}>
                  <Link to={`/books/${this.props.bookId}`} className="tiny primary button ui">
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div>{bookCardContent}</div>;
  }
}

BookObj.propTypes = {
  bookId: PropTypes.string.isRequired
};

export default BookObj;