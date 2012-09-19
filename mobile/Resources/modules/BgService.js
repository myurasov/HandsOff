
// enviroment options
var __DEBUG = true;
var __DEMO = false;

var Application = require("modules/Application");
App = new Application();

Ti.include("Config.js");

Titanium.API.info("entered bg mode"); // xxx

App.sendMessage(true, true);