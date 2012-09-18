/**
 * SettingsWindow
 *
 * Events: -
 *
 * @copyright 2012, Mikhail Yurasov
 */

var _ = require("lib/underscore");

var createSettingsWindow = function(options)
{
  // default options
  options = _.defaults(options || {}, {
  });

  var view;
  var buttonDone;
  var tableView;
  var swSmsAlerts;
  var swWebLog;
  var labelSmsPhone;

  function init()
  {
    buttonDone = Ti.UI.createButton({
      systemButton: Titanium.UI.iPhone.SystemButton.DONE
    });

    view = Ti.UI.createWindow({
      backgroundImage: "images/bg.png",
      backgroundRepeat: true,
//      barImage: "images/bar.png",
//      barColor: "#f5a00e",
      barColor: "#3991ea",
      title: "Settings",
      rightNavButton: buttonDone
    });

    view.add(tableView = Ti.UI.createTableView({
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
       backgroundImage: "images/bg.png",
       backgroundRepeat: true
    }));

    //

    var s1 = Ti.UI.createTableViewSection();

    var r = Ti.UI.createTableViewRow({
      title: "Send SMS alerts",
      height: 44
    });

    r.add(swSmsAlerts = Titanium.UI.createSwitch({
      value: App.Config.get("smsAlerts"),
      right: 10
    }))

    s1.add(r);

    //

    //

//    var s3 = Ti.UI.createTableViewSection();

    var r = Ti.UI.createTableViewRow({
      title: "Log Data to Web",
      height: 44
    });

    r.add(swWebLog = Titanium.UI.createSwitch({
      value: App.Config.get("webLog"),
      right: 10
    }))

    s1.add(r);

    //

    var s2 = Ti.UI.createTableViewSection();

    s2.add(Ti.UI.createTableViewRow({
       title: "SMS Phone #"
    }));

    var rowSmsPhone = Ti.UI.createTableViewRow({
      hasDetail: true
    });

    rowSmsPhone.add(labelSmsPhone = Ti.UI.createLabel({
      text: App.Config.get("smsPhone"),
      color: "#4c566c",
      textAlign: "left",
      right: 10,
      left: 10,
      height: 44
    }))

    s2.add(rowSmsPhone);

    //

    tableView.setData([s1, s2]);

    //

    buttonDone.addEventListener("click", function(e){
      view.close();
    });

    swSmsAlerts.addEventListener("change", function(e){
      App.Config.set("smsAlerts", e.value).save();
    });

    swWebLog.addEventListener("change", function(e){
      App.Config.set("webLog", e.value).save();
    });

    rowSmsPhone.addEventListener("click", function(e){
      Ti.Contacts.showContacts({
        fields: ["phone"],
        selectedProperty: function(e) {
          labelSmsPhone.text = e.value;
          App.Config.set("smsPhone", e.value).save();
        }
      });
    });
  }

  init();

  return view;
}

//

exports = {
  createSettingsWindow: createSettingsWindow
}