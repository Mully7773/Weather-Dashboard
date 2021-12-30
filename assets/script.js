var date = moment().format('LL');

var apiKey = 'b60a374c2ea7fecdf3917b7b47f49eb2';

var searchResultEl = $("#searchResult");
var cityEntryEl = $("#cityEntry");
var searchButtonEl = $("#searchButton");
var appendListEl = $("#appendList");
var mainDisplayEl = $("#mainDisplay");
var cityTempEl = $("#cityTemp");
var cityInfoEl = $("#cityInfo");
var fiveDayForecastEl = $("#fiveDayForecast");

var searchHistory = [];

var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityEntryEl + "&units=imperial" + "&appid=" + apiKey;

// console.log(queryURL);

// Display City Function
function getWeather(city) {

    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityEntryEl + "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: 'GET',
      }).then(function (response) {
        console.log(response);
        console.log(response.name)

        if (response.ok) {
            response.json().then(function(data) {
                displayWeather(data, cityEntryEl); 
            });
        } else {
            alert('Error')
        }
      })
      .catch(function(error) {
          alert('Unable to connect to openweathermap');
      });
};

var displayWeather = function (para1, para2) {
    if (para1.length === 0) {
        mainDisplayEl.text ="No city found"
        return;
    }
    var temperature = main.temp;
    var windSpeed = wind.speed;
    var humidity = main.humidity;
    // var UvIndex = ???
}

function citySearch() {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityEntryEl.val().trim() + "&units=imperial" + "&appid=" + apiKey;
    // cityEntryEl.val(" ").replaceWith("_");
    console.log(queryURL); //works but not with two-word cities
    
}


searchButtonEl.on("click", function(event){
    event.preventDefault();
    citySearch();
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


