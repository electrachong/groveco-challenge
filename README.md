# groveco-challenge

# Installation and usage

## Installation

```
git clone https://github.com/electrachong/groveco-challenge.git
cd groveco-challenge
npm install -g
```

### Get a Mapquest Geocoder API token
https://developer.mapquest.com/documentation/geocoding-api/

### Download store locations csv
```
wget https://raw.githubusercontent.com/groveco/code-challenge/master/store-locations.csv
```

## Usage

Run:
```
MAPQUEST_API_KEY=<API KEY> STORE_LOCATION_CSV_PATH=<PATH TO CSV> find_store --zip=94107
```
```
MAPQUEST_API_KEY=<API KEY> STORE_LOCATION_CSV_PATH=<PATH TO CSV> find_store --address='301 8th street, san francisco'
```

For more usage instructions, refer to the help documentation:
```
find_store --help
```
```
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
```

# Notes

I opted to implement a naive O(n) solution that searches through each row of the csv and calculates the difference, comparing to the shortest distance found to that point. To avoid having to store large amounts of data in memory if the size of the csv scales, I stream the csv record-by-record instead of reading the whole file at once. There are still constraints to this approach, namely that as the file grows larger the command will take longer to perform.

A more performant approach might store the data in a postgres database or in a cloud-hosted and queryable map and perform a radius search to narrow down the nearby-locations before calculating the distance.

I wrote a few unit tests to ensure basic functionality but better test coverage would include testing validation for the shell arguments, performance testing for speed at various sizes of the csv, verification of accuracy of the algorithm implemented, and certain error cases like parsing of the csv.

# References

https://www.movable-type.co.uk/scripts/latlong.html
