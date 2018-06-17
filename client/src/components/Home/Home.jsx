import React from 'react';
import './Home.scss';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import Form from './Form';

class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <Paper className="header">
          <div className="intials-box">
            YT
          </div>
          <div className="full-name">Yash Tamakuwala</div>
        </Paper>
        <div className="canvas">
          <Paper className="form-div">
            <Form />
          </Paper>
        </div>
      </div>
    );
  }
};

export default connect((state) => ({

}), (dispatch) => ({

}))(Home);
