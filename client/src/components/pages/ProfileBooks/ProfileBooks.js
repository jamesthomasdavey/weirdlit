// package
import React, { Component, Fragment } from 'react';
import axios from 'axios';

// component
import Spinner from './../../layout/Spinner/Spinner';
import BookCard from './../../layout/BookCard/BookCard';
import FilterSortBar from './../../layout/FilterSortBar/FilterSortBar';
import ProfileBooksHeader from './components/ProfileBooksHeader/ProfileBooksHeader';

// css
import classes from './ProfileBooks.module.css';

class ProfileBooks extends Component {
  state = {
    booksOnDisplay: [],
    totalAvailable: '',
    tags: [],
    sort: {
      sortMethod: '',
      sortOrder: ''
    },
    isLoading: true,
    isLoadingBooks: false,
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
          `/profile/user/${this.props.match.params.userId}/books/filter/${tags}/sort/${
            this.state.sort.sortMethod
          }/${this.state.sort.sortOrder}`
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
        `/api/profile/user/${this.props.match.params.userId}/books/filter/${tags}/sort/${
          this.state.sort.sortMethod
        }/${this.state.sort.sortOrder}/skip/0`
      )
      .then(res => {
        const updatedTags = this.state.tags.map(tag => {
          const updatedTag = { ...tag };
          if (!res.data.usableTagIds.includes(tag._id)) {
            updatedTag.isDisabled = true;
          } else {
            updatedTag.isDisabled = false;
          }
          return updatedTag;
        });
        this.setState({
          booksOnDisplay: res.data.books,
          totalAvailable: res.data.totalAvailable,
          isLoading: false,
          isLoadingBooks: false,
          isLoadingMore: false,
          tags: updatedTags
        });
      });
  };
  toggleSelectedHandler = tagName => {
    const currentState = this.state;
    currentState.tags = currentState.tags.map(tag => {
      if (tag.name === tagName) {
        tag.isSelected = !tag.isSelected;
      }
      return tag;
    });
    currentState.isLoadingBooks = true;
    this.setState(currentState, this.updateUrl);
  };
  sortMethodHandler = sortMethod => {
    const currentState = this.state;
    currentState.sort.sortMethod = sortMethod;
    currentState.isLoadingBooks = true;
    this.setState(currentState, this.updateUrl);
  };
  toggleSortOrderHandler = () => {
    const currentState = this.state;
    currentState.sort.sortOrder = this.state.sort.sortOrder === 'desc' ? 'asc' : 'desc';
    currentState.isLoadingBooks = true;
    this.setState(currentState, this.updateUrl);
  };
  showMoreBooksHandler = () => {
    this.setState({ isLoadingMore: true }, () => {
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
          `/api/profile/user/${this.props.match.params.userId}/books/filter/${tags}/sort/${
            this.state.sort.sortMethod
          }/${this.state.sort.sortOrder}/skip/${this.state.booksOnDisplay.length}`
        )
        .then(res => {
          const currentBooksOnDisplay = this.state.booksOnDisplay;
          const newBooksToDisplay = res.data.books;
          const books = [...currentBooksOnDisplay, ...newBooksToDisplay];
          const updatedTags = this.state.tags.map(tag => {
            const updatedTag = { ...tag };
            if (!res.data.usableTagIds.includes(tag._id)) {
              updatedTag.isDisabled = true;
            } else {
              updatedTag.isDisabled = false;
            }
            return updatedTag;
          });
          this.setState({
            booksOnDisplay: books,
            totalAvailable: res.data.totalAvailable,
            isLoading: false,
            isLoadingMore: false,
            tags: updatedTags
          });
        });
    });
  };
  render() {
    let filterSortBar;
    let books;
    let showMoreBooksButton;

    if (!this.state.isLoading) {
      filterSortBar = (
        <FilterSortBar
          tags={this.state.tags}
          sort={this.state.sort}
          toggleSelectedHandler={this.toggleSelectedHandler}
          sortMethodHandler={this.sortMethodHandler}
          toggleSortOrderHandler={this.toggleSortOrderHandler}
        />
      );
    }

    if (this.state.isLoading || this.state.isLoadingBooks) {
      books = <Spinner />;
    } else {
      if (this.state.booksOnDisplay.length > 0) {
        books = this.state.booksOnDisplay.map(book => {
          return (
            <BookCard
              key={book._id}
              book={book}
              showRating
              showAuthors
              showPageCount
              showPublishedDate
            />
          );
        });
      } else {
        books = (
          <h5 style={{ textAlign: 'center', width: '100%', margin: '2rem 0' }}>
            No books to display.
          </h5>
        );
      }
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
      <Fragment>
        {filterSortBar}
        <div className="ui container">
          <div className="ui segment">
            <div className={classes.booksWrapper}>
              <ProfileBooksHeader userId={this.props.match.params.userId} />
              {books}
            </div>
            {showMoreBooksButton}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default ProfileBooks;
