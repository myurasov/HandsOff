/**
 * Configuration
 * @copyright 2012, Mikhail Yurasov
 */

var Configuration = require("lib/mym/Configuration");

App.Config = new Configuration({
  smsAlerts: true,
  webLog: true,
  smsPhone: "+1 (310) 986-49-48"
}, "Config");