// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import SmoothCollapse from 'react-smooth-collapse';

// css
import classes from './Description.module.css';

class Description extends Component {
  state = {
    show: false,
    showFull: false,
    height: ''
  };
  toggleShowHandler = () => {
    this.setState({ show: !this.state.show });
  };
  toggleShowFullHandler = () => {
    this.setState({ showFull: !this.state.showFull });
  };
  render() {
    let description;
    let maxCharsToDisplay = 500;

    if (this.state.showFull) {
      description = this.props.description;
    } else {
      const shortenedDescriptionArray = this.props.description
        .substring(0, maxCharsToDisplay)
        .split(' ');
      const shortenedDescription =
        shortenedDescriptionArray.splice(0, shortenedDescriptionArray.length - 1).join(' ') + '...';
      description = shortenedDescription;
    }

    let showFullButton = (
      <div className={classes.show__wrapper} onClick={this.toggleShowFullHandler}>
        <span className={classes['show-full__button']}>
          {!this.state.showFull ? 'Show more' : 'Show less'}
        </span>
      </div>
    );
    return (
      <div className={classes.wrapper}>
        <div className={classes.heading} onClick={this.toggleShowHandler}>
          <h3>
            Description{' '}
            <i
              className={[
                'angle down icon',
                classes.heading__icon,
                this.state.show ? classes.flip : ''
              ].join(' ')}
            />
          </h3>
        </div>
        <SmoothCollapse expanded={this.state.show}>
          <div className={['ui text container', classes.description__wrapper].join(' ')}>
            <p className={classes.description__text}>{renderHTML(description)}</p>
            {showFullButton}
          </div>
        </SmoothCollapse>
        <div className={classes.description__backdrop} />
      </div>
    );
  }
}

Description.propTypes = {
  description: PropTypes.string.isRequired
};

export default Description;
