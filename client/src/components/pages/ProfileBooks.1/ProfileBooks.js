// package
import React, { Component } from 'react';
import axios from 'axios';

// component
import BookCard from './../../layout/BookCard/BookCard';

// css
import classes from './ProfileBooks.module.css';

class ProfileBooks extends Component {
  state = {
    numberOfBooksToShow: 12,
    booksRead: [],
    name: '',
    isLoading: true
  };
  componentDidMount = () => {
    this.updateFromProfile(this.props.match.params.userId);
  };
  showMoreBooksHandler = () => {
    const currentState = this.state;
    currentState.numberOfBooksToShow += 12;
    this.setState(currentState);
  };
  updateFromProfile = userId => {
    axios.get(`/api/profile/user/${userId}`).then(res => {
      this.setState({ booksRead: res.data.booksRead, name: res.data.user.name, isLoading: false });
    });
  };
  render() {
    document.title = this.state.isLoading
      ? 'Books Read | WeirdLit'
      : `Books Read by ${this.state.name.split(' ')[0]} | WeirdLit`;

    let bookCards;
    let showMoreBooksButton;

    if (!this.state.isLoading) {
      bookCards = [...this.state.booksRead].reverse().map((book, index) => {
        if (index < this.state.numberOfBooksToShow) {
          return <BookCard key={book._id} book={book} showRating showAuthors showPublishedDate />;
        } else {
          return null;
        }
      });
    }

    if (this.state.numberOfBooksToShow < this.state.booksRead.length) {
      showMoreBooksButton = (
        <div className={classes.showMoreWrapper} onClick={this.showMoreBooksHandler}>
          <button className="ui tiny button">Show More</button>
        </div>
      );
    }

    return (
      <div className="ui container">
        <div className="ui segment">
          <div className={classes.booksWrapper}>{bookCards}</div>
          {showMoreBooksButton}
        </div>
      </div>
    );
  }
}

export default ProfileBooks;
