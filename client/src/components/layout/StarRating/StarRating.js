// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactStars from 'react-stars';
import ReactStarRatings from 'react-star-ratings';

// css
import classes from './StarRating.module.css';

class StarRating extends Component {
  state = {
    value: 0
  };
  componentDidMount = () => {
    if (!this.props.readOnly) {
      this.setState({ value: this.props.value });
    }
  };
  changeRatingHandler = value => {
    this.setState({ value });
  };
  render() {
    if (this.props.readOnly) {
      return (
        <Fragment>
          <div className={classes.wrapper}>
            <ReactStarRatings
              rating={this.props.value}
              numberOfStars={4}
              starRatedColor="orange"
              starEmptyColor="#666"
              starDimension="15px"
              starSpacing="0"
            />
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <div className={[classes.wrapper, classes.wrapper__edit].join(' ')}>
            <ReactStars count={4} value={this.state.value} color="#666" color2="orange" />
          </div>
        </Fragment>
      );
    }
  }
}

StarRating.propTypes = {
  readOnly: PropTypes.bool,
  value: PropTypes.number,
  changeRatingHandler: PropTypes.func
};

StarRating.defaultProps = {
  readOnly: true,
  value: 0
};

export default StarRating;
