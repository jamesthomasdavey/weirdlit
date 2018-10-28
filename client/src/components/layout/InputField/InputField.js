import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const InputField = ({ name, type, placeholder, value, onChange, error, disabled, label }) => {
  return (
    <div className={classnames('field', { error: error })}>
      {label && <label htmlFor={name}>{label}</label>}
      <input id={name} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} />
      {error && <div className="ui pointing basic label">{error}</div>}
    </div>
  );
};

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.string,
  label: PropTypes.string
};

InputField.defaultProps = {
  type: 'text'
};

export default InputField;
