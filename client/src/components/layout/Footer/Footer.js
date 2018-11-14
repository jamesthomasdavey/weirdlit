// package
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Footer = props => {
  return (
    <div
      className="ui vertical footer segment"
      style={{ paddingTop: '2rem', paddingBottom: '2rem' }}
    >
      <div className="ui center aligned container">
        <div className="ui horizontal small divided link list">
          {props.auth.isAuthenticated && (
            <Link to="/books/add" className="item">
              Request
            </Link>
          )}
          <Link to="/about" className="item">
            About
          </Link>
          <span className="item">&copy; {new Date().getFullYear()} WeirdLit</span>
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Footer);
