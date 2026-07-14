const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {

    const city = document.getElementById("city").value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    try {

        // Get latitude & longitude from city name
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            alert("City not found!");
            return;
        }

        const location = geoData.results[0];

        const lat = location.latitude;
        const lon = location.longitude;

        // Get weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );

        const weatherData = await weatherResponse.json();

        document.getElementById("cityName").textContent = location.name;
        document.getElementById("temp").textContent =
            weatherData.current.temperature_2m + "°C";

        document.getElementById("humidity").textContent =
            weatherData.current.relative_humidity_2m;

        document.getElementById("wind").textContent =
            weatherData.current.wind_speed_10m;

        document.getElementById("condition").textContent =
            getWeatherDescription(weatherData.current.weather_code);

    } catch (error) {
        alert("Something went wrong. Please try again.");
        console.error(error);
    }

}

function getWeatherDescription(code) {

    const weatherCodes = {
        0: "Clear Sky ☀️",
        1: "Mainly Clear 🌤️",
        2: "Partly Cloudy ⛅",
        3: "Cloudy ☁️",
        45: "Fog 🌫️",
        48: "Fog 🌫️",
        51: "Light Drizzle 🌦️",
        53: "Drizzle 🌦️",
        55: "Heavy Drizzle 🌧️",
        61: "Rain 🌧️",
        63: "Moderate Rain 🌧️",
        65: "Heavy Rain 🌧️",
        71: "Snow ❄️",
        80: "Rain Showers 🌦️",
        95: "Thunderstorm ⛈️"
    };

    return weatherCodes[code] || "Unknown";

}