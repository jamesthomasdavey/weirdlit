// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import SmoothCollapse from 'react-smooth-collapse';

// component
import Tags from './components/Tags/Tags';
import SortBy from './components/SortBy/SortBy';

// css
import classes from './FilterSortBar.module.css';

class FilterSortBar extends Component {
  state = {
    isExpanded: false
  };

  toggleExpandHandler = () => {
    const currentState = this.state;
    currentState.isExpanded = !this.state.isExpanded;
    this.setState(currentState);
  };

  render() {
    let selectedTagsContent;

    if (this.state.isExpanded) {
      selectedTagsContent = (
        <Fragment>
          <h4 className={classes.toggleIcon} onClick={this.toggleExpandHandler}>
            <i className="chevron up icon" />
          </h4>
        </Fragment>
      );
    } else {
      let selectedTags;
      selectedTags = this.props.tags
        .reduce((acc, current) => {
          return current.isSelected ? [...acc, current] : acc;
        }, [])
        .map(tag => {
          return (
            <span
              key={tag._id + '_activeFilterTag'}
              className={['ui label', classes.tag].join(' ')}
            >
              {tag.name}{' '}
              <i
                className="delete icon"
                onClick={() => this.props.toggleSelectedHandler(tag.name)}
              />
            </span>
          );
        });
      if (selectedTags.length > 0) {
        selectedTagsContent = (
          <Fragment>
            {selectedTags}{' '}
            <h4
              className={classes.toggleIcon}
              style={{ color: 'grey' }}
              onClick={this.toggleExpandHandler}
            >
              <i className="plus icon" />
            </h4>
          </Fragment>
        );
      } else {
        selectedTagsContent = (
          <span
            className={['ui basic label', classes.tag, classes.tagButton].join(' ')}
            onClick={this.toggleExpandHandler}
          >
            <i className="plus icon" />
            No tags selected
          </span>
        );
      }
    }

    return (
      <div className={classes.wrapper}>
        <SmoothCollapse expanded={this.state.isExpanded}>
          <div className={classes.topWrapper}>
            <div className="ui text container">
              <Tags
                tags={this.props.tags}
                toggleSelectedHandler={this.props.toggleSelectedHandler}
              />
            </div>
          </div>
        </SmoothCollapse>
        <div className={classes.bottomWrapper}>
          <div className="ui container">
            <div className={['ui two column stackable grid', classes.tableRow].join(' ')}>
              <div className={['eleven wide column', classes.tableCell].join(' ')}>
                <div className={classes.selectedTagsWrapper}>{selectedTagsContent}</div>
              </div>
              <div
                className={['five wide column', classes.tableCell, classes.sortByWrapper].join(' ')}
              >
                <SortBy
                  toggleSortOrderHandler={this.props.toggleSortOrderHandler}
                  sortMethodHandler={this.props.sortMethodHandler}
                  sort={this.props.sort}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FilterSortBar.propTypes = {
  tags: PropTypes.array.isRequired,
  toggleSelectedHandler: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  sortMethodHandler: PropTypes.func.isRequired
};

export default FilterSortBar;
