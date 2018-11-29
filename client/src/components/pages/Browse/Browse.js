// package
import React, { Component } from 'react';

// component
import FeaturedBook from './components/FeaturedBook/FeaturedBook';
import Tags from './components/Tags/Tags';
import Random from './components/Random/Random';
import RecentlyPublished from './components/RecentlyPublished/RecentlyPublished';
import RecentReviews from './components/RecentReviews/RecentReviews';

// css
import classes from './Browse.module.css';

class Browse extends Component {
  render() {
    document.title = 'Browse | WeirdLit';
    return (
      <div className="ui container">
        <div className="ui segment">
          <div className={['ui two column stackable grid', classes.tableRow].join(' ')}>
            <div className={['eleven wide column', classes.tableCell].join(' ')}>
              <div className={['ui raised segment', classes.featuredSegment].join(' ')}>
                <FeaturedBook />
              </div>
            </div>
            <div className={['five wide column', classes.tableCell].join(' ')}>
              <div className={['ui raised segment', classes.otherSegment].join(' ')}>
                <Tags />
                <Random />
              </div>
            </div>
          </div>
          <RecentlyPublished />
          <RecentReviews />
        </div>
      </div>
    );
  }
}

export default Browse;
