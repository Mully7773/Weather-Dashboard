var today = moment().format('LL');

var apiKey = 'b60a374c2ea7fecdf3917b7b47f49eb2';

var searchResultEl = $("#searchResult");
var cityEntryEl = $("#cityEntry");
var searchButtonEl = $("#searchButton");
var appendListEl = $("#appendList");
var mainDisplayEl = $("#mainDisplay");
var cityTempEl = $("#cityTemp");
var cityInfoEl = $("#cityInfo");
var fiveDayForecastEl = $("#fiveDayForecast");
var cityNameEl = $("#cityName");

var searchHistory = [];

// console.log(queryURL);

// Display City Function
function getWeather(city) {

    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: 'GET',
      }).then(function (response) {
        console.log(response);
        
        // WHEN I view current weather conditions for that city
        // THEN I am presented with the city name
        // the date
        // an icon representation of weather conditions
        // the temperature
        // the humidity
        // the wind speed
    var icon = response.weather[0].icon
    var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    cityNameEl.html(response.name + " " + today + "<img src=" + iconUrl + ">");

    
    
    var temp = $("#temperature").text(response.main.temp + " °F");
    // Math.floor(temp);
    // console.log(temp)
    $("#wind-speed").text(response.wind.speed + " MPH");
    $("#humidity").text(response.main.humidity + "%");
    
    // var UvIndex = ???

    var lon = response.coord.lon;
    var lat = response.coord.lat;

    var uviQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + '&lon=' + lon + "&exclude=minutely,hourly&appid=" + apiKey
    
    $.ajax({
        url: uviQueryUrl,
        method: 'GET',
      }).then(function (uviResponse) {
        console.log(uviResponse);
        var uvi = uviResponse.current.uvi
        
        $("#UV-index").text("UV Index: " + uvi); //Add colors using if/else statement
        console.log(uvi);
        if(uvi >= 0 && uvi <= 2) {
        $("#UV-index").css("background-color", "green")
        }
        else if (uvi <= 5) {
            $("#UV-index").css("background-color", "yellow")
        } else if (uvi <= 7) {
            $("#UV-index").css("background-color", "orange")
        } else if (uvi <= 10) {
            $("#UV-index").css("background-color", "red")
        } else {
            $("#UV-index").css("background-color", "purple")
        }
      })


      })
      .catch(function(error) {
          alert('Unable to connect to openweathermap');
          console.log(error)
      });
};

var displayWeather = function (para1, para2) {
    if (para1.length === 0) {
        mainDisplayEl.text ="No city found"
        return;
    }
    
}






function citySearch(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + apiKey;
    console.log(queryURL); 
    
}





searchButtonEl.on("click", function(event){
    event.preventDefault();
    var city = cityEntryEl.val().trim().replace(" ", "+");
    citySearch(city);
    getWeather(city);
    if(!searchHistory.includes(city)) {
        searchHistory.push(city);
        var searchedCity = $("<li></li>");
        searchedCity.addClass("listedCities");
        appendListEl.append(searchedCity);

    };

    localStorage.setItem("searchedCity", JSON.stringify(searchHistory));
    console.log(searchHistory);
})

