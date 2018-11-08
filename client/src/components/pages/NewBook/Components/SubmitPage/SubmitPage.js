// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class SubmitPage extends Component {
  state = {
    loading: true,
    success: false,
    errors: []
  };
  componentDidMount = () => {
    const googleId = this.props.googleId;
    const imageUrl = this.props.imageUrl;
    axios
      .post('/api/books', { googleId, imageUrl })
      .then(res => {
        if (res.data.errors && res.data.errors.length > 0) {
          this.setState({ loading: false, success: false, errors: res.data.errors });
        } else {
          this.setState({ loading: false, success: true, errors: [] });
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
          success: false,
          errors: ["We're sorry, we were unable to process your request. Please try again later."]
        });
      });
  };
  render() {
    if (this.state.loading) {
      document.title = 'Submitting... | WeirdLit';
    } else if (this.state.success) {
      document.title = 'Success | WeirdLit';
    } else if (!this.state.loading && !this.state.success) {
      document.title = 'Error | WeirdLit';
    }

    let errorsList;

    if (this.state.errors.length > 0) {
      const errorsListItems = this.state.errors.map(error => <li key="error">{error}</li>);
      errorsList = <ul className="list">{errorsListItems}</ul>;
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
                {!this.state.loading && !this.state.success && (
                  <Fragment>
                    <div className="header">Something went wrong.</div>
                    {errorsList}
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

SubmitPage.propTypes = {
  googleId: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  setSearchPageHandler: PropTypes.func.isRequired
};

export default SubmitPage;
