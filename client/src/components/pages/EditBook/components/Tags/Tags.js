// package
import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// component
import Tag from './Tag/Tag';

class Tags extends Component {
  state = {
    allTags: [],
    propsLoaded: false,
    allTagsLoaded: false
  };
  componentWillReceiveProps = () => {
    this.setState({ propsLoaded: true });
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
    if (this.state.propsLoaded && this.state.allTagsLoaded) {
      const tags = this.state.allTags.map(tag => {
        return (
          <Tag
            selected={this.props.selectedTags.includes(tag._id)}
            name={tag.name}
            id={tag._id}
            key={tag._id + '_editTagKey'}
            toggleSelectTagHandler={this.props.toggleSelectTagHandler}
          />
        );
      });
      return <div>{tags}</div>;
    } else {
      return <div />;
    }
  }
}

Tags.propTypes = {
  selectedTags: PropTypes.array.isRequired,
  toggleSelectTagHandler: PropTypes.func.isRequired
};

export default Tags;
