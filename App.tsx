import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  DrawerLayoutAndroidBase,
} from "react-native";
import { IDay } from "./interface";
const { width: DEVICE_WIDTH } = Dimensions.get("window");

const API_KEY = "6d94e1e08551bde76cba3b4af5a9149a";

export default function App() {
  const [city, setCity] = useState<string | null>("Loading...");
  const [days, setDays] = useState<IDay[]>([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { longitude, latitude },
    } = await Location.getCurrentPositionAsync();
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );
    setCity(location[0].region);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    const daily: IDay[] = json.daily;
    setDays(daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={style.container}>
      <View style={style.city}>
        <Text style={style.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.weather}
      >
        {days.length === 0 ? (
          <View style={style.day}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={style.day}>
              <Text style={style.temp}>{day.temp.day.toFixed(0)}</Text>
              <Text style={style.description}>{day.weather[0].main}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "600",
  },
  weather: {},
  day: {
    width: DEVICE_WIDTH,
    alignItems: "center",
  },
  temp: {
    fontSize: 150,
  },
  description: {
    marginTop: -10,
    fontSize: 40,
    fontWeight: "600",
  },
});
