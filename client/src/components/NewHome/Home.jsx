import React from 'react';
import './Home.css';
import { connect } from 'react-redux';
import Form from './Form';
import closeImg from './img/ic_close@3x.png';
import backImg from './img/back.png';
import supportImg from './img/support.png';
import { calcRentZestimate, formatCurrency } from './Form';
import { fetchPost } from '../../utils/fetch';
import { formValueSelector } from 'redux-form';
import _debounce from 'lodash/debounce';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'personalDetails',
      browserHeight: this.getHeight(),
    }
  }

  getHeight = () => { return window.innerHeight - 52; }

  getHeaderProps = (step) => {
    if (step === 'personalDetails') {
      return {
        leftImg: <img src={closeImg} className="cross-img"/>,
        midText: 'Sign Up',
        rightText: 'SIGN IN',
        footerText: 'ENTER PROPERTY',
        onSubmit: async () => {
          await this.props.onSubmitPersonalDetails();
          this.setState({step: 'address'});
        }
      }
    } else if (step === 'address') {
      return {
        leftImg: <img onClick={() => this.setState({step: 'personalDetails'})} src={backImg} className="cross-img"/>,
        midText: 'Home Address',
        rightText: <img src={supportImg} className="cross-img"/>,
        footerText: 'ESTIMATE RENT',
        onSubmit: () => this.setState({step: 'rent'})
      }
    } else {
      return {
        leftImg: <img onClick={() => this.setState({step: 'address'})} src={backImg} className="cross-img"/>,
        midText: 'Success',
        rightText: <img src={supportImg} className="cross-img"/>,
        footerText: 'DONE',
        onSubmit: async () => {
          await this.props.onSubmitExpectedRent();
          this.setState({step: 'rent'});
        }
      }
    }
  }

  componentDidMount() {
    window.addEventListener("resize", _debounce(this.updateDimensions, 150));
  }

  updateDimensions = () => {
    this.setState({ browserHeight: this.getHeight() });
  }

  getHomeStyle = () => {
    const { step } = this.state;
    const base = {};
    if (step === 'rent') {
      base['backgroundColor'] = "#fff";
    }
    return base;
  }
  render() {
    const { onAddressSelect } = this.props;
    const {leftImg, midText, rightText, footerText, onSubmit} = this.getHeaderProps(this.state.step);
    return (
      <div className="home" style={this.getHomeStyle()}>
        <div className="header">
          <div className="left-header-box">
            {leftImg}
          </div>
          <div className="mid-header-text">{midText}</div>
          <div className="right-header-text">{rightText}</div>
        </div>
        <div className="canvas" style={{minHeight: this.state.browserHeight}}>
          <Form step={this.state.step} onAddressSelect={onAddressSelect} onSubmit={onSubmit} footerText={footerText}/>
        </div>
      </div>
    );
  }
};

const selector = formValueSelector('detailsForm');

export default connect((state) => ({
  user: state.user,
}), (dispatch) => ({
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
      dispatch({type: 'set user', user: { address }});
      return false;
    };
    const body = await response.json();
    address['rentZestimate'] = body.rentZestimateAmount;
    address['zestimate'] = body.zestimateAmount;
    dispatch({type: 'set user', user: { address }});
    return true;
  }
}))(Home);
