import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PhoneIcon from '@material-ui/icons/ContactPhone';
import MailIcon from '@material-ui/icons/ContactMail';
import { calcRentZestimate, formatCurrency } from './Form';

export default ({items = []}) => (
  <div className="history-div">
    <div className="text-headline">Previous Searches</div>
    {items.map(item => renderItem(item))}
  </div>
)
const iconTextStyles = {
  marginLeft: 10,
  verticalAlign: 'super',
}
const renderItem = (item) => (
  <ExpansionPanel className="history-expanison-panel">
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography className="header-text"><i>{item.address.formatted}</i></Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Typography>
        <div className="rent-zestimate">Rent Zestimate is <b>{getRentZestimate(item)}</b></div>
        <div className="expected-rent">Expected rent for the property is <b>{formatCurrency(item.expectedRent)}</b></div>
        <div className="personal-info">
          <div className="name"><b>{item.firstName} {item.lastName}</b></div>
          <div className="phone"><PhoneIcon /><span style={iconTextStyles}>{item.phone}</span></div>
          <div className="mail"><MailIcon /><span style={iconTextStyles}>{item.email}</span></div>
        </div>
      </Typography>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

const getRentZestimate = (item) => {
  if (item.address.rentZestimate) {
    return <span>{formatCurrency(item.address.rentZestimate)}</span>;
  } else {
    const {lowerRange, upperRange} = calcRentZestimate(item.address.zestimate);
    return <span>{formatCurrency(lowerRange) - formatCurrency(upperRange)}</span>;
  }
}
