// package
import React, { Component } from 'react'
import PropTypes from 'prop-types';

// component
import BookObj from './../../../../../layout/BookObj/BookObj'

class LatestBook extends Component {
  state = {
    book: {},
    isLoading: true
  }
  componentDidMount = () => {

  }
  render() {
    return (
      <div>
        
      </div>
    )
  }
}

LatestBook.propTypes = {
  authorId: PropTypes.string.isRequired
}

export default LatestBook;