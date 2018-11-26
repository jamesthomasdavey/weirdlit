// package
import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// component
import Heading from './components/Heading/Heading';
import About from './components/About/About'
import BooksWritten from './components/BooksWritten/BooksWritten';

// css
import classes from './Author.module.css';

class Author extends Component {
  state = {
    author: {},
    isLoading: true
  };
  componentDidMount = () => {
    if (this.props.match.params.authorId) {
      this.updateFromAuthor(this.props.match.params.authorId);
    } else {
      this.props.history.push('/404');
    }
  };
  updateFromAuthor = authorId => {
    axios.get(`/api/authors/${authorId}`).then(res => {
      this.setState({ author: res.data, isLoading: false });
    });
    // .catch(() => {
    //   this.props.history.push('/404');
    // });
  };
  render() {
    if (!this.state.isLoading) {
      document.title = `${this.state.author.name} | WeirdLit`;
    }

    const authorContent = (
      <div className={['ui segment', this.state.isLoading ? 'loading' : ''].join(' ')}>
        {this.state.isLoading && (
          <Fragment>
            <br />
            <br />
            <br />
            <br />
          </Fragment>
        )}
        {!this.state.isLoading && (
          <Fragment>
            <Heading name={this.state.author.name} id={this.state.author._id} isAdmin={this.props.auth.user.isAdmin} />
            {/* <About
              authorId={this.state.author._id}
              bio={this.state.author.bio}
              website={this.state.author.website}
            /> */}
            {/* <BooksWritten authorId={this.state.author._id} /> */}
            {/* <Reviews authorId={this.state.author._id} /> */}
          </Fragment>
        )}
      </div>
    );

    return <div className="ui container">{authorContent}</div>;
  }
}

Author.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Author);
