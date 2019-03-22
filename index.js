#!/usr/bin/env node
const util = require('yargs');
const find_store = require('./src/find_store.js')

util
  .check((argv) => {
    if (argv.address === undefined && argv.zip === undefined) {
      throw new Error('Either address or zip option must be specified.')
    }
    if (argv.address === '') {
      throw new Error('Address should not be an empty string.')
    }
    if (argv.zip != undefined && isNaN(argv.zip)) {
      throw new Error('Invalid zip code given. Zip code should be a number.')
    }
    return true
  })
  .option('address', {
    describe: 'Find nearest store to this address. If there are multiple best-matches, return the first.',
    type: 'string',
  })
  .option('zip', {
    describe: 'Find nearest store to this zip code. If there are multiple best-matches, return the first.',
    type: 'number',
  })
  .option('units', {
    describe: 'Display units in miles or kilometers',
    default: 'mi',
    type: 'string',
    choices: ['mi', 'km'],
  })
  .option('output', {
    describe: 'Output in human-readable text, or in JSON (e.g. machine-readable)',
    default: 'text',
    type: 'string',
    choices: ['text', 'json'],
  })
  .conflicts('address', 'zip')
  .fail(handle_error)
   // we override the automatically-generated help with docopts-conformant doc
  .help(false)
  .boolean('help');

handle_args(util.argv)

function handle_error(msg, err) {
  print_help();
  console.error(msg);
  process.exit(1);
}

function print_help() {
  const doc = `
  Find Store
    find_store will locate the nearest store (as the vrow flies) from
    store-locations.csv, print the matching store address, as well as
    the distance to that store.

  Usage:
    find_store --address="<address>"
    find_store --address="<address>" [--units=(mi|km)] [--output=text|json]
    find_store --zip=<zip>
    find_store --zip=<zip> [--units=(mi|km)] [--output=text|json]

  Options:
    --zip=<zip>          Find nearest store to this zip code. If there are
                         multiple best-matches, return the first.
    --address            Find nearest store to this address. If there are
                         multiple best-matches, return the first.
    --units=(mi|km)      Display units in miles or kilometers [default: mi]
    --output=(text|json) Output in human-readable text, or in JSON (e.g.
                         machine-readable) [default: text]

  Example
    find_store --address="1770 Union St, San Francisco, CA 94123"
    find_store --zip=94115 --units=km
  `;
  console.log(doc);
}

async function handle_args({ address, zip, output, units, help }) {
  if (help) {
    print_help();
  } else {
    await find_store(address, zip, output, units).catch(err => {
      handle_error(err.message, err)
    });
  }
}
