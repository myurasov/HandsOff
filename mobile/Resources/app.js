/**
 * App bootstrap
 *
 * @copyright 2012, Mikhail Yurasov
 */

// enviroment options
var __DEBUG = true;
var __DEMO = false;

// start application

var Application = require("modules/Application");
App = new Application();

Ti.include("modules/Config.js");

App.start();