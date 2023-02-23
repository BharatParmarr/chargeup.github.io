
window.onload = init();


function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: [8119694.156703998, 2584657.0482620597],
            zoom: 14
        }),
        
        target: "map",

    })

    // base maps
    map.on('click', function(e){
        console.log(e.coordinate)
    })

    const openStreetMapStandard = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        title: "OSMStanderd"
    })

    const openStreetMapHumanitarion = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            
        }),
        visible: false,
        title: 'OSMHumanitarian'
    })

    const StamenTerrain = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
            attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
        }),
        visible: false,
        title: 'StamenTerrain'
    })

    const GoogleRoadMap = new ol.layer.Tile({
      
        source: new ol.source.XYZ({
          url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'
        }),
        visible: false,
        title: 'GoogleRoadMap'
    })

    // map.addLayer(openStreetMapStandard);
    // layer Group

    const baseLayerGroup = new ol.layer.Group({
      layers: [
        openStreetMapStandard,
        openStreetMapHumanitarion, 
        StamenTerrain,
        GoogleRoadMap
      ]
    })
    map.addLayer(baseLayerGroup);


    //layer switure logic
    const baseLayerElements = document.querySelectorAll('.map_choose_s > input[type=radio]');
    
    for(let baseLayerElement of baseLayerElements){
      baseLayerElement.addEventListener('change', function(){
        let baseLayerElementValue = this.value;
        baseLayerGroup.getLayers().forEach(function(element, index, array){
          let baselayerTitle = element.get('title');
          element.setVisible(baselayerTitle === baseLayerElementValue)
          console.log(baseLayerElementValue)

        }); 

      })
    }

    // vactor data application

    const fillStyle = new ol.style.Fill({
      color: [75, 50, 255, 1]
    })

    const strokestyle = new ol.style.Stroke({
      color: [229, 10, 10, 1],
      width: 1.4
    })

    // const circleStyle = new ol.style.icon({

    //   // image: '<img class="pin unselected" src="./images/pin1.png" alt="pin1" srcset="">'
      
      
    //   // fill: new ol.style.Fill({
    //   //   color: [21, 245, 21,1]
    //   // }),
    //   // radius: 7,
    //   // stroke: new ol.style.Stroke({
    //   //   color: [229, 10, 10, 1],
    //   //   width: 1.4
    //   // })
    // })

  //   var iconStyle = new ol.Style({
  //     image: new ol.style.icon(/** @type {module:ol/style/Icon~Options} */ ({
  //         anchor: [0.5, 46],
  //         anchorXUnits: 'fraction',
  //         anchorYUnits: 'pixels',
  //         src:  './images/pin1.png'

  //     }))
  // })

  var iconStyle = new ol.style.Icon({
    anchor: [0, 0],
    size: [170.7, 290],
    offset: [0,0],
    opacity: 01,
    scale: 0.3,
    src: "./images/pin_red.svg"
});



    const stateData = new ol.layer.VectorImage({
      source: new ol.source.Vector({
        url: './vactor data/map copy.geojson',
        format: new ol.format.GeoJSON()
      }),
      visible: true,
      title: 'indStateGeoJSON',
      style: new ol.style.Style({
        fill: fillStyle,
        stroke: strokestyle,
        image: iconStyle,

      })
    })
    map.addLayer(stateData)


    

    let user_location = new ol.source.Vector();

    const set_user_location  = new ol.layer.VectorImage({
      source: user_location,
      });
    

    map.addLayer(set_user_location)



    
//  finding location

navigator.geolocation.watchPosition(
  function(position){
    console.log(position)
    const coords = [position.coords.longitude, position.coords.latitude];
    const accuracy = ol.geom.Polygon.circular(coords, 4999, position.coords.accuracy);
    user_location.clear(true);
    user_location.addFeatures([
      new ol.Feature(
        accuracy.transform('EPSG:4326', map.getView().getProjection())
      ),
      new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat(coords))),
    ]);
  },
  function (error) {
    alert(`ERROR: ${error.message}`);
  },
  {
    enableHighAccuracy: true,
  }
);


// creating button for centaring

