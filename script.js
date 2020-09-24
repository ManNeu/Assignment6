// declaring variable that will hold the search city
var city = "";

var searchCity = $("#search-city");
var searchButton = $("#search-btn");
var currentWea = $("#current-weather");
var currentCity = $("#current-city");
var currentTemp = $("#current-temperature");
var currentHum = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var currentUvIndex = $("#current-uv-index");

var sCity = [];

function find(c) {
    for (var i = 0; i < sCity.length; i++) {
        if (c.toUpperCase() === sCity[i]) {
            return -1;
        }
    }
    return 1;
}

// setting up API key
var APIKEY = "937ad811239b0749f99047587d5165cd";
// displaying current and future weather


function displayWeather(event) {
    // alert("its working");
    event.preventDefault();
    if (searchCity.val().trim() != "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }

}
function currentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKEY;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        // var weatherIcon = response[0].icon;
        // var iconUrl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
        // + "<img src =" + iconUrl + ">");
        var date = new Date(response.dt * 1000).toLocaleDateString();
        $(currentCity).html(response.name + "(" + date + ")");
        //converting into fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        // displaying current temperature
        $(currentTemp).html((tempF).toFixed(2) + "&#8457");
        $(currentHum).html(response.main.humidity + "%");
        // displaying windspeed in mph
        var windspeed = (response.wind.speed);
        var wsMph = (windspeed * 2.237).toFixed(1);
        $(currentWindSpeed).html(wsMph + "mph");

        // Display UVIndex.
        //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
        UVIndex(response.coord.lon, response.coord.lat);
        forecast(response.id);
        if (response.cod == 200) {
            sCity = JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity == null) {
                sCity = [];
                sCity.push(city.toUpperCase());
                localStorage.setItem("cityname", JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if (find(city) > 0) {
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname", JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }
    });


}
// This function returns the UVIindex response.
function UVIndex(ln, lt) {

    var uvqURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKEY + "&lat=" + lt + "&lon=" + ln;
    $.ajax({
        url: uvqURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);

        $(currentUvIndex).html(response.value);
    });


}
// displaying 5 days forecast
function forecast(cityId) {
    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityId + "&appid=" + APIKEY;
    $.ajax({
        url: queryForecastURL,
        method: "GET"
    }).then(function (response) {
        debugger
        console.log(response);
        for (i = 0; i < 5; i++) {
            var dateF = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
            var tempK = response.list[((i + 1) * 8) - 1].main.temp;
            var tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
            var humidityF = response.list[((i + 1) * 8) - 1].main.humidity;

            $("#fdate" + i).html(dateF);
            $("#ftemp" + i).html(tempF + "&#8457");
            $("#fhumidity" + i).html(humidityF + "%")
        }

    });
}

// appending search city to history
function appendToList(c) {
    var listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
    console.log(listEl);


}
// invoking past search again
function pastSearch(event) {
    var liEl = event.target;
    if (event.target.matches("li")) {
        city = liEl.textContent.trim();
        currentWeather(city);
    }
}
function loadlastCity() {
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if (sCity !== null) {
        sCity = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < sCity.length; i++) {
            appendToList(sCity[i]);
        }
        city = sCity[i - 1];
        currentWeather(city);
    }
}

$("#search-btn").on("click", displayWeather);
$(document).on("click", pastSearch);
$(window).on("load", loadlastCity);