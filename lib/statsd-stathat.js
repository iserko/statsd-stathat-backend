var util = require('util');
var stathat;
var debug;
var stathat_ez_key;
var stathat_stats = {};
var flushInterval;

var increment_stat = (function (key, count) {
  stathat_stats[key] = (stathat_stats[key] || 0) + count;
});

var send_callback = (function (status, json) {
  if (status == 200) {
    increment_stat('successful_send', 1);
  } else {
    increment_stat('failed_send', 1);
    util.log('ERROR: Failed to send stat to stathat. Status: ' + status + '; Response: ' + json);
  }
  increment_stat('metrics_sent', 1);
});

var flush_stats = (function (timestamp, metrics) {
  if (debug) {
    util.log('Flushing. timestamp=' + timestamp + '; metrics=' + metrics);
  }
  for (key in metrics.counters) {
    stathat.trackEZCount(stathat_ez_key, key, metrics.counters[key], send_callback);
  }
});

var backend_status = (function (write_callback) {
  for (stat in stathat_stats) {
    write_callback(null, 'stathat', stat, stathat_stats[stat]);
  }
});

exports.init = (function (startup_time, config, events) {
  debug = config.debug;
  stathat_ez_key = config.stathat.ez_key;
  stathat = require('node-stathat').setup({
    concurrency: config.stathat.concurrency,
    useHTTPS: true,
    request: {
      maxAttempts: config.stathat.max_attempts,
      retryDelay: config.stathat.retry_delay
    }
  });
  stathat_stats.last_flush = startup_time;
  stathat_stats.last_exception = startup_time;
  flushInterval = config.flushInterval;
  events.on('flush', flush_stats);
  events.on('status', backend_status);
  return true;
});
