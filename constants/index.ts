type WeatherIcon = {
  [key: string]: string;
};

export const weatherIcons: WeatherIcon = {
  'Partly cloudy': require("../assets/images/partlycloudy.png"),
  'Moderate rain': require("../assets/images/moderate-rain.png"),
  'Patchy rain possible': require("../assets/images/patchy-rain.png"),
  'Sunny': require("../assets/images/sunny.png"),
  'Clear': require("../assets/images/clear.png"),
  'Overcast': require("../assets/images/overcast.png"),
  'Cloudy': require("../assets/images/cloudy.png"),
  'Light rain': require("../assets/images/light-rain.png"),
  'Light rain shower': require("../assets/images/light-rain.png"),
  'Moderate rain at times': require("../assets/images/moderate-rain.png"),
  'Heavy rain': require("../assets/images/heavy-rain.png"),
  'Moderate or heavy freezing rain': require("../assets/images/moderate-rain.png"),
  'Heavy rain at times': require("../assets/images/partlycloudy.png"),
  'Moderate or heavy shower': require("../assets/images/moderate-rain.png"),
  'Moderate or heavy rain with thunder': require("../assets/images/heaviest-rain.png"),
  'other': require("../assets/images/moderate-rain.png"),
  'Mist': require("../assets/images/mist.png")
}