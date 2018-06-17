import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

const user = (state = {}, action) => {
  if (action.type === 'set user') {
    return { ...state, ...action.user };
  }
  return state;
}

export default combineReducers({
  form,
  user
});
