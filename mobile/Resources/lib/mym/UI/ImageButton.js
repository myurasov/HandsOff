/**
 * ImageButton
 *
 * Events:
 *
 *   _click {id, value}
 *
 * @copyright 2012, Mikhail Yurasov
 */

var _ = require("lib/underscore");
var Utils = require("lib/mym/Utils");

var TYPE_BUTTON = 0;
var TYPE_TOGGLE = 1;

var createImageButton = function(options)
{
  // default options
  options = _.defaults(options || {}, {
    top: null,
    left: null,
    bottom: null,
    right: null,
    height: null,
    width: null,
    image: null,
    id: null,
    type: TYPE_BUTTON,
    value: false,
    lockActive: false
  });

  var view;

  function init()
  {
    view = Ti.UI.createView({
      top: options.top,
      left: options.left,
      bottom: options.bottom,
      right: options.right,
      width: options.width,
      height: options.height
    });

    if (options.type == TYPE_BUTTON) { // button
      showInactiveState();

      view.addEventListener("touchstart", function(e){
        showActiveState();
      });

      view.addEventListener("touchend", function(e){

        if (Utils.eventIsInsideView(e)) {
          view.fireEvent("_click", {
            id: options.id
          });
        }

        showInactiveState();
      });

      view.addEventListener("touchmove", function(e){
        Utils.eventIsInsideView(e) ? showActiveState() : showInactiveState();
      });

      view.addEventListener("touchcancel", function(){
        showInactiveState();
      });
    }
    else if (options.type == TYPE_TOGGLE) { // toggle
      showToggleState();

      view.addEventListener("touchstart", function(e){
        if (!options.lockActive) {
          showToggleState(true);
        }
      });

      view.addEventListener("touchend", function(e){
        if (!options.lockActive) {

          if (Utils.eventIsInsideView(e)) {
            options.value = !options.value;
            view.fireEvent("_click", {
              id: options.id,
              value: options.value
            });
          }

          showToggleState();
        }
      });

      view.addEventListener("touchmove", function(e){
        if (!options.lockActive) {
          Utils.eventIsInsideView(e)
            ? showToggleState(true) : showToggleState();
        }
      });
    }
  }

  function showToggleState(inverted)
  {
    if (options.lockActive) {
      showActiveState();
    }
    else if (inverted) {
      options.value ? showInactiveState() : showActiveState();
    }
    else {
      options.value ? showActiveState() : showInactiveState();
    }
  }

  function showInactiveState()
  {
    if (view.backgroundImage != options.image) {
      view.backgroundImage = options.image;
    }
  }

  function showActiveState()
  {
    if (view.backgroundImage != options.imageActive) {
      view.backgroundImage = options.imageActive;
    }
  }

  init();

  view.setLockActive = function(val)
  {
    if (options.type == TYPE_TOGGLE) {
      options.lockActive = val ? true : false;
      showToggleState();
    }
  }

  return view;
}

//

exports = {
  createImageButton: createImageButton,
  TYPE_BUTTON: TYPE_BUTTON,
  TYPE_TOGGLE: TYPE_TOGGLE
}