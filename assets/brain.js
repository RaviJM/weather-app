const form = document.querySelector("#form");
const cityField = document.querySelector("#city");
let toggleButtonCF = document.querySelector("#toggle-button");
let valueObj = {};

function getValue(event) {
  event.preventDefault();

  // get input (city) value
  const cityField = document.querySelector("#city");
  const city = cityField.value;

  // construct URI
  const baseURI =
    "https://api.weatherapi.com/v1/current.json?key=0c503ad22ece41b7b81122813241605&q=";

  const URI = baseURI + city;

  // clear form field
  cityField.value = "";

  fetchData(URI);
}

async function fetchData(URI) {
  const response = await fetch(URI, { mode: "cors" });
  if (response.status !== 400) {
    const responsePromise = response.json();

    responsePromise
      .then((obj) => {
        processData(obj);
      })
      .catch((error) => {
        console.log(
          "This error occurred while processing data (in method processData):"
        );
        console.log(error);
      });
  } else {
    alert("Oops! Location not found!");
  }
}

function processData(responseObject) {
  const condition = responseObject.current.condition.text;

  const name = responseObject.location.name;
  const region = responseObject.location.region;
  const country = responseObject.location.country;

  const tempC = responseObject.current.temp_c;
  const tempF = responseObject.current.temp_f;
  const feelsLikeC = responseObject.current.feelslike_c;
  const feelsLikeF = responseObject.current.feelslike_f;

  const windSpeedMPH = responseObject.current.wind_mph;
  const windSpeedKMPH = responseObject.current.wind_kph;
  const windDirection = responseObject.current.wind_dir;

  const humidity = responseObject.current.humidity;

  const precipitationMM = responseObject.current.precip_mm;
  const precipitationIn = responseObject.current.precip_in;

  let responseValueObj = {};

  responseValueObj.condition = condition;
  responseValueObj.name = name;
  responseValueObj.region = region;
  responseValueObj.country = country;
  responseValueObj.tempC = tempC;
  responseValueObj.tempF = tempF;
  responseValueObj.feelsLikeC = feelsLikeC;
  responseValueObj.feelsLikeF = feelsLikeF;
  responseValueObj.windSpeedKMPH = windSpeedKMPH;
  responseValueObj.windSpeedMPH = windSpeedMPH;
  responseValueObj.windDirection = windDirection;
  responseValueObj.humidity = humidity;
  responseValueObj.precipitationMM = precipitationMM;
  responseValueObj.precipitationIn = precipitationIn;

  // for making the object (containing values) globally accessible (used later when changing C to F as object access is required to change the display)
  valueObj = responseValueObj;
  displayData(responseValueObj);
}
function displayData(obj) {
  const condition = document.querySelector("#condition");
  const name = document.querySelector("#name");
  const region = document.querySelector("#region");
  const country = document.querySelector("#country");

  const windDirection = document.querySelector("#windDirection");
  const humidity = document.querySelector("#humidity");

  condition.textContent = obj.condition;
  name.textContent = obj.name;
  region.textContent = obj.region;
  country.textContent = obj.country;
  windDirection.textContent = obj.windDirection;
  humidity.textContent = obj.humidity;

  // conditional (C/F)
  let toggleButtonCF = document.querySelector("#toggle-button");
  let state = toggleButtonCF.getAttribute("state");

  displayConditionalValues(state, obj);
}

// some values are for C and some for F. To display them accordingly, this is the function
function displayConditionalValues(state, obj) {
  const temp = document.querySelector("#temp");
  const feelsLike = document.querySelector("#feelsLike");
  const windSpeed = document.querySelector("#windSpeed");
  const precipitation = document.querySelector("#precipitation");

  if (state === "c") {
    temp.textContent = obj.tempC;
    temp.textContent += "°C";
    feelsLike.textContent = obj.feelsLikeC;
    feelsLike.textContent += "°C";
    windSpeed.textContent = obj.windSpeedKMPH;
    windSpeed.textContent += " kph";
    precipitation.textContent = obj.precipitationMM;
    precipitation.textContent += " mm";
  } else {
    temp.textContent = obj.tempF;
    temp.textContent += "°F";
    feelsLike.textContent = obj.feelsLikeF;
    feelsLike.textContent += "°F";
    windSpeed.textContent = obj.windSpeedMPH;
    windSpeed.textContent += " mph";
    precipitation.textContent = obj.precipitationIn;
    precipitation.textContent += " in";
  }
}

form.addEventListener("submit", getValue);
toggleButtonCF.addEventListener("click", () => {
  let state = toggleButtonCF.getAttribute("state");
  if (state === "c") {
    toggleButtonCF.setAttribute("state", "f");
  } else {
    toggleButtonCF.setAttribute("state", "c");
  }
  state = toggleButtonCF.getAttribute("state");
  displayConditionalValues(state, valueObj);
});
