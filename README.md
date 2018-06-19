<b>About this application</b>

This app is a full stack nodejs app with the a react-redux SPA created with create-react-app and a thin express.js server layer.

All the code pertaining to the client is in `client/src` and for server is in `server.js`

<b>Installation instructions for this app</b>

PreRequisites for this app are `node, yarn( or npm)`

Once you clone the repo you will need to supply 2 env variables via a .env file or your bash in your root.


`SENDGRID_API_KEY=YOUR API KEY`
`ZILLOW_API=YOUR API KEY`

SENDGRID_API_KEY is required for email to work and ZILLOW_API is required for Zillow API to work

Once you are in the root directory run `yarn install`. This will setup your server dependencies.

then run `cd client` and `yarn install` this will setup your client.

Once that is complete checkout to root and run `yarn dev` at this point your client will run at :3000 and server at :5000

Hot reloading is enabled which will autolaunch your browser for :3000
