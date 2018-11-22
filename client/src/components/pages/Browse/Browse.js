// package
import React, { Component } from 'react';

// component
import FeaturedBook from './components/FeaturedBook/FeaturedBook';
import Tags from './components/Tags/Tags';
import RecentlyPublished from './components/RecentlyPublished/RecentlyPublished';

// css
import classes from './Browse.module.css';

class Browse extends Component {
  render() {
    document.title = 'Browse | WeirdLit';
    return (
      <div className="ui container">
        <div className="ui segment">
          <div className="ui two column stackable grid">
            <div className="eleven wide column">
              <div className={['ui raised segment', classes.featuredSegment].join(' ')}>
                <FeaturedBook />
              </div>
            </div>
            <div className="five wide column">
              <div className="ui raised segment">
                <Tags />
              </div>
            </div>
          </div>

          <RecentlyPublished />
        </div>
      </div>
    );
  }
}

export default Browse;
