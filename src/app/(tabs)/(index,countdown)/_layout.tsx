import { Stack } from "expo-router";

export default function DynamicLayout({ segment }) {
  // if (segment === "(index)") {
  //   return null;
  // }

  return (
    // <Stack>
    //   {segment === "(index)" ? (
    //     <Stack.Screen
    //       name="index"
    //       options={{
    //         title: "Find",
    //         // headerShown: false,
    //       }}
    //     />
    //   ) : (
    //     <Stack.Screen
    //       name="countdown"
    //       options={{
    //         title: "Countdown",
    //         // headerShown: false,
    //       }}
    //     />
    //   )}
    //   <Stack.Screen
    //     name="[movie]"
    //     options={{
    //       title: "Movie",
    //     }}
    //   />
    // </Stack>
    <Stack />
  );
}
