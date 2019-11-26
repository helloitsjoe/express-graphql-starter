import React from 'react';

const AddPlace = ({}) => {
  const [value, setValue] = React.useState('');

  const handleChange = e => setValue(e.target.value);
  const handleSubmit = e => {
    e.preventDefault();
    console.log('submit', value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Add a new place" value={value} onChange={handleChange} />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddPlace;
