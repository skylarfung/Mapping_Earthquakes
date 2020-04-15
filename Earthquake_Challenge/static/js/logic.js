// Add console.log to check to see if our code is working.
console.log("working");

// Create street map view
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create satalite map view
let satStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create light map view
let light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});


// Create a base layer that holds both maps.
let baseMaps = {
    Streets: streets,
	Satellite: satStreets,
	Light: light
};

// Create the layers for our map.
let earthquakes = new L.layerGroup();
let techPlates = new L.layerGroup();

// We define an object that contains the overlays.
let overlays = {
	Earthquakes: earthquakes,
	"Tectonic Plates": techPlates 
};

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [39.5, -98.5],
	zoom: 3,
	layers: [streets]
})

// Control over the overlay
L.control.layers(baseMaps, overlays).addTo(map);

// Gets radius of earthquake
function getRadius(magnitude) {		
	if (magnitude === 0) {
	return 1;
	}
	return magnitude * 4;
}

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
	// console.log(data);

	// Gets color based on magnitude
	function getColor(magnitude) {
		if (magnitude > 5) {
		  return "#ea2c2c";
		}
		if (magnitude > 4) {
		  return "#ea822c";
		}
		if (magnitude > 3) {
		  return "#ee9c00";
		}
		if (magnitude > 2) {
		  return "#eecc00";
		}
		if (magnitude > 1) {
		  return "#d4ee00";
		}
		return "#98ee00";
	}

	// Earthquake style
	function styleInfo(feature) {
		return {
	  	opacity: 1,
	  	fillOpacity: 1,
	  	fillColor: getColor(feature.properties.mag),
	  	color: "#000000",
	  	radius: getRadius(feature.properties.mag),
	  	stroke: true,
	 	weight: 0.5
		};
	}

	// Creating a GeoJSON layer with the retrieved data.
  	L.geoJson(data, {
		style: styleInfo,
		pointToLayer: function(feature, latlng) {
			// console.log(data);
			return L.circleMarker(latlng);
		},
		onEachFeature: function(feature, layer) {
			layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
		}
	}).addTo(earthquakes);
	earthquakes.addTo(map);	  

	// Create a legend control object.
	let legend = L.control({position: "bottomright"});
	  
	// Then add all the details for the legend.
	legend.onAdd = function() {
	let div = L.DomUtil.create("div", "info legend");
	
	const magnitudes = [0, 1, 2, 3, 4, 5];
	const colors = [
		"#98ee00",
  		"#d4ee00",
  		"#eecc00",
  		"#ee9c00",
  		"#ea822c",
  		"#ea2c2c"
	];

	// Looping through our intervals to generate a label with a colored square for each interval.
	for (var i = 0; i < magnitudes.length; i++) {
		div.innerHTML +=
			'<i style="background:' + colors[i] + '"></i>' +
			magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
	}
	return div;
};

legend.addTo(map);

});

d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(data){
	// console.log(data);

	function styleInfo(feature) {
		return {
			color: "red",
			weight: 2,
		};
	}

	L.geoJson(data , {
		style: styleInfo,
		onEachFeature: function(feature, layer) {
			// console.log(layer)
			layer.bindPopup("Name: " + feature.properties.Name);
		}
	}).addTo(techPlates);
	techPlates.addTo(map);
});