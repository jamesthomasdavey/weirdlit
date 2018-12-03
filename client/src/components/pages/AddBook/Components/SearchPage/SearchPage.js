// package
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import arrayToSentence from 'array-to-sentence';

// css
import classes from './SearchPage.module.css';

class SearchPage extends Component {
  state = {
    searchQuery: '',
    searchResults: {
      results: [],
      loading: false,
      loaded: false
    }
  };
  componentDidMount = () => {
    if (this.props.initialSearch) {
      this.setState({ searchQuery: this.props.initialSearch }, this.searchSubmitHandler);
    }
  };
  changeSearchHandler = e => {
    this.setState({ searchQuery: e.target.value });
  };
  searchSubmitHandler = e => {
    e && e.preventDefault();
    // set loading to true
    if (this.state.searchQuery !== '') {
      const searchResults = this.state.searchResults;
      searchResults.loading = true;
      this.setState({ searchResults }, () => {
        // get search results
        axios
          .post('/api/books/add/search', { searchQuery: this.state.searchQuery })
          .then(res => {
            // store search results in state
            this.setState({ searchResults: { results: res.data, loading: false, loaded: true } });
          })
          .catch(() => {
            // if there's an error, make search results empty
            this.setState({ searchResults: { results: [], loading: false, loaded: true } });
          });
      });
    } else {
      this.setState({ searchResults: { results: [], loading: false, loaded: false } });
    }
  };
  render() {
    document.title = 'Search for a Book to Add | WeirdLit';

    let searchResults;

    // if search results are loaded and there's nothing there, say no results found
    if (this.state.searchResults.loaded && this.state.searchResults.results.length === 0) {
      searchResults = (
        <h5 style={{ textAlign: 'center', padding: '2rem' }}>
          No results found. Please try adding more author or title details, or{' '}
          <Link to="/books/add/custom">add a custom book here.</Link>
        </h5>
      );
    } else if (this.state.searchResults.loaded && this.state.searchResults.results.length > 0) {
      const searchResultsList = this.state.searchResults.results.map(book => {
        return (
          <div className={['item', classes.bookItem].join(' ')} key={book.googleId + '_googleId'}>
            <div className="ui small image">
              <img crossOrigin="anonymous" alt="cover" src={book.thumb} />
            </div>
            <div className="content">
              <div className="header">{book.title}</div>
              {book.subtitle && <div className="meta">{book.subtitle}</div>}
              <div className="meta">{book.publishedDate}</div>
              {book.authors && (
                <div className="meta">
                  {arrayToSentence(book.authors, { lastSeparator: ' & ' })}
                </div>
              )}
              <button
                className={[
                  'ui teal labeled icon button',
                  book.alreadySubmitted ? 'disabled' : ''
                ].join(' ')}
                onClick={() => this.props.selectBookHandler(book.googleId, this.state.searchQuery)}
              >
                Add This Book
                <i className="add icon" />
              </button>
            </div>
          </div>
        );
      });

      searchResults = (
        <Fragment>
          {searchResultsList}
          <h5 style={{ textAlign: 'center', padding: '2rem' }}>
            Can't find what you're looking for?{' '}
            <Link to="/books/add/custom">Add a custom book here.</Link>
          </h5>
        </Fragment>
      );
    } else if (!this.state.searchResults.loaded) {
      searchResults = (
        <h5 style={{ textAlign: 'center', padding: '2rem' }}>
          Search for a book above, or <Link to="/books/add/custom">add a custom book here.</Link>
        </h5>
      );
    }

    return (
      <div className="ui text container">
        <div className="ui segment">
          <form onSubmit={this.searchSubmitHandler} className="ui form">
            <div
              className={[
                'ui icon input container fluid',
                this.state.searchResults.loading ? 'loading' : ''
              ].join(' ')}
            >
              <input
                id="search"
                type="text"
                autoFocus
                onChange={this.changeSearchHandler}
                name="search"
                value={this.state.searchQuery}
                placeholder="Search for a book to add..."
              />
              <i className="search__icon search icon" />
            </div>
          </form>
          <div className="ui divided items">{searchResults}</div>
        </div>
      </div>
    );
  }
}

SearchPage.propTypes = {
  selectBookHandler: PropTypes.func.isRequired,
  initialSearch: PropTypes.string.isRequired
};

export default SearchPage;
