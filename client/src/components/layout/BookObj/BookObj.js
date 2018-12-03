// package
import React, { Component, Fragment } from 'react';
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
    let bookObjContent;
    let authorLinks;

    if (!this.state.isLoading) {
      if (!this.props.authorId) {
        authorLinks = <AuthorLinks authors={this.state.authors} />;
      } else if (this.props.authorId) {
        if (this.state.authors.length > 1) {
          const authorIdArray = this.state.authors.map(author => author._id);
          const removeIndex = authorIdArray.indexOf(this.props.authorId);
          const authorArray = [...this.state.authors];
          authorArray.splice(removeIndex, 1);
          authorLinks = (
            <Fragment>
              with <AuthorLinks authors={authorArray} />
            </Fragment>
          );
        }
      }
    }

    if (this.state.isLoading) {
      bookObjContent = <Spinner />;
    } else {
      let descriptionContent;

      if (this.state.description.length < 250) {
        descriptionContent = this.state.description;
      } else {
        const descriptionArray = this.state.description.substring(0, 250).split(' ');
        descriptionArray.pop();
        descriptionContent = descriptionArray.join(' ') + '...';
      }

      bookObjContent = (
        <div className={classes.wrapper}>
          <div className="ui items">
            <div className="ui item">
              <Link
                to={`/books/${this.props.bookId}`}
                className={['ui small image', classes.book__image].join(' ')}
              >
                <img
                  crossOrigin="anonymous"
                  src={this.state.image.largeThumbnail}
                  className="book__image"
                  alt={this.state.title}
                />
              </Link>
              <div className="content">
                <div className={['header', classes.header].join(' ')}>{this.state.title}</div>
                <div className={classes.authors}>{authorLinks}</div>
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
    return <div>{bookObjContent}</div>;
  }
}

BookObj.propTypes = {
  bookId: PropTypes.string.isRequired,
  authorId: PropTypes.string
};

export default BookObj;
