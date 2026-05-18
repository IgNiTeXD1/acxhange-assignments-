const cityin = document.getElementById("cityinput");

const weatherscreen = document.getElementById("weatherscreen");

//debounce

function debounce(fn, delay) {
    let timer;
    return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
        fn(...args);
    }, delay);
  };
}
//fetch api url
async function weatherapi(city) {

  const apikey = "da0b8847465d4dc683d100732261305";

  const url = `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}&aqi=no`;

  weatherscreen.innerHTML =
    "<p>Loading...</p>";

  try {

    const response = await fetch(url);

    if(!response.ok) {

      throw new Error(
        "Enter a valid city"
      );
    }

    const result = await response.json();

    showweather(result);

  } catch(error) {

    console.error(error);

    weatherscreen.innerHTML =

      `
        <p class="error">
          enter a valid city

        </p>
      `;
  }
}

// display

function showweather(data) {

  const city = data.location.name;

  const country = data.location.country;

  const temp = data.current.temp_c;

  const humidity = data.current.humidity;

  const wind = data.current.wind_kph;

  const condition =data.current.condition.text;

  const icon = data.current.condition.icon;

  const feelslike = data.current.feelslike_c;

  const uv = data.current.uv;

  const pressure = data.current.pressure_mb;

  weatherscreen.innerHTML =

    `
      <div class="weather-top">

        <div>

          <h2>${city}</h2>

          <p>${country}</p>

        </div>

        <img
          src="https:${icon}"
        >

      </div>

      <div class="temp">
        ${temp}°C
      </div>

      <div class="condition">
        ${condition}
      </div>

      <div class="info">

        <div class="card">

          <h4>Humidity</h4>

          <p>${humidity}%</p>

        </div>

        <div class="card">

          <h4>Wind</h4>

          <p>${wind} km/h</p>

        </div>

        <div class="card">

          <h4>Feels Like</h4>

          <p>${feelslike}°C</p>

        </div>

        <div class="card">

          <h4>UV Index</h4>

          <p>${uv}</p>

        </div>

        <div class="card">

          <h4>Pressure</h4>

          <p>${pressure} mb</p>

        </div>
        

      </div>
    `;
}


// debounced set timer

const debouncedWeather = debounce(weatherapi, 1000);


//input not click

cityin.addEventListener(
  "input",
  e => {

    const city =
      e.target.value.trim();

    if(city === "") {

      weatherscreen.innerHTML =

        `
          <p class="placeholder">
            Search for a city
          </p>
        `;

      return;
    }

    debouncedWeather(city);

});