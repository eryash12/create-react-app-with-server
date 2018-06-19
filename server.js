const express = require('express');
const Zillow = require('node-zillow');
const bodyParser = require('body-parser');
const path = require('path');

var dotenv = require('dotenv');
dotenv.load();

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const port = process.env.PORT || 5000;

const mailer = require('@sendgrid/mail');
mailer.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.post('/api/rent_zestimate', async (req, res) => {
  try{
    const params = req.body.address;
    const zillow = new Zillow(process.env.ZILLOW_API);
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

app.post('/api/notify_user', (req, res) => {
  try {
    const ip = req.connection.remoteAddress;
    const user = req.body.user;
    const rent = req.body.formattedRent;
    const email = {
      to: user.email,
      from: 'yash@tamakuwala.com',
      subject: 'Congratulations! on receiving you rent zestimate',
      text: `Dear ${user.firstName},\n\nYour rent zestimate for the address ${user.address.formatted} is ${rent}. And your asking rent is ${user.expectedRent}.
        the ip address from which you requested is ${ip}.\nRegards,\nAdmin.
      `
    };
    mailer.send(email);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
