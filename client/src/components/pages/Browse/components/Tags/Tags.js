// package
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// component
import Spinner from './../../../../layout/Spinner/Spinner';

// css
import classes from './Tags.module.css';

class Tags extends Component {
  state = {
    allTags: [],
    isLoading: true
  };
  componentWillMount = () => {
    axios.get('/api/tags').then(res => {
      this.setState({
        allTags: res.data.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)),
        isLoading: false
      });
    });
  };
  render() {
    let tags;
    if (this.state.isLoading) {
      tags = <Spinner />;
    } else {
      tags = this.state.allTags.map(tag => {
        return (
          <Link
            to={`/books/filter/${tag.name}/sort/publishedDate/desc`}
            key={tag._id + '_browseKey'}
            className={['ui label', classes.tag].join(' ')}
          >
            {tag.name}
          </Link>
        );
      });
    }
    return (
      <div className={classes.wrapper}>
        <h4 className="ui dividing center aligned header">Browse by Tag</h4>
        <div className={classes.tags}>{tags}</div>
      </div>
    );
  }
}

export default Tags;
