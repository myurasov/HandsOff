/**
 * Configuration
 *
 * Properties beginning with _ are not saved
 *
 * @ver 1.1
 * @copyright 2012, Mikhail Yurasov
 */

var _ = require("lib/underscore");

exports = function (defaults, keyName) {
  var self = this;

  var data = defaults;
  var _keyName = keyName || null;

  self.get = function (setting) {
    if (setting === undefined) {
      return data;
    } else {
      return data[setting];
    }
  }

  self.set = function (setting, value) {
    data[setting] = value;
    return self;
  }

  self.save = function () {
    if (_keyName !== null) {
      var saveData = _.clone(data);

      _.each(data, function (val, key) {

        if (key.substr(0, 1) == "_") {
          delete saveData[key];
        } else {
          // Convert dates
          if (_.isDate(val)) {
            saveData[key] = val.toString();
          }
        }
      });

      saveData = JSON.stringify(saveData);
      Ti.App.Properties.setString(_keyName, saveData);
    }

    return self;
  }

  self.load = function () {
    if (_keyName !== null) {
      var loadedData = Ti.App.Properties.getString(_keyName);
      loadedData = JSON.parse(loadedData);

      if (loadedData === null) {
        loadedData = {};
      }

      _.defaults(loadedData, data);
      data = loadedData;
    }

    return self;
  }

  self.load();
};