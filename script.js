let latitude = "";
let longitude = "";
let cities = [];
let cityName = "";
let storedCities = [];
let flag = 0;
loadCities();

function loadCities() {
    storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities != null) {
        for (let i = 0; i < storedCities.length; i++) {
            cities.push(storedCities[i]);
        }
        cityButtons();
        loadWeather();
    }
}

function cityButtons() {
    $("#cButtons").empty();
    if (cities != null) {
        for (let i = 0; i < cities.length; i++) {
            let cityBtn = $("<button>");
            cityBtn.addClass("btn btn-outline-dark btn-block cityBtn");
            cityBtn.attr("data-city", cities[i]);
            cityBtn.text(cities[i]);
            $("#cButtons").append(cityBtn);
            localStorage.setItem("cities", JSON.stringify(cities));
        }
    }
    else {
        return
    }
}
$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    let newCity = $("#newCity").val();
    cities.push(newCity);

    cityButtons();
})
function loadWeather() {
    $("#mainForecast").empty();
    $("#5Day").empty();
    if (flag === 0 && storedCities != null) {
        cityName = storedCities[storedCities.length - 1];
        flag++
    }
    else {
        cityName = $(this).attr("data-city");
    }
    let queryURL = "https:api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=f3347858791a9b0e9e5a6dc48f294071";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        longitude = response.city.coord.lon;
        latitude = response.city.coord.lat;

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=hourly&units=imperial&appid=f3347858791a9b0e9e5a6dc48f294071",
            method: "GET"
        }).then(function (response2) {
            $("#5DayText").empty();
            let currentDiv = $("<div>");
            let fiveDayText = $("<h3>");
            fiveDayText.text("5 Day Forecast: ");
            $("#5DayText").append(fiveDayText);
            let weatherSymbol = $("<img>");
            let wIcon = response2.current.weather[0].icon;
            weatherSymbol.attr("src", "http://openweathermap.org/img/w/" + wIcon + ".png");
            weatherSymbol.addClass("wSymbol");
            weatherSymbol.attr("style","display: inline-block");
            let curCity = $("<h2>").text(cityName + "  " + moment().format('l')).add(weatherSymbol);
            curCity.attr("style","display: inline-block")
            let curTemp = $("<p>").text("Temperature: " + response2.current.temp + " F");
            let curHumidity = $("<p>").text("Humidity: " + response2.current.humidity + "%");
            let curWind = $("<p>").text("Wind Speed: " + response2.current.wind_speed + " MPH");
            let indexVal = $("<p>").text(response2.current.uvi);
            if (parseInt(response2.current.uvi) <= 2) {
                indexVal.addClass("indexLow");
            }
            else if (parseInt(response2.current.uvi) > 2 && parseInt(response2.current.uvi) < 8) {
                indexVal.addClass("indexMod");
            }
            else if (parseInt(response2.current.uvi) > 7) {
                indexVal.addClass("indexHigh");
            }
            let curUV = $("<p>").text("UV Index: ").add(indexVal);
            curUV.addClass("uvIndex");
            currentDiv.append(curCity, curTemp, curHumidity, curWind, curUV);
            $("#mainForecast").append(currentDiv);
            console.log(response2)
            for (let i = 1; i < 6; i++) {
                console.log(response2.daily[i].weather[0].main)
                let futureDiv = $("<div>");
                let futDate = $("<p>").text(moment().add(i, 'days').calendar('MM/DD/YYYY'));
                let weatherSymbol = $("<img>");
                let wIcon = response2.daily[i].weather[0].icon
                weatherSymbol.attr("src", "http://openweathermap.org/img/w/" + wIcon + ".png");
                weatherSymbol.addClass("wSymbol");
                let futTemp = $("<p>").text("Temp: " + response2.daily[i].temp.day + " F");
                let futHumidity = $("<p>").text("Humidity: " + response2.daily[i].humidity + "%");
                futureDiv.addClass("futureCast");
                futureDiv.append(futDate, weatherSymbol, futTemp, futHumidity);
                $("#5Day").append(futureDiv);
            }
        })
    })
}
$(document).on("click", ".cityBtn", loadWeather) 
