// import {
//   Button,
//   ContextMenu,
//   Form,
//   Host,
//   HStack,
//   Image,
//   Section,
//   Spacer,
//   Text,
//   Toggle,
// } from "@expo/ui/swift-ui";
// import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
// import { useQuery } from "@tanstack/react-query";
// import { Link } from "expo-router";
// import { useState } from "react";
// import Purchases from "react-native-purchases";
// import RevenueCatUI from "react-native-purchases-ui";

// import { useProOfferings } from "@/api/getProOfferings";
// import { useInterfaceStore } from "@/stores";

// export default function SettingsView() {
//   const { onboardingModalRef } = useInterfaceStore();
//   const [isAirplaneMode, setIsAirplaneMode] = useState(true);

//   const { data: pro } = useProOfferings();

//   const { data: tips } = useQuery({
//     queryKey: ["tipsPackages"],
//     queryFn: async () => await Purchases.getOfferings(),
//     select: (data) => data.all["tips"],
//   });

//   async function openPaywall(type: "pro" | "tips") {
//     const offering = type === "pro" ? pro : tips;
//     await RevenueCatUI.presentPaywall({ offering });
//     const analytics = getAnalytics();
//     const eventParams = {
//       name: type === "pro" ? "Pro" : "Tip Jar",
//       ...(type === "pro" && { id: "com.lookforward.pro" }),
//       ...(type === "tips" && {
//         items: [
//           { id: "com.lookforward.tip1" },
//           { id: "com.lookforward.tip3" },
//           { id: "com.lookforward.tip5" },
//         ],
//       }),
//     };
//     await logEvent(analytics, "select_promotion", eventParams);
//   }

//   return (
//     <Host style={{ flex: 1 }}>
//       <Form>
//         <Section title="Countdown Notifications">
//           <Toggle
//             isOn={isAirplaneMode}
//             onIsOnChange={setIsAirplaneMode}
//             label="Day Before"
//           />
//           <Toggle
//             isOn={isAirplaneMode}
//             onIsOnChange={setIsAirplaneMode}
//             label="Week Before"
//           />
//           {/*
//           <Button>
//             <HStack spacing={8}>
//               <Image
//                 systemName="wifi"
//                 color="white"
//                 size={18}
//                 modifiers={[
//                   frame({ width: 28, height: 28 }),
//                   background("#007aff"),
//                   clipShape("roundedRectangle"),
//                 ]}
//               />
//               <Text color="primary">Week Before</Text>
//               <Spacer />
//               <Image systemName="chevron.right" size={14} color="secondary" />
//             </HStack>
//           </Button> */}
//         </Section>
//         <Section title="Movie Preferences">
//           <HStack>
//             <Text color="primary">Region</Text>
//             <Spacer />
//             <ContextMenu activationMethod="singlePress">
//               <ContextMenu.Items>
//                 <Button onPress={() => null} label="test" />
//               </ContextMenu.Items>
//               <ContextMenu.Trigger>
//                 <Button label="New Event Type" />
//               </ContextMenu.Trigger>
//             </ContextMenu>
//           </HStack>
//           <HStack>
//             <Text color="primary">Language</Text>
//             <Spacer />
//             <ContextMenu activationMethod="singlePress">
//               <ContextMenu.Items>
//                 <Button onPress={() => null} label="test" />
//               </ContextMenu.Items>
//               <ContextMenu.Trigger>
//                 <Button label="New Event Type" />
//               </ContextMenu.Trigger>
//             </ContextMenu>
//           </HStack>
//         </Section>
//         <Section title="Pro">
//           <Button role="default" onPress={() => openPaywall("pro")}>
//             <HStack>
//               <Text color="primary">Explore Pro Features</Text>
//               <Spacer />
//               <Image systemName="chevron.right" size={14} color="secondary" />
//             </HStack>
//           </Button>
//           <Link href="/app-icon" asChild>
//             <Button role="default">
//               <HStack>
//                 <Text color="primary">App Icon</Text>
//                 <Spacer />
//                 <Image systemName="chevron.right" size={14} color="secondary" />
//               </HStack>
//             </Button>
//           </Link>
//         </Section>
//         <Section>
//           <Button role="default" onPress={() => openPaywall("tips")}>
//             <HStack>
//               <Text color="primary">Tip Jar</Text>
//               <Spacer />
//               <Image systemName="chevron.right" size={14} color="secondary" />
//             </HStack>
//           </Button>
//           <Button role="default" onPress={() => console.log("pressed")}>
//             <HStack>
//               <Text color="primary">Write a Review</Text>
//               <Spacer />
//               <Image systemName="chevron.right" size={14} color="secondary" />
//             </HStack>
//           </Button>
//         </Section>
//         <Section>
//           <Button
//             role="default"
//             onPress={() => onboardingModalRef.current?.present()}
//           >
//             <HStack>
//               <Text color="primary">Show Getting Started</Text>
//               <Spacer />
//               <Image systemName="chevron.right" size={14} color="secondary" />
//             </HStack>
//           </Button>
//         </Section>
//         <Section>
//           <Link href="/account" asChild>
//             <Button role="default" onPress={() => console.log("pressed")}>
//               <HStack>
//                 <Text color="primary">Account</Text>
//                 <Spacer />
//                 <Image systemName="chevron.right" size={14} color="secondary" />
//               </HStack>
//             </Button>
//           </Link>
//         </Section>
//       </Form>
//     </Host>
//   );
// }
