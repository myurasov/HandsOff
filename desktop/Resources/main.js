
var App = function () {
  EventsMixin(this);

  var self = this;
  var phoneConnected = false;
  var fp;
  var engine;
  var ding;
  var errsnd;

  function init () {
    setInterval(self.updateConnectionStatus, 1000);

    fp = new FP(".panel.b");
    fp.off();

    engine = new Engine(".panel.c");
    engine.off();

    //

    ding = Titanium.Media.createSound("ding.wav");
    errsnd = Titanium.Media.createSound("error.wav");

    // connection
    self.addEventListener("status", function (e) {
      showStatus(e);

      // reset engine warning
      if (e.status) {
        fp.on();

        if (engine.isOn) {
          engine.on();
        }
      } else {
        fp.off(true);
      }
    });

    // fuel pump events
    fp.addEventListener("change", function (e) {
      if (!e.status) {
        engine.warn();
      };
    });

    // engine events
    engine.addEventListener("change", function (e) {
      if (!e.status) {
        errsnd.play();
      }
    });

    // start engine button events
    $(".startEngine").click(function () {
      if (phoneConnected) {
        engine.on();
      } else {
        blinkStatus(true);
      }
    });

    //

    self.updateConnectionStatus();
  }

  function blinkStatus (force) {
    if (engine.isOn || force) {
      $(".statusIndicator")
        .fadeOut(200).fadeIn(200);
      ding.play();
    }
  }

  function showStatus(e) {
    var text = "";
    var status = "";

    phoneConnected = e.status;

    if (e.phone) {
      if (e.status) {
        text = "Phone Connected";
        status = "ok";
      } else {
        text = "Wrong Phone";
        status = "wrong";
      }
    } else {
      text = "Phone Disconnected";
      status = "err";
    }

    if (!e.status) {
      blinkStatus();
    }

    $(".panel.a span").text(text);
    $(".statusIndicator")
      .css("background-image",
        "url(images/status-" + status + ".png)");
  }

  /**
   * Get status of connection
   */
  self.updateConnectionStatus = function () {
    var statusCmd = Titanium.Process.createProcess({
      args: ['sh', '/Users/misha/Documents/Titanium Studio Workspace/ATTH/Resources/status']
    });

    statusCmd.onReadLine = function (data) {
      data = data.toString().split(" ");
      self.fireEvent("status", {
        phone: parseInt(data[0]) != 0,
        status: parseInt(data[1]) != 0
      });
    };

    statusCmd.launch();
  }

  init();
};

var FP = function (element) {
  EventsMixin(this);

  var self = this;
  self.isOn = false;
  var offTimeout = false;

  self.on = function () {
    clearTimeout(offTimeout);
    offTimeout = false;

    if (!self.isOn) {
      $(".fpIndicator", element)
        .css("background-image", "url(/images/fp-on.png)");
      $("span", element).text("On");
      self.isOn = true;
      self.fireEvent("change", {
        status: self.isOn
      });
    }
  };

  function off() {
    $(".fpIndicator", element)
      .css("background-image", "url(/images/fp-off.png)");
     $("span", element).text("Off");
     self.isOn = false;
     self.fireEvent("change", {
       status: self.isOn
     });
  };

  self.off = function (delayed) {
    if (self.isOn) {
      if (delayed) {
        if (!offTimeout) offTimeout = setTimeout(off, 5000);
      } else {
        off();
      }
    }
  };
};

var Engine = function (element) {
  EventsMixin(this);
  var self = this;
  var t = false;
  var w = false;

  var engsnd = Titanium.Media.createSound("engine.wav");
  engsnd.setLooping(true);

  self.isOn = false;

  self.on = function () {
    clearTimeout(t);
    t = false;
    if (!self.isOn || w) {
      w = false;
      $(".engine", element)
        .css("background-image", "url(/images/engine-on.png)");
      $("span", element).text("Started");
      self.isOn = true;
      self.fireEvent("change", {
        status: self.isOn
      });
      engsnd.play();
    }
  };

  self.warn = function () {
    if (self.isOn) {
      w = true;
      $(".engine", element)
        .css("background-image", "url(/images/engine-warn.png)");
      $("span", element).text("Warning");
      if (!t) t = setTimeout(self.off, 3000);
    }
  };

  self.off = function () {
    if (self.isOn) {
      w = false;
      $(".engine", element)
        .css("background-image", "url(/images/engine-off.png)");
       $("span", element).text("Stopped");
       self.isOn = false;
        self.fireEvent("change", {
          status: self.isOn
        });
        engsnd.stop();
    }
  }
};

///

$(window).ready(function () {
  var app = new App();
});