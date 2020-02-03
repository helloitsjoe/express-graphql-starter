import React from 'react';
import PropTypes from 'prop-types';

const AddPlanet = ({ error, planets, value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <input placeholder="Add a new planet" value={value} onChange={onChange} />
      <button disabled={!value || planets.includes(value)} type="submit">
        Add Planet
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

AddPlanet.propTypes = {
  planets: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

AddPlanet.defaultProps = {
  planets: [],
  value: '',
  error: '',
  onChange() {},
  onSubmit() {},
};

export default AddPlanet;
