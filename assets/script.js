var today = moment().format('LL');

var apiKey = 'b60a374c2ea7fecdf3917b7b47f49eb2';


var cityEntryEl = $("#cityEntry");
var searchButtonEl = $("#searchButton");
var appendListEl = $("#appendList");
var mainDisplayEl = $("#mainDisplay");
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

    
    
    var temp = $("#temperature").text("Temperature: " + response.main.temp + " °F").css("font-size", "20px");
    // Math.floor(temp); If less exact values are desired.
    // console.log(temp)
    $("#wind-speed").text("Wind Speed: " + response.wind.speed + " MPH").css("font-size", "20px");
    $("#humidity").text("Humidity: " + response.main.humidity + "%").css("font-size", "20px");
    
    

    var lon = response.coord.lon;
    var lat = response.coord.lat;

    var uviQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + '&lon=' + lon + "&exclude=minutely,hourly&appid=" + apiKey
    console.log(uviQueryUrl)
    $.ajax({
        url: uviQueryUrl,
        method: 'GET',
      }).then(function (uviResponse) {
        console.log(uviResponse);
        var uvi = uviResponse.current.uvi
        
        $("#UV-index").text("UV Index: " + uvi).css("font-size", "20px"); //Add colors using if/else statement
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



function citySearch(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + apiKey;
    console.log(queryURL); 
}



//Five-day
function fiveDayForecast(city) {
    var fiveDayForecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&appid=" + apiKey;



    fiveDayForecastEl.empty(); // Used to empty the container upon new searches


    $.ajax({
        url: fiveDayForecastURL,
        method: 'GET',
      }).then(function (fiveDayResponse) {
          console.log(fiveDayResponse);

        $("#fiveDayTitle").text("Your 5-day Forecast:");
        //   var weatherItems = fiveDayResponse.list;
          for (let i = 0; i !=  fiveDayResponse.list.length; i+=8) {
            // var dailyForecast = weatherItems[i];


              var info = {
                  date: fiveDayResponse.list[i].dt_txt,
                  icon: fiveDayResponse.list[i].weather[0].icon,
                  temp: fiveDayResponse.list[i].main.temp,
                  humidity: fiveDayResponse.list[i].main.humidity
              };
              var dateString = info.date;
              var finalDate = dateString.substring(0, 10);

            //   var todayDate = moment.unix(info.date).format("MM/DD/YYYY");
            //   console.log(todayDate)

              var iconURL = "https://openweathermap.org/img/wn/" + info.icon + "@2x.png";

        

        fiveDayForecastEl.append("<div class='pl-3'>" + "<div class='card shadow pl-1 pt-2 ml-2 mb-4 mt-1 bg-primary text-light' style='width: 200px'>" + "<div class='card-body'>" + "<h5>" + finalDate + "<img src=" + iconURL + ">" + "</h5>" + "Temp:" + "<p>" + info.temp + "°F" + "</p>" + "Humidity: " + "<p>" + info.humidity + "\%" + "</p>" + "</div>" + "</div>" + "</div>")

          }
        
      });
    }

searchButtonEl.on("click", function(event){
    event.preventDefault();
    var city = cityEntryEl.val().trim().replace(" ", "+"); //for two-worded cities
    citySearch(city);
    getWeather(city);
    fiveDayForecast(city);
    if(!searchHistory.includes(city)) {
        searchHistory.push(city);
        var searchedCity = $("<button>");
        searchedCity.addClass("btn btn-secondary btn-block mt-2");
        searchedCity.attr("id", "searchedCityBtn")
        searchedCity.text(city);
        appendListEl.append(searchedCity);

    };

    localStorage.setItem("City", JSON.stringify(searchHistory));
    console.log(searchHistory);
})


//Click to get previous search values
$(document).on("click", "#searchedCityBtn", function() {
    var thisCity = $(this).text();
    getWeather(thisCity);
    fiveDayForecast(thisCity);
})