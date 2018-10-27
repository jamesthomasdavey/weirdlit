import React, { Component } from 'react';
import './Search.css';

class Search extends Component {
  render() {
    return (
      <div className="search__container ui icon input container fluid">
        <input type="text" placeholder="Search..." />
        <i className="search__icon search icon" />
      </div>
    );
  }
}

export default Search;
