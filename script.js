let weather = {
    "apikey": "6f309e26be6b4a94abdc885ddea05893",
    fetchWeather: function(city){
        if (city.trim() === "" || city.toLowerCase() === "search"){
            return;
        }
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="+
            city
            + "&units=metric&appid=" 
            + this.apikey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data){
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { country } = data.sys;
        const { temp, humidity, feels_like, temp_min , temp_max } = data.main; 
        const { speed } = data.wind;
        document.querySelector(".city").innerText = name + ", " + country;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = Math.round(temp) + "°C";
        const minmaxtempElement = document.querySelector(".minmaxtemp");
        if (minmaxtempElement) {
            minmaxtempElement.innerText = Math.round(temp_min) + "°C / " + Math.round(temp_max) + "°C";
        }
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".feeltemp").innerText = "Feels like: " + Math.round(feels_like) + "°C";
        document.querySelector(".wind").innerText = "Wind: " + Math.round(speed) + " km/h";
        document.querySelector(".weather").classList.remove("loading");
        getBackgroundImage(description);
    },
    search: function(){
        const city = document.querySelector(".search-bar").value;
        this.fetchWeather(city);
    },
    searchByCoordinates: function(latitude, longitude){
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude +
            "&lon=" + longitude + "&units=metric&appid=" + this.apikey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    }
};

document.querySelector(".search button").addEventListener("click", function() {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function(event){
    if(event.key === "Enter") {
        weather.search();
    }
});

function getBackgroundImage(description) {
    var words = description.split(" ");
    var modifiedDescription = words.join("-");
    document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x1200/?" + modifiedDescription + "')";
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const { latitude, longitude } = position.coords;
            weather.searchByCoordinates(latitude, longitude);
        },
        function(error) {
            console.log("Error getting location:", error);
        }
    );
} else {
    console.log("Geolocation is not supported by this browser.");
}
