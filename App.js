import { StatusBar } from "expo-status-bar";
import { Text, View, Image, Pressable } from "react-native";

// Imagenes
import icon from "./assets/messi.jpg";

export default function App() {
  return (
    <View>
      <View className="bg-slate-100 flex justify-center items-center flex-col h-screen w-full">
        <Text className="text-black font-bold">HOLA MUNDO</Text>
        <Image source={icon} className="rounded-xl h-60 w-60" />
        <Pressable
          onPress={() => alert("Hola")}
          className="bg-sky-500 px-3 py-2 rounded-lg"
        >
          <Text className="text-white">Pulsa aquí</Text>
        </Pressable>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}
