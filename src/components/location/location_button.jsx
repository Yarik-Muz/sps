import React, { useEffect, useState} from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import Geolocation from "@react-native-community/geolocation";


export default function userLocation() {

      const [position, setPosition] = useState({
        latitude: 10,
        longitude: 10,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });

      useEffect(() => {
        Geolocation.getCurrentPosition((pos) => {
          const crd = pos.coords;
          setPosition({
            latitude: crd.latitude,
            longitude: crd.longitude,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
          });
        }).catch((err) => {
          console.log(err);
        });
      }, []);



    return (

        <TouchableOpacity className=" absolute bottom-24 right-6 p-3 rounded-xl shadow-xl" onPress={position}>

            <Image className=" w-8 h-8" source={require("../../../assets/target.png")}/>

        </TouchableOpacity>

    )

}
