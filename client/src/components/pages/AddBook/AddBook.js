// package
import React, { Component, Fragment } from 'react';

// component
import SearchPage from './Components/SearchPage/SearchPage';
import ResultPage from './Components/ResultPage/ResultPage';
import SubmitPage from './Components/SubmitPage/SubmitPage';

class NewBook extends Component {
  state = {
    searchPage: {
      status: true,
      initialSearch: ''
    },
    resultPage: {
      status: false,
      googleId: ''
    },
    submitPage: {
      status: false,
      imageUrl: ''
    }
  };
  selectBookHandler = (googleId, searchQuery) => {
    const currentState = this.state;
    currentState.searchPage = { status: false, initialSearch: searchQuery };
    currentState.resultPage = { status: true, googleId };
    currentState.submitPage = { status: false, imageUrl: '' };
    this.setState(currentState);
  };
  setSearchPageHandler = () => {
    const currentState = this.state;
    currentState.searchPage.status = true;
    currentState.resultPage = { status: false, googleId: '' };
    currentState.submitPage = { status: false, imageUrl: '' };
    this.setState(currentState);
  };
  submitImageHandler = imageUrl => {
    const currentState = this.state;
    currentState.searchPage.status = false;
    currentState.resultPage.status = false;
    currentState.submitPage = { status: true, imageUrl };
    this.setState(currentState);
  };
  render() {
    return (
      <Fragment>
        {this.state.searchPage.status && (
          <SearchPage
            selectBookHandler={this.selectBookHandler}
            initialSearch={this.state.searchPage.initialSearch}
          />
        )}
        {this.state.resultPage.status && (
          <ResultPage
            setSearchPageHandler={this.setSearchPageHandler}
            submitImageHandler={this.submitImageHandler}
            googleId={this.state.resultPage.googleId}
          />
        )}
        {this.state.submitPage.status && (
          <SubmitPage
            googleId={this.state.resultPage.googleId}
            imageUrl={this.state.submitPage.imageUrl}
            setSearchPageHandler={this.setSearchPageHandler}
          />
        )}
      </Fragment>
    );
  }
}

export default NewBook;
