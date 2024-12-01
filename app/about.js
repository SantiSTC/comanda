import { Pressable, ScrollView, Text, View } from "react-native";
import { Link, Stack } from "expo-router";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { styled } from "nativewind";
import { Screen } from "../components/Screen";

const StyledPressable = styled(Pressable);

export default function About() {
  return (
    <Screen>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <View>
              <Text className="text-black text-2xl font-bold">Acerca de</Text>
            </View>
          ),
          headerRight: () => {},
        }}
      />
      <ScrollView>
        <Text className="text-black text-3xl font-bold mb-6">
          Sobre el proyecto
        </Text>
        <Text className="text-black/90 mb-4">
          Lorem impsum fnforfren frefueufrn rehufreunfen nuennp afmefeueñn
          fwenfunu fwo´fnuwf frefueufrn yrerywv bnowqcjn jwevrvtweb nwd nwefnwyb
          nownrew we nnef
        </Text>
        <Text className="text-black/90 mb-4">
          Lorem impsum fnforfren frefueufrn rehufreunfen nuennp afmefeueñn
          fwenfunu fwo´fnuwf frefueufrn yrerywv bnowqcjn jwevrvtweb nwd nwefnwyb
          nownrew we nnef
        </Text>
        <Text className="text-black/90 mb-4">
          Lorem impsum fnforfren frefueufrn rehufreunfen nuennp afmefeueñn
          fwenfunu fwo´fnuwf frefueufrn yrerywv bnowqcjn jwevrvtweb nwd nwefnwyb
          nownrew we nnef
        </Text>
        <Text className="text-black/90 mb-4">
          Lorem impsum fnforfren frefueufrn rehufreunfen nuennp afmefeueñn
          fwenfunu fwo´fnuwf frefueufrn yrerywv bnowqcjn jwevrvtweb nwd nwefnwyb
          nownrew we nnef
        </Text>
        <Link asChild href={"/"}>
          <StyledPressable className={`active:opacity-50`}>
            <FontAwesome
              className="bg-transparent"
              name="home"
              size={24}
              color="black"
            />
          </StyledPressable>
        </Link>
      </ScrollView>
    </Screen>
  );
}
