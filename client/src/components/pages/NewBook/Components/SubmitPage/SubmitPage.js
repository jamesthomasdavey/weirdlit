// package
import React, { Component, Fragment } from 'react';
import axios from 'axios';

class SubmitPage extends Component {
  state = {
    loading: true,
    success: false,
    errors: {}
  };
  componentDidMount = () => {
    const googleId = this.props.googleId;
    const imageUrl = this.props.imageUrl;
    axios
      .post('/api/books', { googleId, imageUrl })
      .then(() => {
        this.setState({ loading: false, success: true, errors: {} });
      })
      .catch(err => {
        this.setState({ loading: false, success: false, errors: err });
      });
  };
  render() {
    if (this.state.loading) {
      document.title = 'Submitting... | WeirdLit';
    } else if (this.state.sucess) {
      document.title = 'Success | WeirdLit';
    } else if (!this.state.loading && !this.state.success) {
      document.title = 'Error | WeirdLit';
    }

    return (
      <div className="ui container">
        <div className="ui text container">
          <div className="ui segment">
            <div
              className={[
                'ui icon message',
                this.state.success ? 'positive' : '',
                !this.state.loading && !this.state.success ? 'negative' : ''
              ].join(' ')}
            >
              {this.state.loading && <i className="spinner loading icon" />}
              {this.state.success && <i className="check circle outline icon" />}
              {!this.state.loading && !this.state.success && <i className="x icon" />}
              <div className="content">
                {this.state.loading && <div className="header">Submitting...</div>}
                {this.state.success && (
                  <Fragment>
                    <div className="header">Success.</div>
                    <p>This book has successfully been requested.</p>
                  </Fragment>
                )}
                {!this.state.loading &&
                  !this.state.success && (
                    <Fragment>
                      <div className="header">Something went wrong.</div>
                      <p>
                        We're sorry, we had an issue processing your request. Please try again
                        later.
                      </p>
                    </Fragment>
                  )}
              </div>
            </div>
            {!this.state.loading && (
              <button onClick={this.props.setSearchPageHandler} className="ui button">
                Back to Results
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default SubmitPage;
