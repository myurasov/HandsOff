<?php

  $id = str_replace("/", "", $_SERVER['REQUEST_URI']);
  $mc = new \Memcached();
  $mc->addServer("localhost", 11211);
  $data = json_encode($mc->get($id));

  ?>

<!DOCTYPE html>
<html DIR="LTR">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"  />
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />

    <title>SafeKey</title>

    <style type="text/css">
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: "Myriad Pro", "Trebuchet MS", "Verdana", sans-serif;
      }

      #map {
        height: 100%;
      }

      #title {
        padding: .5em;
        font-size: 30pt;
        font-weigh: bold;
        position: fixed;
        z-index: 1;
        background-color: white;
        width: 100%;
        opacity: 0.85;
      }
    </style>

    <script>
      var data = <?php echo $data ?>;
  </script>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>

      <script type="text/javascript" src="/main.js"></script>

  </head>

  <body onload="sk.init()">
    <div id="title"></div>
    <div id="map"></div>
  </body>
</html>

