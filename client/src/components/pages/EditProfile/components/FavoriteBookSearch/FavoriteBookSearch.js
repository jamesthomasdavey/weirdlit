// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// component
import { Search as SemanticSearch } from 'semantic-ui-react';

class FavoriteBookSearch extends Component {
  state = {
    searchQuery: '',
    isSearching: false,
    searchResults: []
  };
  updateSearchHandler = e => {
    const searchQuery = e.target.value;
    this.setState({ searchQuery }, () => {
      if (searchQuery) {
        this.setState({ isSearching: true }, () => {
          axios
            .post('/api/search/favoriteBook', { searchQuery: this.state.searchQuery })
            .then(res => {
              let searchResults = res.data;
              searchResults.push({ title: `"${this.state.searchQuery}"`, _id: '' });
              this.setState({ searchResults, isSearching: false });
            });
        });
      }
    });
  };
  handleResultSelect = (e, { result }) => {
    const selectedBook = {
      title: result.title.split('"').join(''),
      _id: result._id
    };
    this.setState({ searchQuery: '' }, () => {
      this.props.addFavoriteBookHandler(selectedBook);
    });
  };
  render() {
    return (
      <div style={{ width: '100%' }}>
        <SemanticSearch
          loading={this.state.isSearching}
          fluid
          icon="plus"
          selectFirstResult
          onResultSelect={this.handleResultSelect}
          onSearchChange={this.updateSearchHandler}
          results={this.state.searchResults}
          value={this.state.searchQuery}
          placeholder="Add your favorite book..."
        />
      </div>
    );
  }
}

FavoriteBookSearch.propTypes = {
  addFavoriteBookHandler: PropTypes.func.isRequired
};

export default FavoriteBookSearch;
