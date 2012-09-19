var sk = {

  map: null,
  marker: null,
  mapInitDone: false,
  lastData: null,
  updatingLocation: false,


  init: function(){
    sk.showMap();
  },

  //

  showMap: function(){
    var pos = new google.maps.LatLng(
      data.lat, data.lon);

    $("#title").text("Speed is: " + Math.max(Math.round(data.speed/1.6), 0) + " mph");

    if (!sk.mapInitDone)
    {
      sk.mapInitDone = true;

      var mapOptions = {
        zoom: 16,
        center: pos,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        panControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        scaleControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_LEFT
        },
        streetViewControl: false
      }

      sk.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      sk.marker = new google.maps.Marker({
        position: pos,
        map: sk.map
      });
    }
    else
    {
      sk.map.setCenter(pos);
      sk.marker.setPosition(pos);
    }
  }

};

var Utils = {

  trim: function(str)
  {
    if (typeof str == "string")
    {
      str = str.replace(/^\s+/, '');

      for (var i = str.length - 1; i >= 0; i--)
      {
        if (/\S/.test(str.charAt(i)))
        {
          str = str.substring(0, i + 1);
          break;
        }
      }
    }

    return str;
  }
}