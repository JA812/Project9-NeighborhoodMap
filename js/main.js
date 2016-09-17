//Searchable locations in Atlanta
var atlantaLocations = [{
    "name": "Midtown",
    "lat": 33.786801,
    "lng": -84.379517,
    "wikiPageName": "Midtown_Atlanta"
}, {
    "name": "Buckhead",
    "lat": 33.83942,
    "lng": -84.37992,
    "wikiPageName": "Buckhead"
}, {
    "name": "Downtown",
    "lat": 33.755,
    "lng": -84.39,
    "wikiPageName": "Downtown_Atlanta"
}, {
    "name": "Inman Park",
    "lat": 33.755556,
    "lng": -84.359444,
    "wikiPageName": "Inman_Park"
}, {
    "name": "West End",
    "lat": 33.737778,
    "lng": -84.423056,
    "wikiPageName": "West_End,_Atlanta"
}, {
    "name": "West Midtown",
    "lat": 33.785917,
    "lng": -84.411222,
    "wikiPageName": "West_Midtown"
}, {
    "name": "Old Fourth Ward",
    "lat": 33.75431,
    "lng": -84.372149,
    "wikiPageName": "Old_Fourth_Ward"
}, {
    "name": "East Atlanta",
    "lat": 33.74001,
    "lng": -84.34546,
    "wikiPageName": "East-Atlanta"
}, {
    "name": "Kirkwood",
    "lat": 33.76054,
    "lng": -84.32415,
    "wikiPageName": "Kirkwood,_Atlanta"
},
{
    "name": "Cabbagetown",
    "lat": 33.749722,
    "lng": -84.366389,
    "wikiPageName": "Cabbagetown,_Atlanta"
}];

//Wikipedia API and Error Handling
function loadData(location) {
//Code Example followed from Intro to Ajax "Error Handling with JSON P: "Whttps://classroom.udacity.com/nanodegrees/nd001/parts/00113454014/modules/271165859175460/lessons/3310298553/concepts/31621285920923#
    var wikiRequestTimeOut = setTimeout(function() {
        alert("Oops, something went wrong. Try again.");
    }, 4000);

    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + location.wikiPageName + "&format=json&callback=wikiCallback;"

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response) {
            var articleList = response[1];
            var url = "http://en.wikipedia.org/wiki/" + articleList[0];
            location.url = url
            location.extract = response[2]
            //Clear TimeOut so data loads, if no error
            clearTimeout(wikiRequestTimeOut);
        }
    });
};

//Google MapsAPI
var map;
//Set TimeOut
var googleMapsTimeout = setTimeout(function() {
    if (!window.google || !window.google.maps) {
        $('p').append("Oops, something went wrong. Try again.");
    }
}, 5000);

function initMap() {

//new map style from snazzymaps
  var styles = [{"featureType":"all","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#f2eede"},{"saturation":"100"},{"lightness":"94"},{"gamma":"10.00"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"simplified"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#8b6527"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#f2eede"},{"gamma":"1"}]},{"featureType":"landscape","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"color":"#8b6527"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#8b6527"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#8b6527"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#8b6527"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"color":"#8b6527"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#8b6527"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#8b6527"},{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#8b6527"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#5e8aba"},{"visibility":"on"},{"lightness":"0"},{"saturation":"0"},{"gamma":"1.4"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#8b6527"}]}];

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 33.749081,
            lng: -84.394521
        },
        zoom: 12,
        styles: styles,
    });

    var isDraggable = $(document).width() > 480 ? true : false;
    var mapOptions = {
        draggable: isDraggable,
        scrollwheel: false,
        panControl: true
    };

map.setOptions(mapOptions);

    //Run ViewModel
    ko.applyBindings(new LocationViewModel());

  //Clear TimeOut
    clearTimeout(googleMapsTimeout);
}

//ViewModelFunction
var LocationViewModel = function() {

    var self = this;

    self.locations = ko.observableArray(atlantaLocations);

    self.locations().forEach(function(location) {
        loadData(location);
    });

    var largeInfoWindow = new google.maps.InfoWindow();

    self.locations().forEach(function(location) {

        var marker = new google.maps.Marker({
            map: map,
            position: {
                lat: location.lat,
                lng: location.lng
            },
            title: location.name,
            animation: google.maps.Animation.DROP
        });
        location.marker = marker;

        marker.addListener('click', function() {

            self.wikiInfoWindow(marker, largeInfoWindow, location);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                location.marker.setAnimation(null);
            }, 700);
        });
    });

    //Display InfoWindow content and source
    self.wikiInfoWindow = function(marker, infowindow, location) {
            infowindow.marker != marker
            infowindow.marker = marker;
            infowindow.setContent("<div><b><a target='_blank' href='" + location.url + "'>" + marker.title + "</a></b></div>" + "<div>" + location.extract[0] + "<hr>" + "Information provided by Wikipedia" + "</div>");
            infowindow.open(map, marker);


    };

    self.wikiInfo = function(location) {
        self.wikiInfoWindow(location.marker, largeInfoWindow, location);
        location.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            location.marker.setAnimation(null);
        }, 750);
    };

    // Search and Filter Function
    self.filteredLocation = ko.observable("");

    self.userInput = ko.computed(function() {
        var filter = self.filteredLocation().toLowerCase();
        return ko.utils.arrayFilter(self.locations(), function(location) {

            if (location.name.toLowerCase().indexOf(filter) !== -1) {
                location.marker.setVisible(true);
                return true;
            } else {
                location.marker.setVisible(false);
                return false
            };
        });
    });
};
