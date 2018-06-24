import React from 'react';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import TextField from './../TextField';
import './AddressAutocomplete.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class AddressAutocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '', error: '' }
  }

  handleChange = (address) => {
    this.setState({ address })
  }

  handleSelect = async (address) => {
    const results = await geocodeByAddress(address);
    const success = await this.props.onAddressSelect(results[0]);
    this.setState({ address, error: success ? '' : 'Rent Zestimate not available' });
  }

  render() {
    const state = this.state;
    return (
      <div className='address-autocomplete'>
        <PlacesAutocomplete
          value={state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div>
              <TextField
                className = "address-input"
                reduxForm={false}
                {...getInputProps({
                  placeholder: 'Search for Address',
                })}
              />
                {suggestions.length > 0 &&
                  <List className="suggestions-container" component="nav">
                    {
                      suggestions.map(suggestion => {
                        const style = suggestion.active
                                    ? { backgroundColor: '#b3bce6', cursor: 'pointer'}
                                    : { backgroundColor: '#ffffff', cursor: 'pointer'};
                        return(
                          <ListItem button className="suggestion" style={style} { ...getSuggestionItemProps(suggestion)}>
                            <ListItemText primary={suggestion.description} />
                          </ListItem>
                        );
                      })
                    }
                  </List>
                }
            </div>
          )}
        </PlacesAutocomplete>
      </div>
    );
  }
}
 export default AddressAutocomplete;
