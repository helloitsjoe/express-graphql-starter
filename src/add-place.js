/* eslint-disable react/prop-types */
import React from 'react';

const AddPlace = ({ places, value, onChange, onSubmit }) => {
  const placeExists = places.some(({ name }) => name.match(new RegExp(`^${value}$`, 'i')));
  return (
    <form onSubmit={onSubmit}>
      <input placeholder="Add a new place" value={value} onChange={onChange} />
      <button disabled={!value || placeExists} type="submit">
        Add Place
      </button>
    </form>
  );
};

export default AddPlace;
