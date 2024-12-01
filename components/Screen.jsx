import { View } from "react-native";

export function Screen({ children }) {
    return (
        <View className="flex-1 bg-slate-100 px-4 pt-4">
            {children}
        </View>
    )
}
