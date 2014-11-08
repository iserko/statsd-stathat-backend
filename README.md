statsd-stathat-backend
======================

A statsd backend to send metrics to StatHat

## Installation:

* `npm install statsd statsd-stathat-backend`
* set up your statsConfig.js using the example below
* `node_modules/.bin/statsd statsdConfig.js`

## Example statsdConfig.js

  {
    stathat: {
      ez_key: '<get_it_from_stathat>',
      max_attempts: 5,
      retry_delay: 1000
    },
    port: 8125,
    backends: ["../statsd-stathat-backend/lib/statsd-stathat"]
  }

## Release History

* 0.0.1 Initial release
