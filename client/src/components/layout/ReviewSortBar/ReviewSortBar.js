// package
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

// css
import classes from './ReviewSortBar.module.css';

const ReviewSortBar = props => {
  const options = [
    {
      key: 'writtenDate',
      text: 'Date Written',
      value: 'writtenDate',
      content: 'Date Written',
      onClick: function() {
        props.sortMethodHandler('writtenDate');
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
      key: 'wordCount',
      text: 'Word Count',
      value: 'wordCount',
      content: 'Word Count',
      onClick: function() {
        props.sortMethodHandler('wordCount');
      }
    }
  ];
  return (
    <div className={classes.wrapper}>
      <div className={classes.sortMethod}>
        <span style={{ fontSize: '12px' }}>
          <Dropdown
            options={options}
            placeholder="Sort by..."
            selection
            value={props.sort.sortMethod}
          />
        </span>
      </div>
      <div className={classes.sortOrder} onClick={props.toggleSortOrderHandler}>
        <i className="exchange icon" />
      </div>
    </div>
  );
};

ReviewSortBar.propTypes = {
  sort: PropTypes.object.isRequired,
  sortMethodHandler: PropTypes.func.isRequired,
  toggleSortOrderHandler: PropTypes.func.isRequired
};

export default ReviewSortBar;
