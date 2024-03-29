var map = L.map('map').setView([46.53, 6.63], 14);
var publicToken = 'pk.eyJ1IjoidG9rb25vbW8iLCJhIjoiY2toaTY1M3Y0MG9qNDJzcDlnbzJoZTI4ZyJ9.FwqCfi82ZxqeitStLwtkWA';

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + publicToken, {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: publicToken
}).addTo(map);



var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var on = false
var greenMarker;

function highlightMarker(position) {
    if (on) {
        map.removeLayer(greenMarker)
    }
    greenMarker = new L.marker(position, { icon: greenIcon }).addTo(map);
    map.addLayer(greenMarker);
    on = true;
}

function fillSelectedFields(latlng) {
    key = latlng["lat"].toString() + latlng["lng"].toString();
    document.getElementById("selected_street").innerHTML = markers_data.get(key)[0];
    document.getElementById("selected_forname").innerHTML = markers_data.get(key)[1];
    document.getElementById("selected_name").innerHTML = markers_data.get(key)[2];
    document.getElementById("selected_job").innerHTML = markers_data.get(key)[3];
}


var data;
$.getJSON("https://JanMaxime.github.io/data.json", function(json) {
    data = json
});

var job;
var street;
var forname;
var name_;
var layerGroup = L.layerGroup().addTo(map);

markers_data = new Map();

function custom_search() {
    layerGroup.clearLayers();
    layerGroup = L.layerGroup().addTo(map);

    var input_street = $("#input_street").val()
    var input_owner_forname = $("#input_owner_forname").val()
    var input_owner_name = $("#input_owner_name").val()
    var input_job = $("#input_job").val()

    /**
        console.log(input_street)
        console.log(input_owner_forname)
        console.log(input_owner_name)
        console.log(input_job)
     */

    for (var i = 0; i < data.length; i++) {
        if ((data[i]["street"] == input_street || input_street == "") &&
            (data[i]["name"] == input_owner_name || input_owner_name == "") &&
            (data[i]["forname"] == input_owner_forname || input_owner_forname == "") &&
            (data[i]["job"] == input_job || input_job == "")) {

            markers_data.set(data[i]["position"][0].toString() + data[i]["position"][1].toString(), [data[i]["street"], data[i]["name"], data[i]["forname"], data[i]["job"]])
            L.marker(data[i]["position"]).addTo(layerGroup).on('click', function(e) {
                map.setView(e.latlng);
                highlightMarker(e.latlng);
                fillSelectedFields(e.latlng);
            });
        }
    }
}

document.getElementById("searchButton").addEventListener("click", custom_search, false)