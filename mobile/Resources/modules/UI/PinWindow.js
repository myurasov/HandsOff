/**
 * PinWindow
 *
 * Events:
 *
 *  unlock
 *
 * @copyright 2012, Mikhail Yurasov
 */

var _ = require("lib/underscore");

var createPinWindow = function (options) {
  // default options
  options = _.defaults(options || {}, {});

  var view;
  var textPin;
  var cancelButton;

  function init() {
    cancelButton = Ti.UI.createButton({
      systemButton: Titanium.UI.iPhone.SystemButton.CANCEL
    });

    view = Ti.UI.createWindow({
      backgroundImage: "images/window-bg.png",
//      backgroundRepeat: true,
//      barImage: "images/bar.png",
      barColor: "#3991ea",
      rightNavButton: cancelButton,
      title: "Enter PIN"
    });

    view.add(textPin = Titanium.UI.createTextField({
      color: '#336699',
      top: 70,
      width: 200,
      height: 60,
      keyboardType: Titanium.UI.KEYBOARD_PHONE_PAD,
      passwordMask: true,
      maxLength: 4,
      textAlign: "center",
      font: {
        fontSize: 40,
        fontFamily: "Helvetica-Bold"
      },
      returnKeyType: Titanium.UI.RETURNKEY_DONE,
      borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
      hintText: "PIN"
    }));

    //

    textPin.addEventListener("change", function(e){
      if (textPin.value.length == 4) {
        view.fireEvent("unlock");
      }
    });

    view.addEventListener("open", function(e){
      textPin.setValue("");
      textPin.focus();
    });

    cancelButton.addEventListener("click", function(e){
      view.close();
    });
  }

  init();

  return view;
}

//

exports = {
  createPinWindow: createPinWindow
}