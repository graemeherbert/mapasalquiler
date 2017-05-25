var def_style = {
  fillColor: '#ffeda0',
  weight: 2,
  opacity: 1,
  color: 'white',
  dashArray: '1',
  fillOpacity: 0.8
};

var mymap;
var currentCity = 'Madrid';
var cityLookup = {
		    'Madrid':[40.45, -3.76],
		    'Barcelona':[41.4, 2.00]
};

var currentYear = '2016';
var jsonLayer = new L.GeoJSON.AJAX(["data/BarcelonaDistrictsDatosIdealista.geojson", "data/MadridDistrictsDatosIdealista.geojson"],{filter:setByCity, onEachFeature:popUp, style:getStyleForFeature});


function getStyleForFeature(f,l){
		    var yrTr= 'q'+currentYear+'4';
		    return {fillColor: getStyleColour(parseFloat(f.properties[yrTr].replace(',', '.'))),
			    weight: 2,
			    opacity: 1,
			    color: 'white',
			    dashArray: '1',
			    fillOpacity: 0.8
			   };
}

function getStyleColour(val){
                return  val > 22 ? '#e31a1c':
                        val > 19 ? '#fc4e2a':
                        val > 16 ? '#fd8d3c':
                        val > 13 ? '#feb24c':
                        val > 10 ? '#fed976':
                        val > 7  ? '#ffeda0':
                                  '#ffffcc';
};


function changeCurrentCity(newcity){
		   
		    currentCity=newcity;
		    jsonLayer.refresh();
		    mymap.setView(new L.LatLng(cityLookup[currentCity][0], cityLookup[currentCity][1]),11);
		    
};

		    
function changeCurrentYear(newyear){
		    currentYear=newyear;
		    jsonLayer.refresh();
};

// set the filter based on values from geojson file - only display elements for currently selected city
function setByCity(f,l){
		    
		    if (currentCity === f.properties.city) {
					return true;}
};


function popUp(f,l){
    var out = [];
		    if (f.properties){
					out.push("Distrito: "+f.properties['name']);
					for(key in f.properties){
							    if (new RegExp(currentYear).test(key)){
										out.push(currentYear+" T"+key.slice(-1)+": Precio m² - €"+f.properties[key]);
	
							    }
			
					}
		    }
        l.bindPopup(out.join("<br />"));
   
};



		    
$(document).ready(function(){

		    
  
		    mymap = L.map('map', {zoomControl: false});

		    // Add our zoom control manually where we want to
                    var zoomControl = L.control.zoom({
					position: 'topright'
                    });
                    mymap.addControl(zoomControl);

		     
		    // create the tile layer with correct attribution
		    var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
		    //var osm = new L.StamenTileLayer("toner", {minZoom: 4, maxZoom: 12});
		    var osm= L.tileLayer(osmUrl, {
					attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		    }).addTo(mymap);
		    mymap.setView(new L.LatLng(cityLookup[currentCity][0], cityLookup[currentCity][1]),11);
		    //mymap.addLayer(osm);

		    mymap.addLayer(jsonLayer);
		    // set the zoom limits for the map
		    mymap.options.maxZoom = 15;
		    mymap.options.minZoom = 6;

		    var legend = L.control({position: 'bottomright'});

		    legend.onAdd = function (mymap) {

					var div = L.DomUtil.create('div', 'info legend'),
					    grades = [1, 7, 10, 13, 16, 19, 22],
					    labels = [];

					// loop through our density intervals and generate a label with a colored square for each interval
					for (var i = 0; i < grades.length; i++) {
							    div.innerHTML +=
							    '<i style="background:' + getStyleColour(grades[i+1]) + '"></i> ' +
							    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
					}

					return div;
		    };

		    legend.addTo(mymap);
});




