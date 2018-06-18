import React from 'react';
import './Home.css';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import Form from './Form';
import History from './History';

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
          <Paper className="grid-div form-div">
            <Form />
          </Paper>
          <Paper className="grid-div">
            <History items={historyItems}/>
          </Paper>
          <Paper className="grid-div form-div">
            3
          </Paper>
          <Paper className="grid-div form-div">
            4
          </Paper>
        </div>
      </div>
    );
  }
};

export default connect((state) => ({

}), (dispatch) => ({

}))(Home);
