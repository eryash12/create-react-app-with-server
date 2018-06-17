import React from 'react';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import TextField from '@material-ui/core/TextField';
import './AddressAutocomplete.scss';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class AddressAutocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '' }
  }

  handleChange = (address) => {
    this.setState({ address })
  }

  handleSelect = (address) => {
    geocodeByAddress(address)
      .then(results => this.props.onAddressSelect(results[0]))
    this.setState({ address })
  }

  render() {
    return (
      <div className='address-autocomplete'>
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div>
              <TextField
                className = "address-input"
                {...getInputProps({
                  placeholder: 'Address',
                })}
              />
                {suggestions.length > 0 &&
                  <List className="suggestions-container" component="nav">
                    {
                      suggestions.map(suggestion => {
                        const style = suggestion.active
                                    ? { backgroundColor: '#b3bce6', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
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
