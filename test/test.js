const assert = require('assert');

const lookup_coordinates = require('../src/lookup_coordinates.js')
const search_stores = require('../src/search_stores.js')
const { Coordinates } = require('../src/utils.js')

const skipIfNoApiKey = process.env['MAPQUEST_API_KEY'] ? describe : describe.skip;
const skipIfNoCsvPath = process.env['STORE_LOCATION_CSV_PATH'] ? describe : describe.skip;

describe('lookup_coordinates', () => {
  skipIfNoApiKey('should return coordinates if MAPQUEST_API_KEY is provided', () => {
    it('with address', async function() {
      const coordinates = await lookup_coordinates('301 8th street, san francisco', null);
      assert.strictEqual(typeof coordinates.latitude, 'number');
      assert.strictEqual(typeof coordinates.longitude, 'number');
    });

    it('with zip', async function() {
      const coordinates = await lookup_coordinates(null, 94107);
      assert.strictEqual(typeof coordinates.latitude, 'number');
      assert.strictEqual(typeof coordinates.longitude, 'number');
    });
  });
});

// note: please use test data in store-locations.csv to test
describe('search_stores', () => {
  skipIfNoCsvPath('', () => {
    it('should return correct store for exact match in coordinates', async function() {
      const coordinates = new Coordinates(45.5534647, -94.2104446);
      const closest_location = await search_stores(coordinates);
      assert.strictEqual(closest_location.storeName, 'St Cloud');
      assert.strictEqual(closest_location.latitude, coordinates.latitude.toString());
      assert.strictEqual(closest_location.longitude, coordinates.longitude.toString());
    });

    it('should return correct store for closest match in coordinates', async function() {
      const coordinates = new Coordinates(45.5534646, -94.2104445);
      const closest_location = await search_stores(coordinates);
      assert.strictEqual(closest_location.storeName, 'St Cloud');
    });
  });
});
