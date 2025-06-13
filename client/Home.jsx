// create home page component
import React from 'react';
// only home jsx 
  
export const Home = ({username}) => {
  return (
    <div>
      <h2>
        Welcome <span style={{ color: 'blue' }}>{username}</span> to the Home Page
      </h2>
    </div>
  );
}
       