// package
import React from 'react';
import { Link } from 'react-router-dom';

const SuccessCard = () => {
  return (
    <div>
      <div className="ui icon positive message">
        <i className="check circle outline icon" />
        <div className="content">
          <div className="header">Success.</div>
          <p>This book has successfully been requested.</p>
        </div>
      </div>
      <Link to="/books/add" className="ui button">
        Add Another
      </Link>
      <Link to="/browse" className="ui button" style={{ marginLeft: '1rem' }}>
        Back to Browse
      </Link>
    </div>
  );
};

export default SuccessCard;
