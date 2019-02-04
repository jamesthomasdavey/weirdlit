// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import imageCheck from 'image-check';

// component
import Spinner from './../../../../layout/Spinner/Spinner';
import Tags from './Tags/Tags';

class ResultPage extends Component {
  state = {
    tags: [],
    googleImage: {
      status: false,
      googleImageUrl: '',
      loading: true
    },
    userImage: {
      status: false,
      userImageUrl: '',
      loading: false,
      error: ''
    },
    submissionImageUrl: ''
  };
  componentDidMount = () => {
    axios.get(`/api/books/add/${this.props.googleId}`).then(res => {
      const googleImageUrl = res.data.googleImageUrl;
      imageCheck(googleImageUrl)
        .then(() => {
          this.setState({
            googleImage: { status: true, googleImageUrl, loading: false }
          });
        })
        .catch(() => {
          this.setState({ googleImage: { status: false, googleImageUrl: '', loading: false } });
        });
    });
  };
  toggleSelectTagHandler = tagId => {
    let currentState = this.state;
    if (currentState.tags.includes(tagId)) {
      const deleteIndex = currentState.tags.indexOf(tagId);
      currentState.tags.splice(deleteIndex, 1);
    } else {
      currentState.tags.push(tagId);
    }
    currentState.tags = currentState.tags.sort();
    this.setState(currentState);
  };
  validateUserImageUrlHandler = e => {
    const userImageUrl = e.target.value;
    if (userImageUrl.length > 500) {
      this.setState({
        userImage: {
          status: false,
          userImageUrl: '',
          loading: false,
          error: 'Please use a shorter image URL'
        }
      });
    } else if (userImageUrl) {
      this.setState({ userImage: { loading: true } }, () => {
        imageCheck(userImageUrl)
          .then(() => {
            this.setState({
              userImage: { status: true, userImageUrl, loading: false, error: '' }
            });
          })
          .catch(() => {
            this.setState({
              userImage: {
                status: false,
                userImageUrl: '',
                loading: false,
                error: 'Invalid image URL'
              }
            });
          });
      });
    } else {
      this.setState({ userImage: { status: false, userImageUrl: '', loading: false, error: '' } });
    }
  };
  selectGoogleImageHandler = () => {
    const googleImageUrl = this.state.googleImage.googleImageUrl;
    this.setState({ submissionImageUrl: googleImageUrl }, this.submitHandler);
  };
  selectUserImageHandler = () => {
    const userImageUrl = this.state.userImage.userImageUrl;
    this.setState({ submissionImageUrl: userImageUrl }, this.submitHandler);
  };
  submitHandler = () => {
    this.props.submitHandler(this.state.submissionImageUrl, this.state.tags);
  };
  render() {
    document.title = 'Edit | WeirdLit';
    return (
      <div className="ui text container">
        <div className="ui segment">
          <form className="ui form">
            <div className="ui field">
              <label>Tags</label>
              <div className="ui segment">
                <Tags
                  selectedTags={this.state.tags}
                  toggleSelectTagHandler={this.toggleSelectTagHandler}
                />
              </div>
            </div>
            <div className="ui field">
              <label htmlFor="alternateImageUrl">* Cover Image</label>
              <div className="ui center aligned segment">
                {this.state.googleImage.loading && <Spinner />}
                {this.state.googleImage.status && (
                  <Fragment>
                    <div className="ui small image">
                      <img alt="cover" src={this.state.googleImage.googleImageUrl} />
                    </div>
                    <br />
                    <button
                      className="ui teal button"
                      style={{ marginTop: '1rem' }}
                      onClick={this.selectGoogleImageHandler}
                    >
                      Use Included Cover
                    </button>
                    <div className="ui horizontal divider">Or</div>
                  </Fragment>
                )}
                <div className="ui small image">
                  {this.state.userImage.status && (
                    <img alt="cover" src={this.state.userImage.userImageUrl} />
                  )}
                </div>
                <div className="ui form" style={{ marginTop: '1rem' }}>
                  <div className={['field', this.state.userImage.error ? 'error' : ''].join(' ')}>
                    <input
                      id="alternateImageUrl"
                      name="alternateImageUrl"
                      autoFocus
                      type="text"
                      placeholder="Paste an image URL here."
                      onChange={this.validateUserImageUrlHandler}
                    />
                    {this.state.userImage.error && (
                      <div className="ui pointing basic label">{this.state.userImage.error}</div>
                    )}
                  </div>
                  <button
                    className={[
                      'ui teal labeled icon button',
                      this.state.userImage.status ? '' : 'disabled'
                    ].join(' ')}
                    onClick={this.selectUserImageHandler}
                  >
                    {this.state.googleImage.status ? 'Use a Different Cover' : 'Add a Cover'}
                    <i className="upload icon" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <button onClick={this.props.setSearchPageHandler} className="ui button grey">
          Back to Results
        </button>
      </div>
    );
  }
}

ResultPage.propTypes = {
  setSearchPageHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  googleId: PropTypes.string.isRequired
};

export default ResultPage;
