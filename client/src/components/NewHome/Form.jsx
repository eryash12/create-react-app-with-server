import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import TextField from '../TextField/TextField';
import { required } from '../../utils/validations';
import AddressAutocomplete from '../AddressAutocomplete';
import numbro from 'numbro';
import phoneImg from './img/phone.png';
import emailImg from './img/email.png';
import firstnameImg from './img/firstname.png';
import passwordImg from './img/password.png';
import successImg from './img/success.svg';
import AutosizeInput from 'react-input-autosize';

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

const normalizePhone = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '')
  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 3) {
      return onlyNums + '-'
    }
    if (onlyNums.length === 6) {
      return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3) + '-'
    }
  }
  if (onlyNums.length <= 3) {
    return onlyNums
  }
  if (onlyNums.length <= 6) {
    return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3)
  }
  return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 6) + '-' + onlyNums.slice(6, 10)
}

const normalizeCurrency = (value, previousValue) => {
  if (!value) {
    return value
  }
  if (value === '$') {
    return '';
  }
  const onlyNums = value.replace(/[^\d]/g, '');
  return numbro(onlyNums).formatCurrency({mantissa: 0, thousandSeparated: true});
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      phoneActive: false
    }
  }

  PhoneMaskInput = ({ input, label, meta, ...custom }) => {
    const hasToBeActive = meta.active || meta.dirty;
    if(hasToBeActive !== this.state.phoneActive) {
      this.setState({ phoneActive: hasToBeActive });
    }
    return (<input
      {...input}
      {...custom}
    />);
  }

  imgWrap = (img) => (<img className="img-form" src={img}/>);

  hiddenButton = () => <button type="submit" style={{position: 'absolute', zIndex: -1, opacity: 0}} />

  renderPersonalDetails = () => {
    return(
      <div>
        <form className="fields" action="/" onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
          <div className="split">
            <TextField img={this.imgWrap(firstnameImg)} name="firstName" placeholder="First name" validate={[required]}/>
            <TextField name="lastName" placeholder="Last name" validate={[required]}/>
          </div>
          <TextField img={this.imgWrap(emailImg)} className="full" name="email" placeholder="Email" validate={[required]}/>
          <TextField img={this.imgWrap(passwordImg)} className="full" name="password" type="password" placeholder="Password" validate={[required]}/>
          <TextField img={this.imgWrap(phoneImg)} className="full" name="phone" type="tel" placeholder="Phone number" normalize={normalizePhone} validate={[required]}/>
          {this.hiddenButton()}
        </form>
        <div className="terms-and-conditions">
          <div className="text">By signing up, I agree to Beepi’s <span className="highlight-color">Terms of Service</span> and <span className="highlight-color">Privacy Policy</span>.</div>
        </div>
      </div>
    )
  }

  renderAddress = () => {
    return (
      <form onSubmit={this.props.handleSubmit(this.props.onSubmit)} >
        <div>
          <AddressAutocomplete onAddressSelect={this.props.onAddressSelect} />
        </div>
        {this.hiddenButton()}
      </form>
    );
  };

  renderRent = () => {
    const { user: {address: {rentZestimate, zestimate}} } = this.props;
    let displayZest = formatCurrency(rentZestimate) || `${calcRentZestimate(zestimate).lowerRange} - ${calcRentZestimate(zestimate).upperRange}`;
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
        <form className="er-form" onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
          <Field className="er-input" name="expectedRent" component={renderAutosize} label="Expected Rent" placeholder="$5800" validate={[required]} normalize={normalizeCurrency}/>
          {this.hiddenButton()}
        </form>
        <div className="seperator" />
      </div>
    )
  };

  steps = () => {
    const { step } = this.props;
    if (step === 'personalDetails') {
      return this.renderPersonalDetails();
    } else if(step === 'address') {
      return this.renderAddress();
    } else {
      return this.renderRent();
    }
  };

  render() {
    const {onSubmit, footerText, invalid, submitting, pristine, step, user = {}} = this.props;
    const userAddress = user.address || {};
    const zestimate = userAddress.zestimate || userAddress.rentZestimate;
    const footerDisabled = step === 'address' ? !zestimate : (invalid || submitting || pristine);
    const footerClass = footerDisabled ? "footer disabled" : "footer active";
    return (
      [
        <div key="1" className="grid-div">
          {this.steps()}
        </div>,
        <div key="2" className={footerClass} onClick={footerDisabled ? f => f : onSubmit}>
          <div className="footer-text">{footerText}</div>
        </div>
      ]
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
