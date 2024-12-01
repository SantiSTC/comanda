import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { Main } from "./components/Main";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <View className="bg-slate-100 w-full">
        <StatusBar style="light" />
        {/* <Main /> */}
      </View>
    </SafeAreaProvider>
  );
}
