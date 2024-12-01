import { Link } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Text, View, Image, Pressable, Animated } from "react-native";

export default function MessiCard({ item }) {
  return (
    <View
      key={item.title}
      className="flex justify-start items-center flex-col gap-3 z-10"
    >
      <Text className="text-black font-bold">{item.title}</Text>
      <Image source={item.icon} className="rounded-xl h-60 w-60" />
      <Pressable
        onPress={() => alert("Hola")}
        className="bg-sky-500 px-3 py-2 rounded-lg"
      >
        <Text className="text-white">{item.textButton}</Text>
      </Pressable>
    </View>
  );
}

export function AnimatedCard({ item, index }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: index * 200,
      useNativeDriver: true,
    }).start();
  }, [opacity, index]);

  return (
    <Animated.View style={{ opacity }}>
      <MessiCard item={item} />
    </Animated.View>
  );
}
