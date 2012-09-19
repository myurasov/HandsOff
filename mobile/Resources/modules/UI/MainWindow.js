/**
 * MainWindow
 *
 * Events: -
 *
 * @copyright 2012, Mikhail Yurasov
 */

var _ = require("lib/underscore");
var PinWindow = require("modules/UI/PinWindow");
var SettingsWindow = require("modules/UI/SettingsWindow");

var createMainWindow = function(options)
{
  var view;
  var settingsButton;
  var pinWindow;
  var settingsWindow;
  var logTable;

  // default options
  options = _.defaults(options || {}, {
  });

  function init()
  {
    settingsButton = Ti.UI.createButton({
      image:'images/settings-button.png'
    });

    view = Ti.UI.createWindow({
      backgroundImage: "images/main-bg.png",
//      backgroundRepeat: true,
      barImage: "images/bar.png",
      barColor: "#f5a00e",
      title: "SafeKey",
      rightNavButton: settingsButton,
      tabBarHidden: true
    });

    var lblSpeed = Ti.UI.createLabel({
      text: "60",
      font: {
        fontSize: 90,
        fontFamily: "Helvetica-Bold"
      },
      color: "black",
      top: 100,
      left: 122,
      width: 140,
      height: 200,
//      backgroundColor: "yellow",
      textAlign: "center",
      opacity: 0.8
    });

    view.add(lblSpeed);

    //

    logTable = Ti.UI.createTableView({
      bottom: 10,
      left: 10,
      right: 10,
      height: 155,
      borderRadius: 5
    });

    view.add(logTable);

    //

    pinWindow = PinWindow.createPinWindow();
    settingsWindow = SettingsWindow.createSettingsWindow();

    //

    pinWindow.addEventListener("unlock", function(e){
      pinWindow.close({
        transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT,
        duration : 333
      });
      _.delay(function () {
        settingsWindow.open({
          modal: true,
          modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
        });
      }, 444);
    });

    settingsButton.addEventListener("click", function(e){
      pinWindow.open({
        modal: true,
        modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
      });
    });

    Ti.App.addEventListener("_location", function(e){
      lblSpeed.text = Math.max(Math.round(e.coords.speed / 1.6), 0);
    });

    Ti.App.addEventListener("resumed", function(e){
      view.log("resumed");
    });

    view.addEventListener("open", function(e){
      App.sendMessage(false, false);
    });
  }

  init();

  view.log = function (message) {
    logTable.appendRow({
      title: message
    });
  };

  return view;
}

//

exports = {
  createMainWindow: createMainWindow
}