    /**
 * Display clustered markers on a map
 *
 * Note that the maps clustering module http://js.api.here.com/v3/3.0/mapsjs-clustering.js
 * must be loaded to use the Clustering

 * @param {H.Map} map A HERE Map instance within the application
 * @param {Array.<Object>} data Raw data that contains airports' coordinates
 */
function startClustering(map, data) {
  // First we need to create an array of DataPoint objects,
  // for the ClusterProvider
  var dataPoints = data.map(function (item) {
    return new H.clustering.DataPoint(item.latitude, item.longitude);
  });

  // Create a clustering provider with custom options for clusterizing the input
  var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
    clusteringOptions: {
      // Maximum radius of the neighbourhood
      eps: 32,
      // minimum weight of points required to form a cluster
      minWeight: 2
    }
  });

  // Create a layer tha will consume objects from our clustering provider
  var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);

  // To make objects from clustering provder visible,
  // we need to add our layer to the map
  map.addLayer(clusteringLayer);
}


/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  app_id: 'devportal-demo-20180625',
  app_code: '9v2BkviRwi9Ot26kp2IysQ',
  useHTTPS: true
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

// Step 2: initialize a map
var map = new H.Map(document.getElementById('map'), defaultLayers.normal.map, {
  center: new H.geo.Point(-25.747868, 28.229271),
  zoom: 8,
  pixelRatio: pixelRatio
});

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));


// Step 4: create the default UI component, for displaying bubbles
var ui = H.ui.UI.createDefault(map, defaultLayers);

    function addMarkerToGroup(group, coordinate, html) {
        var pngIcon = new H.map.Icon("https://cdn.pixabay.com/photo/2017/03/30/13/33/html-2188441_960_720.png", {size: {w: 62, h: 50}});      
      var marker = new H.map.Marker(coordinate, {icon: pngIcon});
      // add custom data to the marker
      marker.setData(html);
      group.addObject(marker);
    }

 function addInfoBubble(map) {
      var group = new H.map.Group();
      //var pngIcon = new H.map.Icon("https://cdn0.iconfinder.com/data/icons/daily-boxes/150/phone-box-32.png");      
    
      map.addObject(group);
    
      // add 'tap' event listener, that opens info bubble, to the group
      group.addEventListener('tap', function (evt) {
        // event target is the marker itself, group is a parent event target
        // for all objects that it contains
        var bubble =  new H.ui.InfoBubble(evt.target.getPosition(), {
          // read custom data
          content: evt.target.getData()
        });
        // show info bubble
        ui.addBubble(bubble);
      }, false);
     
     var array = [{"lat":"-25.752262", "lng":"28.263748", "name":"Code Tribe", "who":"varsity", "province":"Gauteng", "website":"www.o", "focus":"mobile apps"}]

      var i;
  for (i=0; array.length; i++) {
        addMarkerToGroup(group, {lat:array[i].lat, lng:array[i].lng},
        '<div  class="dl-info"><a >' + array[i].name + ', ' + array[i].province + '</a></div>');
   }
}

    addInfoBubble(map);


// Step 5: request a data about airports's coordinates
jQuery.getJSON('data/airports.json', function (data) {
  startClustering(map, data);
});