//Calling on the map and MapView functions
require([
	"esri/Map",
	"esri/views/MapView",
	"esri/layers/CSVLayer",
	"esri/widgets/Locate",
	"esri/widgets/Search",
	"esri/layers/GroupLayer",
	"esri/layers/MapImageLayer",
	"esri/widgets/LayerList",
	"esri/layers/FeatureLayer"
	],

//Declaring the functions Map and MapView for the basemap
function(Map, MapView, CSVLayer, Locate, Search, GroupLayer, MapImageLayer, LayerList, FeatureLayer){

	var url = "data/food-scores.csv";

	var template = {
		title: "Restaurant Information",
		fieldInfos: [{
			fieldName: "Name",
			label: "Restaurant Name",
			visible: true,
			}, {
			fieldName: "Address",
			label: "Address",
			visible: false,
			}, {
			fieldName: "Aggregate_Score",
			label: "Average Score",
			visible: true,
			}, {
			fieldName: "Date",
			label: "Inspection Date",
			visible: false,
			}, {
			fieldName: "Score",
			label: "Score",
			visible: true,
			}],
		content:
		"<b>Restaurant Name:</b> {Name}" +
		"<br><b>Address:</b> {Address}" +
		"<br><b>Average Score:</b> {Aggregate_Score}" +
		"<br><b>Inspection Date:</b> {Date}" +
		"<br><b>Score:</b> {Score}"
	};


	var csvLayer = new CSVLayer ({
		url: url,
		title: "Food Inspection Scores",
		popupTemplate: template
	});

	csvLayer.renderer = {
		type: "simple",
    symbol: {
      type: "simple-marker", // autocasts as a new simple marker symbol
			size: 7,
			color: "red",
			style: "circle",
        }
      };


//Feature Layers//

	// Create layer showing sample census county data of the United States.

	var censusCounty = new FeatureLayer({
		url: "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/US_Census_Housing/FeatureServer/1",
		title: "US Counties"
		});

	// Create layer showing sample census tract data of the United States.

	var censusTract = new FeatureLayer({
		url: "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/US_Census_Housing/FeatureServer/2",
		title: "US Census Tract"
	});

	// Create layer showing sample census block data of the United States.

	var censusBlock = new FeatureLayer({
		url: "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/US_Census_Housing/FeatureServer/3",
		title: "US Census Block"
	});

	// Create GroupLayer with the two MapImageLayers created above as children layers.

var demographicGroupLayer = new GroupLayer({
	title: "US Demographics",
	visible: false,
	layers: [censusCounty, censusTract, censusBlock],
	opacity: 0.75
});

	//Declaring the JavaScript variable map. It assigns values to the basemap of streets.
	var map = new Map({
		basemap: "streets",
		layers: [csvLayer, demographicGroupLayer]
	});


//Declaring the JavaScript variable view. It assigs map to the the viewDiv container, with a zoom of 10 and setting the center of the map on Los Angeles.
	var view = new MapView({
		container: "theMap",
			map: map,
			zoom: 12,
			center: [-97.7431, 30.2672]
			});


// Creates actions in the LayerList.


			function defineActions(event) {

		         // The event object contains an item property.
		         // is is a ListItem referencing the associated layer
		         // and other properties. You can control the visibility of the
		         // item, its title, and actions using this object.

		         var item = event.item;

		         if (item.title === "US Demographics") {

		           // An array of objects defining actions to place in the LayerList.
		           // By making this array two-dimensional, you can separate similar
		           // actions into separate groups with a breaking line.

		           item.actionsSections = [
		             [{
		               title: "Go to full extent",
		               className: "esri-icon-zoom-out-fixed",
		               id: "full-extent"
		             }, {
		               title: "Layer information",
		               className: "esri-icon-description",
		               id: "information"
		             }],
		             [{
		               title: "Increase opacity",
		               className: "esri-icon-up",
		               id: "increase-opacity"
		             }, {
		               title: "Decrease opacity",
		               className: "esri-icon-down",
		               id: "decrease-opacity"
		             }]
		           ];
		         }
		       }

		       view.when(function() {

		         // Create the LayerList widget with the associated actions
		         // and add it to the top-right corner of the view.

		         var layerList = new LayerList({
		           view: view,
		           // executes for each ListItem in the LayerList
		           listItemCreatedFunction: defineActions
		         });

		         // Event listener that fires each time an action is triggered

		         layerList.on("trigger-action", function(event) {

		           // The layer visible in the view at the time of the trigger.
		           var visibleLayer = USALayer.visible ?
		             USALayer : censusCounty;

		           // Capture the action id.
		           var id = event.action.id;

		           if (id === "full-extent") {

		             // if the full-extent action is triggered then navigate
		             // to the full extent of the visible layer
		             view.goTo(visibleLayer.fullExtent);

		           } else if (id === "information") {

		             // if the information action is triggered, then
		             // open the item details page of the service layer
		             window.open(visibleLayer.url);

		           } else if (id === "increase-opacity") {

		             // if the increase-opacity action is triggered, then
		             // increase the opacity of the GroupLayer by 0.25

		             if (demographicGroupLayer.opacity < 1) {
		               demographicGroupLayer.opacity += 0.25;
		             }
		           } else if (id === "decrease-opacity") {

		             // if the decrease-opacity action is triggered, then
		             // decrease the opacity of the GroupLayer by 0.25

		             if (demographicGroupLayer.opacity > 0) {
		               demographicGroupLayer.opacity -= 0.25;
		             }
		           }
		         });

		         // Add widget to the top right corner of the view
		         view.ui.add(layerList, "top-right");
		       });


/**************
	All Widgets added below
**************/

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
						"searchWidget",
						"locateBtn"
          ];
        }
        else {
          ui.components = [
            "zoom",
						"searchWidget",
						"locateBtn"
          ];
        }
      });


//last code to make the map work -- paste above
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
};

//Date and Time function in the Footer //

// Date
var currentDate = new Date();
var	day = currentDate.getDate();
var	month = currentDate.getMonth() + 1;
var	year = currentDate.getFullYear();

// Time
var currentTime = new Date();
var	hours = currentTime.getHours() > 12 ? currentTime.getHours() - 12 : currentTime.getHours();;
var am_pm = currentTime.getHours() >= 12 ? "PM" : "AM";
var	minutes = currentTime.getMinutes();
		if (minutes < 10) {
		var	minutes = "0" + minutes;
			}
	document.getElementById("time").innerHTML=(month + "/" + day + "/" + year + "-" + hours + ":" + minutes + am_pm);

////////End Date and Time function////////////
