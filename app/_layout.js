import { Link, Stack } from "expo-router";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function Layout() {
  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "white", height: 100 },
          headerTintColor: "black",
          headerTitle: "",
          headerLeft: () => (
            <View>
              <Text className="text-black text-2xl font-bold">
                Comanda
              </Text>
            </View>
          ),
          headerRight: () => (
            <Link
              asChild
              href={"/about"}
              className="mr-4 flex justify-center items-center"
            >
              <FontAwesome5 name="info-circle" size={24} color="black" />
            </Link>
          ),
        }}
      />
      <StatusBar style="dark" />
    </View>
  );
}
