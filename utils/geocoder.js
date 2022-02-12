// const NodeGeocoder = require('node-geocoder');

// const options = {
//     provider:process.env.GEOCODER_PROVIDER,
//     httpAdapter: 'https',
//     apiKey: process.env.GEOCODER_API_KEY,
//     formatter: null
// }

// const geocoder = new NodeGeocoder(options)

// module.exports = geocoder;

const geocode = require("node-geocoder");

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "HUufCUlheADEuMG3W4fiK962lk8qlkSu",
  formatter: null
};

const geocoder = geocode(options);

module.exports = geocoder;