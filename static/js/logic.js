
var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var grayscale = L.tileLayer('https://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=YOUR_MAPBOX_ACCESS_TOKEN', {
    attribution: 'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
    // Add your Mapbox access token to access satellite imagery
});

// Create a map
var myMap = L.map("map", {
    center: [10, 40],
    zoom: 3,
    layers: [streets] // Default basemap
});

// Create a basemap control
var basemaps = {
    "Streets": streets,
    "Grayscale": grayscale,
    "Satellite": satellite
};

L.control.layers(basemaps).addTo(myMap);

// Adding the default basemap to the map
streets.addTo(myMap);
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// URL for tectonic plates GeoJSON data
let tectonicPlatesURL = 'path/to/tectonic-plates.geojson';

// Create a new layer group for tectonic plates
let tectonicPlatesLayer = L.layerGroup().addTo(myMap);

// Fetch tectonic plates data and add it to the map
fetch(tectonicPlatesURL)
    .then(response => response.json())
    .then(function (tectonicPlatesData) {
        // Create a GeoJSON layer for tectonic plates
        L.geoJSON(tectonicPlatesData, {
            style: function (feature) {
                return {
                    color: 'red', // Customize the color of tectonic plates
                    weight: 2
                };
            }
        }).addTo(tectonicPlatesLayer);
    });


// Create a layer group to hold the earthquake markers
let earthquakeLayer = L.layerGroup().addTo(myMap);

// Define a color scale for depth
function getColor(depth) {
    // Customize the color scale based on your preferences
    return  depth > 90 ? '#21068f':
            depth > 70 ? '#800026' :
            depth > 50 ? '#BD0026' :
            depth > 30 ? '#E31A1C' :
            depth > 10 ? '#FC4E2A' :
                    '#FFEDA0';
}

// Get the earthquake data with fetch.
fetch(url)
    .then(response => response.json())
    .then(function(response) {
        // Loop through the earthquake features and add markers to the layer
        response.features.forEach(function(earthquake) {
            let coordinates = earthquake.geometry.coordinates;
            let magnitude = earthquake.properties.mag;
            let depth = coordinates[2];

            // Customize the marker options based on depthy
            let markerOptions = {
                radius: magnitude * 5, 
                fillColor: getColor(depth),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            // Create a circle marker and add it to the layer
            L.circleMarker([coordinates[1], coordinates[0]], markerOptions)
                .bindPopup('Magnitude: ' + magnitude + '<br>Depth: ' + depth)
                .addTo(earthquakeLayer);
        });

        // After adding earthquake markers, call addLegend
        addLegend();
    });

// Add Legend
function addLegend() {
    // Assuming you have a <div> element with the id 'legend' in your HTML
    let legend = document.getElementById('legend');

    // Clear existing legend content
    legend.innerHTML = '';

    // Your logic for creating legend items based on marker colors
    // You might need to access the color information from your marker creation logic
    // For example, if you have an array of colors used in markers, you can loop through it
    let colors = ['#21068f', '#800026', '#BD0026', '#E31A1C', '#FC4E2A', '#FFEDA0'];
    let dataLabels = [' Label 90+', ' 70-90', ' 50-70', ' 30-50', ' 10-30' , '-10-10'];

    colors.forEach((color, index) => {
        let legendItem = document.createElement('div');
        legendItem.innerHTML = `
            <span class="legend-color" style="background-color: ${color};"></span>
            <span class="legend-label">${dataLabels[index]}</span>
        `;
            // Apply CSS styles directly to the legend items
            legendItem.style.fontFamily = 'Arial, sans-serif';
            legendItem.style.fontSize = '12px';
            legendItem.style.fontWeight = 'bold';

        legend.appendChild(legendItem);
    });

    // Add CSS styles to position the legend in the bottom right
    legend.style.position = 'absolute';
    legend.style.bottom = '35px';
    legend.style.right = '50px';

    // Set z-index to a higher value than the map to ensure it appears above
    legend.style.zIndex = '1500';  // Adjust this value as needed
}

// Call the addLegend function to update the legend based on the data
addLegend();
