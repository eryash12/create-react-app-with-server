const express = require('express');
const Zillow = require('node-zillow');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const port = process.env.SERVER_PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.post('/api/rent_zestimate', async (req, res) => {
  try{
    const params = req.body.address;
    const zillow = new Zillow('X1-ZWz18ihph743d7_9prl8');
    const response = await zillow.get('GetSearchResults', {
      address: `${params.streetNumber || ''} ${params.streetName}`,
      citystatezip: `${params.city} ${params.state} ${params.zip}`,
      rentzestimate: true
    });
    if (response.message.code === '0') {
      const rentZestimate = response['response']['results']['result'][0]['rentzestimate'];
      const zestimate = response['response']['results']['result'][0]['zestimate'];
      let zestimateAmount, rentZestimateAmount;
      if (rentZestimate) rentZestimateAmount = rentZestimate[0]['amount'][0]['_'];
      if (zestimate) zestimateAmount = zestimate[0]['amount'][0]['_'];
      if(!(rentZestimate || zestimateAmount)) return res.sendStatus(400);
      return res.status(200).json({ zestimateAmount, rentZestimateAmount });
    }
    return res.sendStatus(400);
  } catch(err) {
    res.status(500).json({ err: err.message });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
