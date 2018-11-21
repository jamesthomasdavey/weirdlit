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
  componentWillReceiveProps = props => {
    if (props.changeRatingHandler) {
      const value = props.value;
      this.setState({ value }, () => {});
    }
  };
  changeRatingHandler = value => {
    this.setState({ value }, () => {
      this.props.changeRatingHandler(this.state.value);
    });
  };
  render() {
    let styles;
    if (this.props.center) {
      styles = { textAlign: 'center' };
    }

    if (this.props.changeRatingHandler) {
      return (
        <Fragment>
          <div className={[classes.wrapper, classes.wrapper__edit].join(' ')} style={styles}>
            <ReactStars
              count={4}
              value={this.state.value}
              color="#666"
              color2="orange"
              onChange={this.changeRatingHandler}
              size={28}
            />
          </div>
        </Fragment>
      );
    } else if (!this.props.noRating) {
      return (
        <Fragment>
          <div className={classes.wrapper} style={styles}>
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
      return <Fragment />;
    }
  }
}

StarRating.propTypes = {
  noRating: PropTypes.bool,
  center: PropTypes.bool,
  value: PropTypes.number,
  changeRatingHandler: PropTypes.func
};

StarRating.defaultProps = {
  noRating: false,
  value: 0
};

export default StarRating;
