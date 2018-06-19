import React from 'react';
import './Home.css';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import Form from './Form';
import History from './History';
import Instructions from './Instructions';

class Home extends React.Component {
  render() {
    const historyItems = JSON.parse(localStorage.getItem('searches')) || [];
    return (
      <div className="home">
        <Paper className="header">
          <div className="intials-box">
            YT
          </div>
          <div className="full-name">Yash Tamakuwala</div>
        </Paper>
        <div className="canvas">
          <Paper className="grid-div">
            <Instructions />
          </Paper>
          {historyItems.length > 0 &&
          <Paper className="grid-div history-items-div">
            <History items={historyItems} user={this.props.user}/>
          </Paper>
          }
          <Paper className="grid-div form-div">
            <Form />
          </Paper>
        </div>
      </div>
    );
  }
};

export default connect((state) => ({
  user: state.user,
}), (dispatch) => ({

}))(Home);
