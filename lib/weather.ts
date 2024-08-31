import axios from 'axios';

const apiKey = "4ecc7049ffb84065b36120935243108";

const forecastEndpoint = (cityName: string, days: number) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=${days}&aqi=no&alerts=no`

const locationEndpoint = (cityName: string) => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${cityName}`

const apiCall = async (url: string) => {
  const options = {
    method: 'GET',
    url: url,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const fetchWeatherForecast = async (cityName: string, days: number) => {
  const url = forecastEndpoint(cityName, days);
  return await apiCall(url);
}

export const fetchLocation = async (cityName: string) => {
  const url = locationEndpoint(cityName);
  console.log(url);
  return await apiCall(url);
}