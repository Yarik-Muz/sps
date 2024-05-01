import {
  View,
  Animated,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Menu() {
  const [expanded, setExpanded] = useState(false);
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

  const animationController = useRef(new Animated.Value(70)).current;

  const toggleExpansion = () => {
    const finalValue = expanded ? 70 : 500;

    Animated.timing(animationController, {
      toValue: finalValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setExpanded(!expanded);
  };

  return (
    <Animated.View className=" bg-neutral-900 p-3 absolute left-0 right-0 bottom-0 justify-start items-center rounded-xl"
      style={{height: animationController}}
    >
      <TouchableOpacity className=" absolute w-auto h-4 items-center justify-center"
        onPress={toggleExpansion}
      >
        <View className=" w-32 h-1 bg-black rounded-xl mt-2">

        </View>
      </TouchableOpacity>

      {expanded && (
      <ScrollView className=" w-full mt-6" showsVerticalScrollIndicator={false}>
        {parkingData.length > 0 &&
          parkingData.map((parking, index) => (
            <View className=" flex-row items-center mb-1"
              key={index}
            >
              <Image
                source={require("../../../assets/parking-sign.png")}
                className=" w-8 h-8 mr-3"
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <Text className=" text-white text-base font-bold">
                  {parking.name}
                </Text>
                <Text className=" text-white text-base">
                  Capacity: {parking.capacity}, Free: {parking.free}
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>
      )}
    </Animated.View>
  );
}
