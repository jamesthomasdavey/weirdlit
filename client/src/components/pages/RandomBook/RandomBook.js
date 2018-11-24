// package
import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

// component
import Spinner from './../../layout/Spinner/Spinner';

class RandomBook extends Component {
  state = {
    bookId: '',
    isLoading: true
  };
  componentDidMount = () => {
    axios.get('/api/books/random').then(res => {
      this.setState({ bookId: res.data.bookId, isLoading: false });
    });
  };
  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    } else {
      return <Redirect to={`/books/${this.state.bookId}`} />;
    }
  }
}

export default RandomBook;
