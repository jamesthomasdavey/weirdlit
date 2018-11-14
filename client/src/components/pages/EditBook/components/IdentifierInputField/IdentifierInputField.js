import React from 'react';

import PropTypes from 'prop-types';

const IdentifierInputField = ({ name, label, placeholder, error, value, type, onChange }) => {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <div className="ui input">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {error && <div className="ui left pointing basic label">{error}</div>}
      </div>
    </div>
  );
};

IdentifierInputField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

IdentifierInputField.defaultProps = {
  type: 'text'
};

export default IdentifierInputField;
