import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import TextField from '../TextField/TextField';
import { required, phone, email } from '../../utils/validations';
import AddressAutocomplete from '../AddressAutocomplete';
import numbro from 'numbro';
import { fetchPost } from '../../utils/fetch';
import phoneImg from './img/phone.png';
import emailImg from './img/email.png';
import firstnameImg from './img/firstname.png';
import passwordImg from './img/password.png';

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
            <Field img={this.imgWrap(firstnameImg)} className="full" name="firstName" component={TextField} placeholder="First name" validate={[required]}/>
            <Field className="full" name="lastName" component={TextField} placeholder="Last name" validate={[required]}/>
          </div>
          <Field img={this.imgWrap(emailImg)} className="full" name="email" component={TextField} placeholder="Email" validate={[required, email]}/>
          <Field img={this.imgWrap(passwordImg)} className="full" name="password" type="password" component={TextField} placeholder="Password" validate={[required, email]}/>
          <Field img={this.imgWrap(phoneImg)} className="full" name="phone" type="tel" component={TextField} placeholder="Phone number" validate={[required, phone]}/>
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
        { this.renderZestimate(address.zestimate, address.rentZestimate) }
        { this.submitBtn({disabled: !(address.zestimate || address.rentZestimate), onClick}, 'Next')}
      </div>
    );
  };

  renderRent = () => {
    const { user: { address = {} }, invalid, submitting, pristine, handleSubmit, onSubmitExpectedRent } = this.props;
    const onClick = handleSubmit(() => this.setState({ activeStep: 3}, onSubmitExpectedRent));
    return (
      <div>
        Please enter the rent you expect for your home located at <b>{ address.formatted }</b>
        <form className="fields">
          <Field className="full" name="expectedRent" type="number" component={TextField} label="Expected Rent" validate={[required]}/>
          { this.submitBtn({ disabled: invalid || submitting || pristine, onClick }, 'save')}
        </form>
      </div>
    )
  };

  steps = () => {
    const { step } = this.props;
    console.log(step);
    if (step === 'personalDetails') {
      return this.renderPersonalDetails();
    } else if(step === 'address') {
      return this.renderAddres();
    } else {
      return this.renderRent();
    }
  };

  render() {
    const { activeStep } = this.state;
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

const selector = formValueSelector('detailsForm');

export default connect((state) => ({
  user: state.user,
}),
(dispatch) => ({
  onSubmitPersonalDetails: () => dispatch((dispatch, getState) => {
    const state = getState();
    dispatch({ type: 'set user', user: { ...selector(state, 'firstName', 'lastName', 'phone', 'email') }});
  }),
  onSubmitExpectedRent: () => dispatch(async (dispatch, getState) => {
    const state = getState();
    const user = state.user;
    user['expectedRent'] = selector(state, 'expectedRent');
    const existingItems = JSON.parse(localStorage.getItem('searches')) || [];
    existingItems.push(getState().user);
    localStorage.setItem('searches', JSON.stringify(existingItems));
    const url = '/api/notify_user';
    let formattedRent = '';
    if (user.address.rentZestimate) {
      formattedRent = formatCurrency(user.address.rentZestimate);
    } else {
      const { lowerRange, upperRange } = calcRentZestimate(user.address.zestimate);
      formattedRent = `${formatCurrency(lowerRange)} - ${formatCurrency(upperRange)}`;
    }
    const response = await fetchPost({ url, body: {user, formattedRent}});
    dispatch({ type: 'set user', user});
    return response.status;
  }),
  onAddressSelect: async addressNode => {
    const addressComponents = addressNode['address_components'];
    const address = { formatted: addressNode.formatted_address };
    addressComponents.forEach(
      comp => {
        if (comp.types.includes('street_number')) {
          address.streetNumber = comp.long_name;
        } else if (comp.types.includes('route')) {
          address.streetName = comp.long_name;
        } else if (comp.types.includes('locality')) {
          address.city = comp.long_name;
        } else if (comp.types.includes('administrative_area_level_1')) {
          address.state = comp.long_name;
        } else if (comp.types.includes('postal_code')) {
          address.zip = comp.long_name;
        }
      }
    );
    const url = '/api/rent_zestimate';
    const response = await fetchPost({ url, body: { address }});
    if (response.status !== 200) {
      dispatch({type: 'set user', user: { address: {} }});
      return false;
    };
    const body = await response.json();
    address['rentZestimate'] = body.rentZestimateAmount;
    address['zestimate'] = body.zestimateAmount;
    dispatch({type: 'set user', user: { address }});
    return true;
  }
}))(reduxFormBound);
