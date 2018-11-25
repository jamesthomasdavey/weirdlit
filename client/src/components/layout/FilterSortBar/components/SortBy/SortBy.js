// package
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Header } from 'semantic-ui-react';

// css
import classes from './SortBy.module.css';

const SortBy = props => {
  const options = [
    {
      key: 'publishedDate',
      text: 'Date Published',
      value: 'publishedDate',
      content: 'Date Published',
      onClick: function() {
        props.sortMethodHandler('publishedDate');
      }
    },
    {
      key: 'rating',
      text: 'Rating',
      value: 'rating',
      content: 'Rating',
      onClick: function() {
        props.sortMethodHandler('rating');
      }
    },
    {
      key: 'pageCount',
      text: 'Page Count',
      value: 'pageCount',
      content: 'Page Count',
      onClick: function() {
        props.sortMethodHandler('pageCount');
      }
    }
  ];
  return (
    <div className={classes.wrapper}>
      <div className={classes.sortMethod}>
        <Dropdown
          options={options}
          placeholder="Sort by..."
          selection
          value={props.sort.sortMethod}
        />
      </div>
      <div className={classes.sortOrder} onClick={props.toggleSortOrderHandler}>
        <i className="exchange icon" />
      </div>
    </div>
  );
};

SortBy.propTypes = {
  sort: PropTypes.object.isRequired,
  sortMethodHandler: PropTypes.func.isRequired,
  toggleSortOrderHandler: PropTypes.func.isRequired
};

export default SortBy;
