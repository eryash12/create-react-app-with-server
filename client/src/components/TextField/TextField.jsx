import React from 'react';
import './TextField.css';
import { Field } from 'redux-form';

export default ({ img, reduxForm = true, customInput, className = "", ...props }) => (
  <div className={`text-field-div ${className}`}>
    {img && <div className={"text-field-img"}>{img}</div>}
    <div className="text-field-input">
      {reduxForm ? <Field component={customInput ? customInput : "input"} {...props} /> : <input {...props} />}
    </div>
  </div>
);
