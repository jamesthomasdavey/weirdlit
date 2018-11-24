// package
import React, { Component } from 'react';
import axios from 'axios';

// component
import Spinner from './../../layout/Spinner/Spinner';
import BookCard from './../../layout/BookCard/BookCard';

// css
import classes from './Books.module.css';

class Books extends Component {
  state = {
    booksOnDisplay: [],
    totalAvailable: '',
    tags: [],
    sort: {
      sortMethod: '',
      sortOrder: ''
    },
    isLoading: true,
    isLoadingMore: false
  };
  componentDidMount = () => {
    this.updateFromTags();
  };
  updateFromTags = () => {
    let selectedTags;
    if (!this.props.match.params.tags || this.props.match.params.tags === 'none') {
      selectedTags = [];
    } else {
      selectedTags = this.props.match.params.tags.split('+');
    }
    selectedTags = selectedTags.map(tag => {
      return tag.split('%20').join(' ');
    });
    axios.get('/api/tags').then(res => {
      const tags = res.data.map(tag => {
        if (selectedTags.includes(tag.name)) {
          return {
            _id: tag._id,
            name: tag.name,
            isSelected: true
          };
        } else {
          return tag;
        }
      });
      this.setState(
        { tags: tags.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) },
        this.updateSort
      );
    });
  };
  updateSort = () => {
    let sort = {};
    if (!this.props.match.params.sortMethod) {
      sort.sortMethod = 'publishedDate';
    } else {
      sort.sortMethod = this.props.match.params.sortMethod;
    }
    if (!this.props.match.params.sortOrder) {
      sort.sortOrder = 'desc';
    } else {
      sort.sortOrder = this.props.match.params.sortOrder;
    }
    this.setState({ sort }, this.updateUrl);
  };
  updateUrl = () => {
    let tags;

    tags = this.state.tags.reduce((acc, current) => {
      if (current.isSelected) {
        return [...acc, current.name];
      } else {
        return acc;
      }
    }, []);

    if (tags.length > 0) {
      tags = tags.join('+');
    } else {
      tags = 'none';
    }
    if (
      this.state.sort.sortMethod === 'publishedDate' ||
      this.state.sort.sortMethod === 'rating' ||
      this.state.sort.sortMethod === 'pageCount'
    ) {
      if (this.state.sort.sortOrder === 'asc' || this.state.sort.sortOrder === 'desc') {
        window.history.pushState(
          '',
          '',
          `/books/filter/${tags}/sort/${this.state.sort.sortMethod}/${this.state.sort.sortOrder}`
        );
        this.updateFromBooks();
      } else {
        this.props.history.push('/404');
      }
    } else {
      this.props.history.push('/404');
    }
  };
  updateFromBooks = () => {
    let tags;

    tags = this.state.tags.reduce((acc, current) => {
      if (current.isSelected) {
        return [...acc, current._id];
      } else {
        return acc;
      }
    }, []);

    if (tags.length > 0) {
      tags = tags.join('+');
    } else {
      tags = 'none';
    }
    axios
      .get(
        `/api/books/filter/${tags}/sort/${this.state.sort.sortMethod}/${
          this.state.sort.sortOrder
        }/skip/${this.state.booksOnDisplay.length}`
      )
      .then(res => {
        const currentBooksOnDisplay = this.state.booksOnDisplay;
        const newBooksToDisplay = res.data.books;
        const books = [...currentBooksOnDisplay, ...newBooksToDisplay];
        this.setState({
          booksOnDisplay: books,
          totalAvailable: res.data.totalAvailable,
          isLoading: false,
          isLoadingMore: false
        });
      });
  };
  showMoreBooksHandler = () => {
    this.setState({ isLoadingMore: true }, this.updateFromBooks);
  };
  render() {
    document.title = 'Browse Books | WeirdLit';

    let books;
    let showMoreBooksButton;

    if (this.state.isLoading) {
      books = <Spinner />;
    } else {
      books = this.state.booksOnDisplay.map(book => {
        return <BookCard key={book._id} book={book} showRating showAuthors showPublishedDate />;
      });
    }

    if (this.state.totalAvailable > this.state.booksOnDisplay.length) {
      showMoreBooksButton = (
        <div className={classes.showMoreWrapper} onClick={this.showMoreBooksHandler}>
          <button className={['ui tiny button', this.state.isLoadingMore && 'loading'].join(' ')}>
            Show More
          </button>
        </div>
      );
    }

    return (
      <div className="ui container">
        <div className="ui segment">
          <div className={classes.booksWrapper}>{books}</div>
          {showMoreBooksButton}
        </div>
      </div>
    );
  }
}

export default Books;
