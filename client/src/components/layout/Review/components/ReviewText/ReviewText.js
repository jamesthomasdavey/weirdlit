// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// css
import classes from './ReviewText.module.css';

class ReviewText extends Component {
  state = {
    isShortText: false,
    showFull: false
  };
  componentDidMount = () => {
    if (this.props.text > this.props.maxChars) {
      this.setState({ isShortText: false });
    } else {
      this.setState({ isShortText: true });
    }
  };
  toggleShowFullHandler = () => {
    this.setState({ showFull: !this.state.showFull });
  };
  render() {
    if (this.state.isShortText) {
      return (
        <p>
          {this.props.text.split('\n').map((item, key) => {
            return (
              <span key={key}>
                {item}
                <br />
              </span>
            );
          })}
        </p>
      );
    } else {
      let text;
      let showFullButton;
      if (this.state.showFull) {
        text = (
          <p>
            {this.props.text.split('\n').map((item, key) => {
              return (
                <span key={key}>
                  {item}
                  <br />
                </span>
              );
            })}
          </p>
        );
      } else {
        const shortenedTextArray = this.props.text.substring(0, this.props.maxChars).split(' ');
        const shortenedText =
          shortenedTextArray.splice(0, shortenedTextArray.length - 1).join(' ') + '...';
        text = (
          <p>
            {shortenedText.split('\n').map((item, key) => {
              return (
                <span key={key}>
                  {item}
                  <br />
                </span>
              );
            })}
          </p>
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
          {text}
          {showFullButton}
        </Fragment>
      );
    }
  }
}

ReviewText.propTypes = {
  showAll: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  maxChars: PropTypes.number.isRequired
};

ReviewText.defaultProps = {
  showAll: false,
  maxChars: 600
};

export default ReviewText;
