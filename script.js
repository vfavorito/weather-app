let cities = ["Austin", "Chicago", "New York"];
let latitude = "";
let longitude = "";
cityButtons();
function cityButtons() {
    $("#cButtons").empty();
    for (let i = 0; i < cities.length; i++) {
        let cityBtn = $("<button>");
        cityBtn.addClass("btn btn-outline-dark btn-block cityBtn");
        cityBtn.attr("data-city", cities[i]);
        cityBtn.text(cities[i]);
        $("#cButtons").append(cityBtn);
    }
}
$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    let newCity = $("#newCity").val();
    cities.push(newCity);
    cityButtons();
})
$(document).on("click", ".cityBtn", function () {
    let cityName = $(this).attr("data-city");
    console.log(cityName);
    let queryURL = "https:api.openweathermap.org/data/2.5/forecast?q="+ cityName + "&units=imperial&appid=f3347858791a9b0e9e5a6dc48f294071";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        longitude = response.city.coord.lon;
        latitude = response.city.coord.lat;

        $.ajax({
            url:"https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=hourly&units=imperial&appid=f3347858791a9b0e9e5a6dc48f294071",
            method: "GET"
        }).then(function(response2){
            let currentDiv = $("<div>");
            let curCity = $("<h2>").text(cityName + "  " + moment().format('l'));
            let curTemp = $("<p>").text("Temperature: " + response2.current.temp + " F");
            let curHumidity = $("<p>").text("Humidity: " + response2.current.humidity + "%");
            let curWind = $("<p>").text("Wind Speed: " + response2.current.wind_speed + " MPH");
            let indexVal = $("<p>").text(response2.current.uvi);
            if (parseInt(response2.current.uvi) <= 2){
                indexVal.addClass("indexLow");
            }
            else if(parseInt(response2.current.uvi) > 2 && parseInt(response2.current.uvi) < 8){
                indexVal.addClass("indexMod");
            }
            else if(parseInt(response2.current.uvi) > 7){
                indexVal.addClass("indexHigh");
            }
            let curUV = $("<p>").text("UV Index: ").add(indexVal);
            currentDiv.append(curCity,curTemp,curHumidity,curWind,curUV);
            $("#mainForecast").append(currentDiv);
            console.log(curUV)
        })
    })

})
