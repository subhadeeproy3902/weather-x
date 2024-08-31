import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextInput,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { debounce, set } from "lodash";
import { fetchLocation, fetchWeatherForecast } from "@/lib/weather";
import { weatherIcons } from "@/constants";
import * as Progress from "react-native-progress";
import { getData, storeData } from "@/lib/asyncStorage";

type LocProps = {
  name?: string;
  country?: string;
}[];

type OpType = {
  weekday: string;
};

type WeatherProps = {
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
  };
  location: {
    name: string;
    country: string;
  };
  forecast: {
    forecastday: {
      date: string;
      astro: {
        sunrise: string;
      };
      day: {
        avgtemp_c: number;
        condition: {
          icon: string;
        };
      };
    }[];
  };
};

const Page = () => {
  const [search, setSearch] = useState(false);
  const [locations, setLocations] = useState<LocProps>([]);
  const [weather, setWeather] = useState<WeatherProps>({} as WeatherProps);

  const [loading, setLoading] = useState(true);

  const toggleSearch = (value: boolean) => {
    setSearch(value);
  };

  const handleLocation = (location: any) => {
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast(location.name, 7).then((data) => {
      setWeather(data);
      storeData("city", location.name)
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    });
  };

  const handleSearch = (text: string) => {
    if (text === "") {
      setLocations([]);
      return;
    }
    fetchLocation(text).then((data) => {
      setLocations(data);
    });
  };

  const handleTextDebounce = useCallback(
    debounce((text: string) => {
      handleSearch(text);
    }, 1200),
    []
  );

  useEffect(() => {
    firstFetch()
  }, []);

  const firstFetch = async () => {  
    let city = await getData("city")
    let defaultCity = "Kolkata"
    if(city) {
      defaultCity = city
    }
    fetchWeatherForecast(defaultCity, 7).then((data) => {
      setWeather(data);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    })
  }

  const { current, location } = weather;

  return (
    <View className="flex-1 relative w-full">
      <Image
        blurRadius={70}
        source={require("../assets/images/bg.png")}
        className="h-full w-full absolute"
      />
      <StatusBar style="light" />

      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail color="#02ccfe" thickness={10} size={150} />
        </View>
      ) : (
        <ScrollView className="flex mt-20 pb-6 flex-1">
          <KeyboardAvoidingView
            style={{ height: "7%" }}
            className="mx-4 relative z-50 mb-8"
          >
            <View
              className={`flex-row justify-end items-center rounded-full ${
                search && "bg-white/50"
              }`}
            >
              {search ? (
                <TextInput
                  onChange={(
                    e: NativeSyntheticEvent<TextInputChangeEventData>
                  ) => handleTextDebounce(e.nativeEvent.text)}
                  placeholder="Search city"
                  placeholderTextColor="#d3d3d3"
                  className="h-10 flex-1 text-base text-white pl-6 pb-1"
                />
              ) : null}

              <TouchableOpacity
                className="bg-white/50 rounded-full p-3 m-1"
                onPress={() => toggleSearch(!search)}
              >
                <MagnifyingGlassIcon size="25" color="white" />
              </TouchableOpacity>
            </View>

            {locations.length > 0 && search ? (
              <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                {locations.map((location, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder
                    ? "border-b-2 border-b-gray-400"
                    : "border-0";
                  return (
                    <TouchableOpacity
                      key={index}
                      className={`p-3 px-4 mb-1 flex-row items-center ${borderClass}`}
                      onPress={() => handleLocation(location)}
                    >
                      <MapPinIcon size="20" color="gray" />
                      <Text className="text-black text-lg ml-2">
                        {location?.name}, {location?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </KeyboardAvoidingView>

          <View className="mx-4 items-center flex flex-col justify-normal gap-y-6 mb-4 flex-1 pt-2">
            <Text className="text-white text-center text-2xl font-bold">
              {location?.name},{" "}
              <Text className="text-lg font-semibold text-gray-300">
                {location?.country}
              </Text>
            </Text>

            <View className="flex-row justify-center">
              <Image
                source={
                  weatherIcons[current?.condition?.text] ||
                  require("../assets/images/heavy-rain.png")
                }
                className="h-52 w-52"
              />
            </View>
            <View className="space-y-2">
              <Text className="text-white text-6xl font-bold ml-5 text-center">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-gray-300 tracking-widest text-center text-xl">
                {current?.condition?.text}
              </Text>
            </View>

            <View className="flex-row pt-1.5 justify-between mx-4 w-full">
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/icons/wind.png")}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.wind_kph} km/h
                </Text>
              </View>

              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/icons/drop.png")}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.humidity}%
                </Text>
              </View>

              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/icons/sun.png")}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {weather.forecast.forecastday[0].astro?.sunrise} 
                </Text>
              </View>
            </View>
          </View>

          <View className="space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
              <CalendarDaysIcon size="22" color="white" />
              <Text className="text-white font-semibold text-base">
                Next 7 Days
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 15 }}
            >
              {weather?.forecast?.forecastday?.map(
                (item: any, index: number) => {
                  let date = new Date(item.date);
                  let dayName = date.toLocaleDateString("en-US", {
                    weekday: "long",
                  });
                  dayName = dayName.split(",")[0];

                  return (
                    <View
                      className="flex items-center space-y-1 mr-4 justify-center w-24 rounded-3xl py-3 bg-white/20"
                      key={index}
                    >
                      <Image
                        source={
                          weatherIcons[item.day.condition.text] ||
                          require("../assets/images/heavy-rain.png")
                        }
                        className="h-11 w-11"
                      />
                      <Text className="text-white text-center text-sm">
                        {dayName}
                      </Text>
                      <Text className="text-white font-semibold text-center text-xl">
                        {item?.day?.avgtemp_c}&#176;
                      </Text>
                    </View>
                  );
                }
              )}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Page;
