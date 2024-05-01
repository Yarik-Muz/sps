import React, { Component } from "react";
import { Text, View } from "react-native";
import { Stack, Slot } from "expo-router";

export default function RooyLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
