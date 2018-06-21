import React from 'react';
import './Home.css';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import Form from './Form';
import History from './History';
import Instructions from './Instructions';
import closeImg from './img/ic_close@3x.png';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'personalDetails',
    }
  }

  getHeaderProps = (step) => {
    if (step === 'personalDetails') {
      return {
        leftImg: <img src={closeImg} className="cross-img"/>,
        midText: 'Sign Up',
        rightText: 'SIGN IN',
        footerText: 'ENTER PROPERTY'
      }
    }
  }
  render() {
    const historyItems = JSON.parse(localStorage.getItem('searches')) || [];
    const {leftImg, midText, rightText, footerText} = this.getHeaderProps(this.state.step);
    return (
      <div className="home">
        <div className="header" square={true} elevation={1}>
          <div className="left-header-box">
            {leftImg}
          </div>
          <div className="mid-header-text">{midText}</div>
          <div className="right-header-text">{rightText}</div>
        </div>
        <div className="canvas">
          <div className="grid-div form-div">
            <Form step={this.state.step}/>
          </div>
        </div>
        <div className="footer">
          <div className="footer-text">{footerText}</div>
        </div>
      </div>
    );
  }
};

export default connect((state) => ({
  user: state.user,
}), (dispatch) => ({

}))(Home);
