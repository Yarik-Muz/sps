import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image
} from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import axios from "axios";
import Scroll from "../src/components/scroll/scroll_parkings.jsx";
import MapStyleD from "../src/style/map_styleD.json";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
  latitude: 49.611622,
  longitude: 6.131935,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

export default function App() {
  const [parkingData, setParkingData] = useState([]);

  useEffect(() => {
    axios.get("http://13.49.21.193:8080/info").then(
      (response) => {
        setParkingData(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <>
      <StatusBar
        style="light"
        barStyle="light-content"
      />
      <View style={{ flex: 1 }}>
        <MapView
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          customMapStyle={MapStyleD}
          initialRegion={INITIAL_POSITION}
          showsUserLocation={true}
        >
          {parkingData.length > 0 && (
            <Marker
              key={parkingData[0].name}
              coordinate={{
                latitude: parkingData[0].coordinate_lat,
                longitude: parkingData[0].coordinate_lon,
              }}
              title={parkingData[0].name}
              description={`Capacity: ${parkingData[0].capacity}, Free: ${parkingData[0].free}`}
            >
              <View>
                <Image
                  source={require("../assets/parking-sign.png")}
                  className=" w-12 h-12"
                  resizeMode="contain"
                />
              </View>
            </Marker>
          )}
        </MapView>

        <Scroll />

      </View>
    </>
  );
}
