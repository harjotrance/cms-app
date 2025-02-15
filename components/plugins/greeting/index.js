import React from 'react';

const GreetingBlock = ({ name }) => {
  return (
    <div>
      <h3>Greeting Block</h3>
      <p>Hello, {name || "Guest"}!</p>
    </div>
  );
};

export default GreetingBlock;