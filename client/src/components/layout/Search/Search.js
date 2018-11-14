// package
import React, { Fragment, Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Search as SemanticSearch } from 'semantic-ui-react';

class Search extends Component {
  state = {
    searchQuery: '',
    isSearching: false,
    searchResults: {}
  };
  updateSearchHandler = e => {
    const searchQuery = e.target.value;
    this.setState({ searchQuery }, () => {
      if (searchQuery) {
        this.setState({ isSearching: true }, () => {
          axios.post('/api/search/suggest', { searchQuery: this.state.searchQuery }).then(res => {
            const searchResults = {};
            if (res.data.books.length > 0) {
              searchResults.books = {
                name: 'Books',
                results: res.data.books
              };
            }
            if (res.data.authors.length > 0) {
              searchResults.authors = {
                name: 'Authors',
                results: res.data.authors
              };
            }
            this.setState({ searchResults, isSearching: false });
          });
        });
      }
    });
  };
  handleResultSelect = (e, { result }) => {
    this.setState({ searchQuery: '' }, () => {
      this.props.history.push(result.link);
      window.location.reload();
    });
  };
  render() {
    let placeHolder;
    if (this.props.navBar) {
      placeHolder = 'Search...';
    } else {
      placeHolder = 'Search books and authors...';
    }

    return (
      <Fragment>
        <div style={{ width: '100%', padding: '10px' }}>
          <SemanticSearch
            category
            fluid
            // selectFirstResult
            input={{ fluid: true }}
            autoFocus={this.props.autoFocus}
            loading={this.state.isSearching}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.updateSearchHandler}
            results={this.state.searchResults}
            value={this.state.searchQuery}
            placeholder={placeHolder}
          />
        </div>
      </Fragment>
    );
  }
}

Search.propTypes = {
  autoFocus: PropTypes.bool,
  navBar: PropTypes.bool
};

export default withRouter(Search);
