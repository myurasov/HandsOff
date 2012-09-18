/**
 * Events mixin
 *
 * Usage:
 *
 * EventsMixin(Object)
 * EventsMixin(Object.prototype); (this.listeners should be redefined in object constructor)
 *
 * @version 1.4
 * @copyright 2012, Mikhail Yurasov
 */

exports = function EventsMixin(obj) {
  // should be redefined in object constructor
  // when mixed to prototype
  obj.listeners = {};

  /**
   * Add event listener
   * @return {int} id of the added listener
   */
  obj.addEventListener = function (eventName, listener) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(listener);
    return this;
  };

  /**
   * Remove event listener with specifiled id
   */
  obj.removeEventListener = function (eventName, listener) {
    for (var i in this.listeners[eventName]) {
      if (this.listeners[eventName][i] === listener) {
        delete this.listeners[eventName][i];
      }
    }
  };

  /**
   * Fire an event
   */
  obj.fireEvent = function(eventName, eventData) {
    this.listeners[eventName] = this.listeners[eventName] || [];

    for (var i in this.listeners[eventName]) {
      eventData = eventData || {};
      eventData.type = eventName;
      eventData.source = this;

      // if listener returns false, pass it to event emitter and stop calling event handlers
      if (false === this.listeners[eventName][i](eventData)) {
        return false;
      }
    }

    return this;
  };
}