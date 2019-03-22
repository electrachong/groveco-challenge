const lookup_coordinates = require('./lookup_coordinates.js')
const search_stores = require('./search_stores.js')
const { log_debug, get_earth_radius } = require('./utils');

async function find_store(address, zip, output, units) {
  const coordinates = await lookup_coordinates(address, zip);
  log_debug('converted zip or address to long/lat:\n', coordinates);

  const closest_location = await search_stores(coordinates);
  const distance = closest_location.distanceFactor * get_earth_radius(units);

  print_store(closest_location, distance, units, output);
}

function print_store(store, distance, units, output) {
  if (output === 'text') {
    console.log(`Nearest store: ${store['storeName']} (${store['storeLocation']})`);
    console.log(`Address: ${store['address']}, ${store['city']}, ${store['state']} ${store['zipCode']}`);
    console.log(`Calculated distance: ${distance} ${units}`);
  } else {
    const json_str = JSON.stringify(Object.assign({}, store, {
      distanceFactor: undefined,
      distance: {
        units: distance,
        unit: units,
      }
    }), null, 4)
    console.log(`${json_str}`);
  }
}

module.exports = find_store;
