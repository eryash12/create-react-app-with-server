import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import TextField from '../TextField/TextField';
import { required, phone, email } from '../../utils/validations';
import AddressAutocomplete from '../AddressAutocomplete';
import numbro from 'numbro';
import phoneImg from './img/phone.png';
import emailImg from './img/email.png';
import firstnameImg from './img/firstname.png';
import passwordImg from './img/password.png';
import successImg from './img/success.svg';

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
    const { invalid, submitting, pristine, handleSubmit, onSubmitPersonalDetails } = this.props;
    const onClick = handleSubmit(() => this.setState({ activeStep: 1}, onSubmitPersonalDetails()));
    return(
      <div>
        <form className="fields" onSubmit={onClick}>
          <div className="full split">
            <TextField img={this.imgWrap(firstnameImg)} className="full" name="firstName" placeholder="First name" validate={[required]}/>
            <TextField className="full" name="lastName" placeholder="Last name" validate={[required]}/>
          </div>
          <TextField img={this.imgWrap(emailImg)} className="full" name="email" placeholder="Email" validate={[required, email]}/>
          <TextField img={this.imgWrap(passwordImg)} className="full" name="password" type="password" placeholder="Password" validate={[required, email]}/>
          <TextField img={this.imgWrap(phoneImg)} className="full" name="phone" type="tel" placeholder="Phone number" validate={[required, phone]}/>
          {/* {this.submitBtn({ disabled: invalid || submitting || pristine, onClick }, 'Next')} */}
        </form>
        <div className="terms-and-conditions">
          <div className="text">By signing up, I agree to Beepi’s <span className="highlight-color">Terms of Service</span> and <span className="highlight-color">Privacy Policy</span>.</div>
        </div>
      </div>
    )
  }

  renderZestimate = (zestimate, rentZestimate) => {
    if (!zestimate && !rentZestimate) return;
    if(!rentZestimate) {
      const { upperRange, lowerRange } = calcRentZestimate(zestimate);
      return(
        <div className="rent-zestimate">
            Congratulations! based on the address you entered we were able to identify your rent zestimate as
            {' '}<b>{formatCurrency(lowerRange)}</b> to <b>{formatCurrency(upperRange)}</b> approximately per month
        </div>
      )
    }
    return(
      <div className="rent-zestimate">
        Congratulations! based on the address you entered we were able to identify your rent zestimate as <b>{formatCurrency(rentZestimate)}</b>
      </div>
    );
  }

  renderAddress = () => {
    const { user: { address = {} } } = this.props;
    const onClick = () => this.setState({activeStep: 2});
    return (
      <div>
        <AddressAutocomplete onAddressSelect={this.props.onAddressSelect} />
      </div>
    );
  };

  renderRent = () => {
    const { user: {address: {rentZestimate, zestimate}} } = this.props;
    return (
      <div className="expected-rent">
        <img className="er-image" src={successImg} />
        <div className="er-headline">Found your place!</div>
        <div className="er-desc">Here’s the estimate rate you’ll get for your property monthy guaranteed</div>
        <div className="er-currency">{formatCurrency(rentZestimate) || `${calcRentZestimate(zestimate).lowerRange} - ${calcRentZestimate(zestimate).upperRange}`}</div>
        <div className="er-text2">Do you expect a different amount? We’ll try to make it happen</div>
        <form className="er-form">
          <Field className="er-input" name="expectedRent" type="number" component="input" label="Expected Rent" placeholder="$5800"/>
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
