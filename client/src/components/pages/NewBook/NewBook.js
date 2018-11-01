// import packages
import React, { Component, Fragment } from 'react';
import axios from 'axios';
import imageCheck from 'image-check';

// import components
import Navbar from '../../layout/Navbar/Navbar';
import Spinner from '../../layout/Spinner/Spinner';

class NewBook extends Component {
  state = {
    search: '',
    results: [],
    loading: false,
    selectedBook: {
      status: false,
      loading: false,
      googleId: '',
      googleImageUrl: ''
    },
    submissionImageUrl: '',
    alternateImageUrl: '',
    submitting: false,
    submitted: false,
    googleImageLoading: false,
    errors: {}
  };
  changeInputHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  getResults = () => {
    if (this.state.search === '') {
      this.setState({ search: '', results: [] });
    } else {
      this.setState({ loading: true }, () => {
        axios
          .post('/api/books/add/search', { searchTerm: this.state.search })
          .then(res => {
            this.setState({ results: res.data, loading: false });
          })
          .catch(() => {
            this.setState({ results: [], loading: false });
          });
      });
    }
  };
  formSubmitHandler = e => {
    e.preventDefault();
    this.getResults();
  };
  addBookHandler = googleId => {
    this.setState({ selectedBook: { status: true, loading: true, googleId } });
    axios
      .get(`/api/books/add/${googleId}`)
      .then(res => {
        this.setState(
          {
            selectedBook: {
              status: true,
              loading: false,
              googleId: res.data.googleId
            }
          },
          () => {
            this.validateGoogleImageHandler(res.data.googleImageUrl);
          }
        );
      })
      .catch(err => {
        this.setState({
          errors: { alreadySumitted: 'This book has already been added or requested' }
        });
      });
  };

  backHandler = () => {
    this.setState({
      selectedBook: { status: false, loading: false },
      alternateImageUrl: '',
      errors: {}
    });
  };

  validateGoogleImageHandler = googleImageUrl => {
    this.setState({ googleImageLoading: true }, () => {
      imageCheck(googleImageUrl)
        .then(() => {
          const prevSelectedBook = this.state.selectedBook;
          prevSelectedBook.googleImageUrl = googleImageUrl;
          this.setState({ selectedBook: prevSelectedBook, googleImageLoading: false });
        })
        .catch(() => {
          this.setState({ googleImageLoading: false });
        });
    });
  };

  validateImageHandler = e => {
    const val = e.target.value;
    imageCheck(val)
      .then(() => {
        this.setState({ alternateImageUrl: val });
      })
      .catch(() => {
        return;
      });
  };

  googleImageUrlSubmitHandler = () => {
    const googleImageUrl = this.state.selectedBook.googleImageUrl;
    this.setState({ submissionImageUrl: googleImageUrl }, this.submitHandler);
  };

  alternateImageUrlSubmitHandler = () => {
    const alternateImageUrl = this.state.alternateImageUrl;
    this.setState({ submissionImageUrl: alternateImageUrl }, this.submitHandler);
  };

  submitHandler = () => {
    this.setState({ submitting: true }, () => {
      axios
        .post('/api/books', {
          imageUrl: this.state.submissionImageUrl,
          googleId: this.state.selectedBook.googleId
        })
        .then(() => {
          this.setState({ submitting: false, submitted: true });
        })
        .catch(err => {
          this.setState({ errors: err });
        });
    });
  };

  render() {
    document.title = 'Add a Book | WeirdLit';

    const { submitted, submitting, results, loading, selectedBook } = this.state;

    let pageContent;
    let bookResult;
    let searchResults;
    let searchPage;

    if (this.state.errors.alreadySumitted) {
      pageContent = (
        <div className="ui center aligned container">
          <div>{this.state.errors.alreadySumitted}</div>
          <button onClick={this.backHandler} className="ui button">
            Back to Results
          </button>
        </div>
      );
    } else if (submitted) {
      pageContent = <h1>SUCCESS!!!!</h1>;
    } else if (submitting) {
      pageContent = (
        <div className="ui center aligned container">
          <Spinner />
          <span>Submitting...</span>
        </div>
      );
    } else if (selectedBook.status) {
      if (selectedBook.loading) {
        bookResult = <Spinner />;
      } else {
        bookResult = (
          <Fragment>
            <div className="ui center aligned basic segment">
              {this.state.googleImageLoading && <Spinner />}
              {selectedBook.googleImageUrl && (
                <Fragment>
                  <div className="ui small image">
                    <img alt="cover" src={selectedBook.googleImageUrl} />
                  </div>
                  <br />
                  <button
                    className="ui teal button"
                    style={{ marginTop: '1rem' }}
                    onClick={this.googleImageUrlSubmitHandler}
                  >
                    Use Included Image
                  </button>
                  <div className="ui horizontal divider">Or</div>
                </Fragment>
              )}
              <div className="ui small image">
                {this.state.alternateImageUrl && (
                  <img alt="cover" src={this.state.alternateImageUrl} />
                )}
              </div>
              <div className="ui form" style={{ marginTop: '1rem' }}>
                <div className="field">
                  <input
                    id="alternateImageUrl"
                    name="alternateImageUrl"
                    type="text"
                    placeholder="Paste a proper image URL here."
                    onChange={this.validateImageHandler}
                  />
                </div>
                <button
                  className={[
                    'ui teal labeled icon button',
                    this.state.alternateImageUrl ? '' : 'disabled'
                  ].join(' ')}
                  onClick={this.alternateImageUrlSubmitHandler}
                >
                  {selectedBook.googleImageUrl ? 'Use Different Image' : 'Add a Cover'}
                  <i className="upload icon" />
                </button>
              </div>
            </div>
            <button onClick={this.backHandler} className="ui button">
              Back to Results
            </button>
          </Fragment>
        );
      }
      pageContent = bookResult;
    } else {
      if (results.length > 0) {
        searchResults = results.map(book => {
          return (
            <div className="item book__item" key={book.googleId}>
              <div className="ui small image">
                <img alt="cover" src={book.thumb} />
              </div>
              <div className="content">
                <div className="header">{book.title}</div>
                {book.subtitle && <div className="meta">{book.subtitle}</div>}
                <div className="meta">{book.publishedDate}</div>
                {book.authors && (
                  <div className="meta">
                    {book.authors.length > 1
                      ? book.authors.reduce((acc, current) => acc + ', ' + current)
                      : book.authors[0]}
                  </div>
                )}
                <button
                  className={[
                    'ui teal labeled icon button',
                    book.alreadySubmitted ? 'disabled' : ''
                  ].join(' ')}
                  onClick={() => this.addBookHandler(book.googleId)}
                >
                  Add This Book
                  <i className="add icon" />
                </button>
              </div>
            </div>
          );
        });
      }
      searchPage = (
        <Fragment>
          <form onSubmit={this.formSubmitHandler} className="ui form">
            <div className={['ui icon input container fluid', loading ? 'loading' : ''].join(' ')}>
              <input
                id="search"
                type="text"
                onChange={this.changeInputHandler}
                name="search"
                value={this.state.search}
                placeholder="Search for a book to add..."
              />
              <i className="search__icon search icon" />
            </div>
          </form>
          <div className="ui divided items">{searchResults}</div>
        </Fragment>
      );
      pageContent = searchPage;
    }

    return (
      <div>
        <Navbar />
        <div className="ui container">
          <div className="ui text container">{pageContent}</div>
        </div>
      </div>
    );
  }
}

export default NewBook;
