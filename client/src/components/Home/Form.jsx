import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { required, phone, email } from '../../utils/validations';
import AddressAutocomplete from '../AddressAutocomplete';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
    }
  }

  renderPersonalDetails = () => {
    const { invalid, submitting, pristine, handleSubmit, onSubmitPersonalDetails } = this.props;
    const onClick = handleSubmit(() => this.setState({ activeStep: 1}, onSubmitPersonalDetails()));
    return(
      <form className="fields" onSubmit={onClick}>
        <Field className="full" name="firstName" component={TextField} label="First Name" validate={[required]}/>
        <Field className="full" name="lastName" component={TextField} label="Last Name" validate={[required]}/>
        <Field className="full" name="phone" type="number" component={TextField} label="Phone" validate={[required, phone]}/>
        <Field className="full" name="email" component={TextField} label="Email" validate={[required, email]}/>
        <Button
          className="submit-btn"
          variant="contained"
          color="primary"
          onClick={onClick}
          disabled={invalid || submitting || pristine}
        >
          Next
        </Button>
      </form>
    )
  }

  renderAddress = () => {
    return (
      <div>
        <AddressAutocomplete onAddressSelect={this.props.onAddressSelect} />
      </div>
    );
  };

  renderRent = () => ({});

  steps = () => (
    [
      {
        label: 'Personal Details',
        content: this.renderPersonalDetails,
      },
      {
        label: 'Rent Zestimate',
        content: this.renderAddress,
      },
      {
        label: 'Rent',
        content: this.renderRent,
      }
    ]
  );

  render() {
    const { activeStep } = this.state;
    return (
      <Stepper activeStep={1} orientation="vertical">
        {
          this.steps().map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent className="step-content">
                {step.content()}
              </StepContent>
            </Step>
          ))
        }
      </Stepper>
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
    dispatch({type: 'set user', user: { address }});
  }
}))(reduxFormBound);