const locate = document.createElement('div');
locate.className = 'ol-control ol-unselectable locate';
locate.innerHTML = '<button class="locate_me btn button" title= "Locate me">◎</button>';
locate.addEventListener('click', function(){
  if(!user_location.isEmpty()){
    map.getView().fit(user_location.getExtent(),{
      maxZoom: 18,
      duration: 500,
    });
  }
});
map.addControl(
  new ol.control.Control({
    element: locate,
  })
);






  // vector feature pop up logic


  // const overlayercontainer1 = document.querySelector('#indicaters1');
  // const overlayLayer = new ol.Overlay({
  //   element: overlayercontainer1
  // })
  // map.addOverlay(overlayLayer);
  const overlatFeaturename = document.getElementById('featurename')
  const overlatFeatureinfo = document.getElementById('feature_add_info')
  const overlatFeatureparking = document.getElementById('featureparking')
  const overlatFeature3phaseline = document.getElementById('feature3phaseline')

  map.on('click', function(e){
    map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
      // console.log("you have clicked")
      // let clickcoordinate = e.coordinate;
      // console.log(clickcoordinate)
      
      let clickFeatureName = feature.get('TYPE OF BUILDING');
      let clickfeatureinfo = feature.get('ROOM AVAILABEL');
      let clickfeatureParking = feature.get('PARKING')
      let clickfeature3phaseline = feature.get('3 PHASE LINE')

      // overlayLayer.setPosition(clickcoordinate)
      show_side_manu()
      overlatFeaturename.innerHTML = 'Type of building:- ' + clickFeatureName + "<br>";
      overlatFeatureinfo.innerHTML = 'Room Avaiblity:- ' + clickfeatureinfo + "<br>";
      overlatFeatureparking.innerHTML = 'Parrking Available:- ' + clickfeatureParking + "<br>";
      overlatFeature3phaseline.innerHTML = '3 Phase line :- ' + clickfeature3phaseline + "<br>";

     
    })
  })
}









// this is for a object move

let indicaters_list = document.getElementById("indicaters")

  indicaters_list.onmousedown = function(event) {
  
  indicaters_list.style.position = 'absolute';
  document.body.append(indicaters_list);

 function moveAt(pageX, pageY) {
    indicaters_list.style.left = pageX - indicaters_list.offsetWidth / 2 + 'px';
    indicaters_list.style.top = pageY - indicaters_list.offsetHeight / 2 + 'px';
  }

   moveAt(event.pageX, event.pageY);

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener('mousemove', onMouseMove);

   indicaters_list.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    indicaters_list.onmouseup = null;
  };

};




    
let tool_kit = document.getElementById("toolkit")

tool_kit.onmousedown = function(event) {

tool_kit.style.position = 'absolute';
document.body.append(tool_kit);

function moveAt(pageX, pageY) {
  tool_kit.style.left = pageX - tool_kit.offsetWidth / 2 + 'px';
  tool_kit.style.top = pageY - tool_kit.offsetHeight / 2 + 'px';
}

 moveAt(event.pageX, event.pageY);

function onMouseMove(event) {
  moveAt(event.pageX, event.pageY);
}

document.addEventListener('mousemove', onMouseMove);

 tool_kit.onmouseup = function() {
  document.removeEventListener('mousemove', onMouseMove);
  tool_kit.onmouseup = null;
};

};


// hide side manu

function hide_side_manu(){
  let manu = document.getElementById('indicaters1')
  manu.style.display = "none";
}

var btn = document.getElementById("myBtn");
function show_side_manu(){
  let manu = document.getElementById('indicaters1')
  manu.style.display = "block";
  btn.click()
}





// code for pop up in movile

var modal = document.getElementById("indicaters1");

// Get the button that opens the modal

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close");

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}








// let latitude1;
// let longitude1;
// function longitude(position){
//   const {latitude, longitude}= position.coords;
  
// } ;

// function get_cordinates() {
//   navigator.geolocation.getCurrentPosition(longitude, console.log)
  
// }
// get_cordinates()


// layers: [
        //     new ol.layer.Tile({
        //         source: new ol.source.OSM()
        //     })
        // ],