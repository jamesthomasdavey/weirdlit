// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SmoothCollapse from 'react-smooth-collapse';

// component
import DescriptionText from './DescriptionText/DescriptionText';

// css
import classes from './Description.module.css';

class Description extends Component {
  state = {
    isExpanded: false
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
  render() {
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
            <DescriptionText description={this.props.description} />
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
