import React from 'react';
import './TextField.css';

export default ({ img, ...props }) => (
  <div className="text-field-div">
    {img && <div>{img}</div>}
    <div className="text-field-input">
      <input {...props} />
    </div>
  </div>
);
