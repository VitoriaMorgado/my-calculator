import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./style";
import { router } from "expo-router";

export default function NavBar() {
  const irHome = () => {
    router.push("/");
  };

  const irMais = () => {
    router.push("/mais");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={irHome}>
        <Text style={styles.link}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={irMais}>
        <Text style={styles.link}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
