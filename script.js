let cities = ["Austin", "Chicago", "New York"];
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

