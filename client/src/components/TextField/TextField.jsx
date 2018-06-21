import React from 'react';
import './TextField.css';
import { Field } from 'redux-form';

export default ({ img, reduxForm = true, ...props }) => (
  <div className="text-field-div">
    {img && <div className={"text-field-img"}>{img}</div>}
    <div className="text-field-input">
      {reduxForm ? <Field component="input" {...props} /> : <input {...props} />}
    </div>
  </div>
);
