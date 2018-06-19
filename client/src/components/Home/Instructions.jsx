import React from 'react';

export default () => (
  <div className="instructions">
    <div className="text-headline"><b>Instructions of use</b></div>
    <ol>
      <li>Start by entering your personal details like your first name, last name, phone and email.</li>
      <li>Enter a address in the US for which you would like to know the Rent Zestimate.</li>
      <li>If a rent zestimate is available for that address it will be show otherwise you will be informed with a error.</li>
      <li>Once the rent zestimate is available for an address you will be asked to give your expected rent.</li>
      <li>Once all steps are completed you will get an email on your registered email address with the details of your registration.</li>
    </ol>
  </div>
);
