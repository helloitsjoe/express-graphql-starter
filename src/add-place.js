import React from 'react';
import PropTypes from 'prop-types';

const AddPlace = ({ error, places, value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <input placeholder="Add a new place" value={value} onChange={onChange} />
      <button disabled={!value || places.includes(value)} type="submit">
        Add Place
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

AddPlace.propTypes = {
  places: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

AddPlace.defaultProps = {
  places: [],
  value: '',
  error: '',
  onChange() {},
  onSubmit() {},
};

export default AddPlace;
