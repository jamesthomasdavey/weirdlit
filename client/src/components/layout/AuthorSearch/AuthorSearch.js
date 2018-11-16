// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// component
import { Search as SemanticSearch } from 'semantic-ui-react';

class AuthorSearch extends Component {
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
          axios.post('/api/search/authors', { searchQuery: this.state.searchQuery }).then(res => {
            let searchResults = [];
            if (res.data.length > 0) {
              const alreadyAddedNames = this.props.alreadyAddedAuthors.map(author => author.name);
              res.data.forEach(author => {
                if (!alreadyAddedNames.includes(author.title) && searchResults.length < 4) {
                  searchResults.push(author);
                }
              });
            }
            searchResults.push({ title: `"${this.state.searchQuery}"`, _id: '' });
            this.setState({ searchResults, isSearching: false });
          });
        });
      }
    });
  };
  handleResultSelect = (e, { result }) => {
    const selectedAuthor = {
      name: result.title.split('"').join(''),
      _id: result._id
    };
    this.setState({ searchQuery: '' }, () => {
      this.props.addAuthorHandler(selectedAuthor);
    });
  };
  render() {
    return (
      <div>
        <SemanticSearch
          loading={this.state.isSearching}
          fluid
          icon="plus"
          selectFirstResult
          onResultSelect={this.handleResultSelect}
          onSearchChange={this.updateSearchHandler}
          results={this.state.searchResults}
          value={this.state.searchQuery}
          placeholder="Add an author..."
        />
      </div>
    );
  }
}

AuthorSearch.propTypes = {
  addAuthorHandler: PropTypes.func.isRequired,
  alreadyAddedAuthors: PropTypes.array.isRequired
};

export default AuthorSearch;
