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






function citySearch(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + apiKey;
    console.log(queryURL); 
}



//Five-day
// var fiveDayForecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + "London" + "&units=imperial" + "&appid=" + apiKey;
// console.log(fiveDayForecastURL)

function fiveDayForecast(city) {
    var fiveDayForecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&appid=" + apiKey;
    console.log(fiveDayForecastURL)

    



    $.ajax({
        url: fiveDayForecastURL,
        method: 'GET',
      }).then(function (fiveDayResponse) {
          console.log(fiveDayResponse);

        //   var weatherItems = fiveDayResponse.list;
          for (let i = 1; i < 6; i++) {
            // var dailyForecast = weatherItems[i];

            
            

              var info = {
                  date: fiveDayResponse.list[i].dt,
                  icon: fiveDayResponse.list[i].weather.icon,
                  temp: fiveDayResponse.list[i].main.temp,
                  humidity: fiveDayResponse.list[i].main.humidity
              };
              var todayDate = moment.unix(info.date).format("MM/DD/YYYY");
              console.log(todayDate)
              
              

            //   var newCards = $("<div>").addClass("pl-3")

        

        fiveDayForecastEl.append("<div class='pl-3'>" + "<div class='card pl-1 pt-2 ml-3 mb-4 mt-1 bg-primary text-light' style='width: 200px'>" + "<div class='card-body'>" + "<h5>" + todayDate + "</h5>" + "Temp:" + "<p>" + info.temp + "°F" + "</p>" + "Humidity: " + "<p>" + info.humidity + "\%" + "</p>" + "</div>" + "</div>" + "</div>")

        



        // $("#finalFive").append(newCards);
            //   fiveDayForecastEl.addClass("card bg-secondary text-light m-2");



            //   var newDay = new Date(fiveDayResponse.daily[i].dt * 1000);
            //   newDay = newDay.toLocaleDateString("en-US");
            //   console.log(newDay);
          }
        // $("#fiveDayForecast").text(fiveDayResponse.list[0].dt);
        // var newDay = new Date(fiveDayResponse.daily[i].dt * 1000);
        // newDay = newDay.toLocaleDateString("en-US");
        // console.log(newDay);
      });
    }

    // var newDay = new Date(data.daily[i].dt * 1000);
    //     newDay = newDay.toLocaleDateString("en-US");
    //     console.log(newDay);

    





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

// $("#searchedCityBtn").on("click", function() {
//     // var thisCity = $(this).text();
//     console.log("hello")
// })

//Click to get previous search values
$(document).on("click", "#searchedCityBtn", function() {
    var thisCity = $(this).text();
    getWeather(thisCity);
})





