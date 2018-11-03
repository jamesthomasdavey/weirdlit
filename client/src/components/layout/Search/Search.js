import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Search.css';

class Search extends Component {
  render() {
    return (
      <div className="search__container ui icon input container fluid">
        <input autoFocus={this.props.autoFocus} type="text" placeholder="Search..." />
        <i className="search__icon search icon" />
      </div>
    );
  }
}

Search.propTypes = {
  autoFocus: PropTypes.bool
};

export default Search;
