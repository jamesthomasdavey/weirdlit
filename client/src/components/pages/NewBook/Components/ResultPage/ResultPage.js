// package
import React, { Component, Fragment } from 'react';
import axios from 'axios';
import imageCheck from 'image-check';

// component
import Spinner from './../../../../layout/Spinner/Spinner';

class ResultPage extends Component {
  state = {
    googleImage: {
      status: false,
      googleImageUrl: '',
      loading: true
    },
    userImage: {
      status: false,
      userImageUrl: '',
      loading: false
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
  validateUserImageUrlHandler = e => {
    const userImageUrl = e.target.value;
    this.setState({ userImage: { loading: true } }, () => {
      imageCheck(userImageUrl)
        .then(() => {
          this.setState({
            userImage: { status: true, userImageUrl, loading: false }
          });
        })
        .catch(() => {
          this.setState({
            userImage: { status: false, userImageUrl: '', loading: false }
          });
        });
    });
  };
  selectGoogleImageHandler = () => {
    const googleImageUrl = this.state.googleImage.googleImageUrl;
    this.setState({ submissionImageUrl: googleImageUrl }, this.submitImageHandler);
  };
  selectUserImageHandler = () => {
    const userImageUrl = this.state.userImage.userImageUrl;
    this.setState({ submissionImageUrl: userImageUrl }, this.submitImageHandler);
  };
  submitImageHandler = () => {
    this.props.submitImageHandler(this.state.submissionImageUrl);
  };
  render() {
    document.title = 'Add a Cover | WeirdLit';
    return (
      <div className="ui container">
        <div className="ui text container">
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
              <div className="field">
                <input
                  id="alternateImageUrl"
                  name="alternateImageUrl"
                  autoFocus
                  type="text"
                  placeholder="Paste an image URL here."
                  onChange={this.validateUserImageUrlHandler}
                />
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
          <button onClick={this.props.setSearchPageHandler} className="ui button">
            Back to Results
          </button>
        </div>
      </div>
    );
  }
}

export default ResultPage;
