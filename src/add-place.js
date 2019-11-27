import React from 'react';

const AddPlace = ({ value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <input placeholder="Add a new place" value={value} onChange={onChange} />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddPlace;
