import React from 'react';

import PropTypes from 'prop-types';

const SocialInputField = ({ name, placeholder, value, error, icon, type, onChange }) => {
  return (
    <div className="field">
      <div className="ui left icon input">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {icon && <i className={['icon', icon].join(' ')} />}
        {error && <div className="ui left pointing basic label">{error}</div>}
      </div>
    </div>
  );
};

SocialInputField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

SocialInputField.defaultProps = {
  type: 'text'
};

export default SocialInputField;
