import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import TextField from '../TextField/TextField';
import { required, phone, email } from '../../utils/validations';
import AddressAutocomplete from '../AddressAutocomplete';
import numbro from 'numbro';
import phoneImg from './img/phone.png';
import emailImg from './img/email.png';
import firstnameImg from './img/firstname.png';
import passwordImg from './img/password.png';
import successImg from './img/success.svg';
import { createNumberMask, createTextMask } from 'redux-form-input-masks';
import AutosizeInput from 'react-input-autosize';

const currencyMask = createNumberMask({
  prefix: '$ ',
  locale: 'en-US',
  placeholder: '$5000'
})

const phoneMask = createTextMask({
  pattern: '(999) 999-9999',
});

const renderAutosize = ({ input, label, ...custom }) => (
  <AutosizeInput
    {...input}
    {...custom}
  />
);


export const calcRentZestimate = (zestimate) => {
  const calcRentZestimate = (0.05 * parseInt(zestimate, 10))/12;
  const lowerRange = 0.90 * calcRentZestimate;
  const upperRange = 1.1 * calcRentZestimate;
  return { upperRange, lowerRange };
};

export const formatCurrency = amt => numbro(parseInt(amt, 10)).formatCurrency({ mantissa: 2, thousandSeparated: true });


class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
    }
  }

  submitBtn = (props, text) => (
    <Button
      className="submit-btn"
      variant="contained"
      color="primary"
      {
        ...props
      }
    >
      {text}
    </Button>
  )

  imgWrap = (img) => (<img className="img-form" src={img}/>);

  renderPersonalDetails = () => {
    return(
      <div>
        <form className="fields">
          <div className="split">
            <TextField img={this.imgWrap(firstnameImg)} name="firstName" placeholder="First name" validate={[required]}/>
            <TextField name="lastName" placeholder="Last name" validate={[required]}/>
          </div>
          <TextField img={this.imgWrap(emailImg)} className="full" name="email" placeholder="Email" validate={[required, email]}/>
          <TextField img={this.imgWrap(passwordImg)} className="full" name="password" type="password" placeholder="Password" validate={[required, email]}/>
          <TextField img={this.imgWrap(phoneImg)} className="full" name="phone" type="tel" placeholder="Phone number" {...phoneMask}/>
        </form>
        <div className="terms-and-conditions">
          <div className="text">By signing up, I agree to Beepi’s <span className="highlight-color">Terms of Service</span> and <span className="highlight-color">Privacy Policy</span>.</div>
        </div>
      </div>
    )
  }

  renderAddress = () => {
    return (
      <div>
        <AddressAutocomplete onAddressSelect={this.props.onAddressSelect} />
      </div>
    );
  };

  renderRent = () => {
    const { user: {address: {rentZestimate, zestimate}} } = this.props;
    let displayZest = formatCurrency(rentZestimate) || `${calcRentZestimate(zestimate).lowerRange} - ${calcRentZestimate(zestimate).upperRange}`;
    console.log(displayZest, Number.isNaN(displayZest), !displayZest);
    if (displayZest === '$NaN' || !displayZest) {
      displayZest = "???"
    }
    return (
      <div className="expected-rent">
        <img className="er-image" src={successImg} />
        <div className="er-headline">Found your place!</div>
        <div className="er-desc">Here’s the estimate rate you’ll get for your property monthy guaranteed</div>
        <div className="er-currency">{displayZest}</div>
        <div className="er-text2">Do you expect a different amount? We’ll try to make it happen</div>
        <form className="er-form">
          <Field className="er-input" name="expectedRent" component={renderAutosize} label="Expected Rent" placeholder="$5800" {...currencyMask}/>
        </form>
        <div className="seperator" />
      </div>
    )
  };

  steps = () => {
    const { step } = this.props;
    console.log(step);
    if (step === 'personalDetails') {
      return this.renderPersonalDetails();
    } else if(step === 'address') {
      return this.renderAddress();
    } else {
      return this.renderRent();
    }
  };

  render() {
    return (
      <div>
          {this.steps()}
      </div>
    );
  }
}

const reduxFormBound = reduxForm({
  form: 'detailsForm',
}) (Form);

export default connect((state) => ({
  user: state.user,
}),
(dispatch) => ({
}))(reduxFormBound);
