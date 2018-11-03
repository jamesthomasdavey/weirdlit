import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextInputField = ({
  name,
  type,
  autoFocus,
  maxLength,
  placeholder,
  value,
  onChange,
  info,
  error,
  label
}) => {
  return (
    <div className={classnames('field', { error: error })}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      />
      {info && <small>{info}</small>}
      {error && <div className="ui pointing basic label">{error}</div>}
    </div>
  );
};

TextInputField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  maxLength: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
  info: PropTypes.string
};

TextInputField.defaultProps = {
  type: 'text'
};

export default TextInputField;
