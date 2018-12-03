// package
import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// component
import Tag from './Tag/Tag';
import Spinner from './../../../../../layout/Spinner/Spinner';

// css
import classes from './Tags.module.css';

class Tags extends Component {
  state = {
    allTags: [],
    allTagsLoaded: false
  };
  componentDidMount = () => {
    axios.get('/api/tags').then(res => {
      this.setState({
        allTags: res.data.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)),
        allTagsLoaded: true
      });
    });
  };
  render() {
    if (this.state.allTagsLoaded) {
      const tags = this.state.allTags.map(tag => {
        return (
          <Tag
            selected={this.props.selectedTags.includes(tag._id)}
            name={tag.name}
            id={tag._id}
            key={tag._id + '_customBookTag'}
            toggleSelectTagHandler={this.props.toggleSelectTagHandler}
          />
        );
      });
      return <div className={classes.tags}>{tags}</div>;
    } else {
      return <Spinner />;
    }
  }
}

Tags.propTypes = {
  selectedTags: PropTypes.array.isRequired,
  toggleSelectTagHandler: PropTypes.func.isRequired
};

export default Tags;
