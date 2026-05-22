import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "NumCalc" }} />
      <Stack.Screen name="raizes" options={{ title: "Raízes de Funções" }} />
      <Stack.Screen name="sistemas" options={{ title: "Sistemas Lineares" }} />
      <Stack.Screen name="curvas" options={{ title: "Ajuste de Curvas" }} />
    </Stack>
  );
}