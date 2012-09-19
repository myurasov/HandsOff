/**
 * Application controller
 *
 * @copyright 2012, Mikhail Yurasov
 */

var MainWindow = require("modules/UI/MainWindow");
var Utils = require("lib/mym/Utils");

exports = function () {
  var self = this;
  var mainWindow;

  self.coords = null;

  /**
   * Start geolocation
   */
  var geolocationStarted = false;
  self.startGeolocation = function () {
    if (geolocationStarted) return;
    geolocationStarted = true;

    Ti.Geolocation.purpose = "Geolocation";
    Ti.Geolocation.preferredProvider = "gps";
    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
    Ti.Geolocation.distanceFilter = 3;

    Ti.Geolocation.addEventListener("location", self.onLocation);
  }

  self.onLocation = function (e) {
    self.coords = e.coords;
    Ti.App.fireEvent("_location", e);
  }

  self.sendMessage = function (locked, textLog) {
    if (App.Config.get("smsAlerts")) {
      var uid = Utils.createUID(7, Utils.ALPHABET_HEX);
      var state = locked ? "locked" : "unlocked";

      Ti.Geolocation.getCurrentPosition(function (e) {
        if (e.coords) {
          var body = "Car " + state + " at http://sk.managebytes.com/{u}, the speed is " + Math.max(0, Math.round(e.coords.speed / 1.6)) + "mph";
          body = body.replace("{u}", uid);
          App.sendSMS(App.Config.get("smsPhone"), body, textLog, e.coords, uid);
        } else {
          App.sendSMS(App.Config.get("smsPhone"), "Car " + state, textLog, null, uid);
        }
      });
    }
  }

  /**
   * Start app
   */
  self.start = function () {
    self.startGeolocation();

    // register bg service
    Ti.App.iOS.registerBackgroundService({url:'modules/BgService.js'});

    // prevent screen from locking
    Titanium.App.idleTimerDisabled = true;

    // launch UI
    mainWindow = MainWindow.createMainWindow();

    var tabs = [Ti.UI.createTab({
      window: mainWindow
    })];

    var tabGroup = Titanium.UI.createTabGroup({
      tabs: tabs
    });

    tabGroup.open();
  };

  self.sendSMS = function (phone, body, textLog, coords, uid) {
    if (textLog == undefined) {
      textLog = false;
    }

    var url = "http://sk.managebytes.com/___send.php?t={t}&m={m}&c={c}&u={u}&nocache=" + Math.random();

    phone = phone.replace(/\D/g, ""); // remove non-numbers
    //phone = "425-615-5870"; // remove non-numbers

    url = url.replace("{t}", encodeURIComponent(phone));
    url = url.replace("{m}", encodeURIComponent(body));
    url = url.replace("{u}", encodeURIComponent(uid));

    url = url.replace("{c}", coords === null ? "null" :  encodeURIComponent(JSON.stringify({
      lat: coords.latitude,
      lon: coords.longitude,
      speed: coords.speed
    })));

    Titanium.API.info(url); // xxx

    var xhr = Ti.Network.createHTTPClient();
    xhr.timeout = 45 * 1000;
    xhr.open("GET", url);

    xhr.onload = function () {
      var r = xhr.responseText.replace(/<!--[\s\S]*-->/, "");
      var data = JSON.parse(r);

      if (data.success) {
        if (!textLog) mainWindow.log("SMS sent to: " + phone);
        Titanium.API.info("SMS sent to: " + phone); // xxx
      } else {
        if (!textLog) mainWindow.log("SMS error");
        Titanium.API.info("SMS error"); // xxx
        Titanium.API.info("RESPONSE:" + xhr.responseText); // xxx
//        alert(xhr.responseText); // xxx
      }
    }

    xhr.onerror = function (event) {
      if (!textLog) mainWindow.log("Transfer error");
    }

    xhr.send();

    if (!textLog) mainWindow.log("Sending SMS to: " + phone);
    Titanium.API.info("Sending SMS to: " + phone); // xxx
  }
};