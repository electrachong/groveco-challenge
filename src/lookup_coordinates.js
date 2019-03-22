const NodeGeocoder = require('node-geocoder');

const { Coordinates, log_debug } = require('./utils');

const MAPQUEST_API_KEY = process.env['MAPQUEST_API_KEY'];

async function lookup_coordinates(address, zipcode) {
  if (!MAPQUEST_API_KEY) {
    log_debug('Detected missing mapquest api key');
    throw new Error('MAPQUEST_API_KEY env variable is not set. Please try again.')
  }
  const geocoder = NodeGeocoder({
    provider: 'mapquest',
    apiKey: MAPQUEST_API_KEY,
  });
  result = await geocoder.geocode({ address, zipcode }).catch(err => {
    log_debug('Detected error making geocoding request:\n', err);
    throw new Error('Encountered error making geocoding request. Did you set MAPQUEST_API_KEY correctly?');
  });
  const { latitude, longitude } = result[0];
  return new Coordinates(latitude, longitude);
}

module.exports = lookup_coordinates;
