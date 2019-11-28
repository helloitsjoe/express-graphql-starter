/* eslint-disable react/prop-types */
import React from 'react';

const AddPlace = ({ places, value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <input placeholder="Add a new place" value={value} onChange={onChange} />
      <button disabled={!value || places.includes(value)} type="submit">
        Add Place
      </button>
    </form>
  );
};

export default AddPlace;
