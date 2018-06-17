const express = require('express');
const Zillow = require('node-zillow');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/rent_zestimate', async (req, res) => {
  const zillow = new Zillow('X1-ZWz18ihph743d7_9prl8');
  const response = await zillow.get('GetSearchResults', {
    address: '10675 Baxter Ave',
    citystatezip: 'Los Altos CA',
    rentzestimate: true
  })
  console.log(response.body);
  res.send({ response: response });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
