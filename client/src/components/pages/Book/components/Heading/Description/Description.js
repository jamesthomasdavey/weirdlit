// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import SmoothCollapse from 'react-smooth-collapse';

// css
import classes from './Description.module.css';

class Description extends Component {
  state = {
    isExpanded: false,
    isShortDescription: false,
    showFull: false
  };
  componentDidMount = () => {
    if (this.props.description.length > 500) {
      this.setState({ isShortDescription: false });
    } else {
      this.setState({ isShortDescription: true });
    }
  };
  toggleExpandHandler = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };
  toggleShowFullHandler = () => {
    this.setState({ showFull: !this.state.showFull });
  };
  render() {
    let description;
    let shortenedDescription;

    if (!this.state.isShortDescription) {
      if (this.state.showFull) {
        description = this.props.description;
      } else {
        const shortenedDescriptionArray = this.props.description.substring(0, 500).split(' ');
        shortenedDescription =
          shortenedDescriptionArray.splice(0, shortenedDescriptionArray.length - 1).join(' ') +
          '...';
        description = shortenedDescription;
      }
    } else {
      description = this.props.description;
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
        <div className={classes.heading} onClick={this.toggleExpandHandler}>
          <h3>
            Description{' '}
            <i
              className={[
                'angle down icon',
                classes.heading__icon,
                this.state.isExpanded ? classes.flip : ''
              ].join(' ')}
            />
          </h3>
        </div>
        <SmoothCollapse expanded={this.state.isExpanded}>
          <div className={['ui text container', classes.description__wrapper].join(' ')}>
            <div className={classes.description__text}>{renderHTML(description)}</div>
            {!this.state.isShortDescription && showFullButton}
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
