import { FlatList, Text, View } from "react-native";

// Imagenes
import icon from "../assets/messi.jpg";

import { AnimatedCard } from "./MessiCard";
import { Screen } from "./Screen";

export function Main() {
  const elements = [
    {
      title: "Hola1111",
      icon: icon,
      textButton: "Pulsa aqui1",
    },
    {
      title: "Hola2",
      icon: icon,
      textButton: "Pulsa aqui2",
    },
    {
      title: "Hola3",
      icon: icon,
      textButton: "Pulsa aqui3",
    },
    {
      title: "Hola4",
      icon: icon,
      textButton: "Pulsa aqui4",
    },
    {
      title: "Hola5",
      icon: icon,
      textButton: "Pulsa aqui4",
    },
    {
      title: "Hola6",
      icon: icon,
      textButton: "Pulsa aqui4",
    },
    {
      title: "Hola7",
      icon: icon,
      textButton: "Pulsa aqui4",
    },
    {
      title: "Hola8",
      icon: icon,
      textButton: "Pulsa aqui4",
    },
    {
      title: "Hola9",
      icon: icon,
      textButton: "Pulsa aqui4",
    },
  ];
  return (
    <Screen>
      <FlatList
        data={elements}
        keyExtractor={(elemento) => elemento.title}
        renderItem={(element) => (
          <AnimatedCard item={element.item} index={element.index} />
        )}
        className="bg-slate-100 pt-3"
      />
    </Screen>
  );
}
