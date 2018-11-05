import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div
      className="ui vertical footer segment"
      style={{ paddingTop: '2rem', paddingBottom: '2rem' }}
    >
      <div className="ui center aligned container">
        <div className="ui horizontal small divided link list">
          <Link to="/books/new" className="item">
            Request Literature
          </Link>
          <Link to="/about" className="item">
            About
          </Link>
          <span className="item">&copy; {new Date().getFullYear()} WeirdLit</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
