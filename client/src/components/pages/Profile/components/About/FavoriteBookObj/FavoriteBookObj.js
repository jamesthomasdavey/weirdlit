// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';

// component
import AuthorLinks from './../../../../../layout/AuthorLinks/AuthorLinks';
import Spinner from './../../../../../layout/Spinner/Spinner';

// css
import classes from './FavoriteBookObj.module.css';

class FavoriteBookObj extends Component {
  state = {
    title: '',
    subtitle: '',
    authors: [],
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
        image: res.data.image,
        isLoading: false
      });
    });
  };
  render() {
    let favoriteBookContent;
    if (this.state.isLoading) {
      favoriteBookContent = <Spinner />;
    } else {
      favoriteBookContent = (
        <Fragment>
          <h5>Favorite Book</h5>
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
                <div className="header">{this.state.title}</div>
                <div className="meta">{this.state.publishedDate.getFullYear()}</div>
                <div>
                  <AuthorLinks authors={this.state.authors} />
                </div>
                <Link to={`/books/${this.props.bookId}`} className="tiny primary button ui">
                  View
                </Link>
              </div>
            </div>
          </div>
        </Fragment>
      );
    }
    return <div className="column">{favoriteBookContent}</div>;
  }
}

FavoriteBookObj.propTypes = {
  bookId: PropTypes.string.isRequired
};

export default FavoriteBookObj;
