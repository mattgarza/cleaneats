//Calling on the map and MapView functions
require([
	"esri/Map",
	"esri/views/MapView",
	"esri/layers/CSVLayer",
	"esri/core/urlUtils",
	"esri/widgets/Locate",
	"esri/widgets/Search"
	],
//Declaring the functions Map and MapView for the basemap
function(Map, MapView, CSVLayer, urlUtils, Locate, Search){
	
	var url = "https://data.austintexas.gov/resource/nguv-n54k.csv";
	
	var template = {
		title: "Food Scores",
		Name: "restaurant_name",
		Address: "address_address",
		Score: "score",
	};
	
	var csvLayer = new CSVLayer ({
		url: url,
		popupTemplate: template,
		latitudeField: "address",
		longitudeField: "address",
		});
		
	csvLayer.renderer = {
		type: "simple",
      	symbol: {
          type: "point-3d", // autocasts as new PointSymbol3D()
          symbolLayers: [{
            type: "icon", // autocasts as new IconSymbol3DLayer()
            material: {
              color: [238, 69, 0, 0.75]
            },
            outline: {
              width: 0.5,
              color: "white"
            },
            size: "12px"
          }]
        }
      };
	
	
	//Declaring the JavaScript variable map. It assigns values to the basemap of streets.
	var map = new Map({
		basemap: "streets",
		layers: [csvLayer]	
	});
//Declaring the JavaScript variable view. It assigs map to the the viewDiv container, with a zoom of 10 and setting the center of the map on Los Angeles.
	var view = new MapView({
		container: "theMap",
			map: map,
			zoom: 12, 
			center: [-97.7431, 30.2672]
			});



      var locateBtn = new Locate({
        view: view
      });

      // Add the locate widget to the top left corner of the view
      view.ui.add(locateBtn, {
        position: "top-left"
      });


    var searchWidget = new Search({
    	view: view
    });

	// Add the search widget to the top right corner of the view
	view.ui.add(searchWidget, {
    	position: "top-right"
    });
    
    
      // clear the view's default UI components if app is used on a small device
      view.watch("heightBreakpoint, widthBreakpoint", function() {
        var ui = view.ui;

        if (view.heightBreakpoint === "xsmall" || view.widthBreakpoint ===
          "xsmall") {
          ui.components = [
            "attribution"
          ];
        }
        else {
          ui.components = [
            "zoom"
          ];
        }
      });
    

	});
	
	
function myFunction() {
	var x = document.getElementById("myTopnav");
          if (x.className === "topnav") {
              x.className += " responsive";
            } else {
                x.className = "topnav";
                }
            }
        
function openNav() {
	document.getElementById("mySidenav").style.width = "250px";
            }

function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
            }
            