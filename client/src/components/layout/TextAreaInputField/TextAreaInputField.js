import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextAreaInputField = ({
  name,
  rows,
  placeholder,
  value,
  minHeight,
  maxLength,
  onChange,
  info,
  error,
  label
}) => {
  return (
    <div className={classnames('field', { error: error })}>
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        rows={rows}
        id={name}
        style={{ minHeight }}
        name={name}
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

TextAreaInputField.propTypes = {
  name: PropTypes.string.isRequired,
  minHeight: PropTypes.string,
  rows: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  maxLength: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  label: PropTypes.string,
  info: PropTypes.string
};

export default TextAreaInputField;
