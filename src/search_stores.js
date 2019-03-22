const csv_parser = require('csv-parser');
const fs = require('fs');

const { Coordinates, degrees_to_radian, log_debug } = require('./utils');

const STORE_LOCATION_CSV_PATH = process.env['STORE_LOCATION_CSV_PATH']

function search_stores(coordinates) {
  return new Promise((resolve, reject) => {
    let nearest_store = null;
    fs.createReadStream(STORE_LOCATION_CSV_PATH)
      .on('error', err => {
        log_debug('Error reading or parsing store csv file:\n', { err, STORE_LOCATION_CSV_PATH });
        reject(err);
      })
      .pipe(csv_parser())
      .on('data', store => {
        let store_coords = undefined;
        try {
          store_coords = Coordinates.from_string(store.Latitude, store.Longitude);
        } catch (err) {
          log_debug('Error parsing latitude and longitude from csv:\n', { err, store_data: store });
          return reject(new Error('Error parsing latitude and longitude from csv. Please check the format.'));
        }
        const distance_factor = calculate_haversine_factor(store_coords, coordinates);
        if (nearest_store === null || distance_factor < nearest_store.distanceFactor) {
          nearest_store = Object.assign(normalize_keys(store), { distanceFactor: distance_factor });
          log_debug('detected a closer store:\n', nearest_store);
        }
      })
      .on('end', () => resolve(nearest_store));
  });
}

function normalize_keys(raw_store) {
  const store = {}
  Object.keys(raw_store).forEach(k => {
    const k_arr = k.toLowerCase().split(' ').map(word => word.replace(/[^(\w)]/g, ''));
    let key = '';
    k_arr.forEach((word, i) => {
      if (i === 0) {
        key += word;
      } else {
        key += word[0].toUpperCase();
        key += word.substring(1);
      }
    });
    store[key] = raw_store[k];
  });
  return store;
}

// factor to multiply with Earth radius to obtain distance,
// per the haversine formula: https://www.movable-type.co.uk/scripts/latlong.html
function calculate_haversine_factor(point_a, point_b) {
  const [lat_a, lat_b, delta_lat, delta_long] = [
    point_a.latitude,
    point_b.latitude,
    (point_b.latitude - point_a.latitude),
    (point_b.longitude - point_b.longitude)
  ].map(v => degrees_to_radian(v));

  const a = Math.sin(delta_lat/2) * Math.sin(delta_lat/2) +
    Math.cos(lat_a) * Math.cos(lat_b) *
    Math.sin(delta_long/2) * Math.sin(delta_long/2);
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = search_stores;
