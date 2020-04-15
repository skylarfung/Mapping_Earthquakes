// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
    Streets: streets,
    Satellite: satStreets
};

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

// We define an object that contains the overlays.
let overlays = {
	Earthquakes: earthquakes
};

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [39.5, -98.5],
	zoom: 3,
	layers: [streets]
})

// Control over the overlay
L.control.layers(baseMaps, overlays).addTo(map);

// Earthquake style
function styleInfo(feature) {
	return {
	  opacity: 1,
	  fillOpacity: 1,
	  fillColor: "#ffae42",
	  color: "#000000",
	  radius: getRadius(),
	  stroke: true,
	  weight: 0.5
	};
}

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
	console.log(data);

	// Gets radius of earthquake
	function getRadius(magnitude) {		
	if (magnitude === 0) {
	return 1;
	}
	return magnitude * 4;
	}

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
});




// // Accessing airport GeoJSON URL
// let torontoHoods = "https://raw.githubusercontent.com/skylarfung/Mapping_Earthquakes/master/torontoNeighborhoods.json"

// // Create a style for lines
// let lineStyle = {
//     weight: 1,
//     fillColor: "yellow"
// };

// // Grabbing our GeoJSON data.
// d3.json(torontoHoods).then(function(data) {
//     console.log(data);

//     // Creating a GeoJSON layer with the retrieved data.
//     L.geoJson(data , {
//         style: lineStyle,  
//         onEachFeature: function(feature, layer) {
//             console.log(layer);
//             layer.bindPopup("<h2>" + "Neighborhood: " + feature.properties.AREA_NAME + "</h2>")
//         }
//     })
//     .addTo(map);
// });



