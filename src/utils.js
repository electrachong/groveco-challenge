const LOG_DEBUG = process.env['LOG_DEBUG']

function log_debug(msg, obj) {
  if (LOG_DEBUG !== 'true') {
    return;
  }
  console.log(`DEBUG: ${msg}`, obj)
}

class Coordinates {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  // alias / syntactic sugar
  get lat() {
    return this.latitude;
  }

  get long() {
    return this.longitude;
  }

  static from_string(lat_str, long_str) {
    const [latitude, longitude] = [lat_str, long_str].map(str => parseFloat(str));
    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Unable to successfully parse latitude or longitude from string');
    }
    return new Coordinates(latitude, longitude);
  }
}

function degrees_to_radian(degrees) {
  return degrees * (Math.PI/180);
}

function get_earth_radius(unit_type) {
  const radius_by_unit = {
    km: 6371,
    mi: 3958.8,
  }
  return radius_by_unit[unit_type]
}

module.exports = {
  Coordinates,
  degrees_to_radian,
  get_earth_radius,
  log_debug,
};
