// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

// css
import classes from './DescriptionText.module.css';

class DescriptionText extends Component {
  state = {
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
  toggleShowFullHandler = () => {
    this.setState({ showFull: !this.state.showFull });
  };
  render() {
    if (this.state.isShortDescription) {
      return <div className={classes.description__text}>{renderHTML(this.props.description)}</div>;
    } else {
      let description;
      let showFullButton;
      if (this.state.showFull) {
        description = (
          <div className={classes.description__text}>{renderHTML(this.props.description)}</div>
        );
      } else {
        const shortenedDescriptionArray = this.props.description.substring(0, 500).split(' ');
        const shortenedDescription =
          shortenedDescriptionArray.splice(0, shortenedDescriptionArray.length - 1).join(' ') +
          '...';
        description = (
          <div className={classes.description__text}>{renderHTML(shortenedDescription)}</div>
        );
      }
      showFullButton = (
        <div className={classes.show__wrapper} onClick={this.toggleShowFullHandler}>
          <span className={classes['show-full__button']}>
            {!this.state.showFull ? 'Show more' : 'Show less'}
          </span>
        </div>
      );
      return (
        <Fragment>
          {description}
          {showFullButton}
        </Fragment>
      );
    }
  }
}

DescriptionText.propTypes = {
  description: PropTypes.string.isRequired
};

export default DescriptionText;
