import { useNavigation, NavigationProp } from "@react-navigation/native";
import { PlatformColor, Pressable, StyleSheet, Text, View } from "react-native";

import { CountdownStackParamList } from "@/types/navigation";

interface HorizontalSectionHeaderProps {
  title: string;
  sectionType: "Movies" | "Games" | "People";
}

export function HorizontalSectionHeader({
  title,
  sectionType,
}: HorizontalSectionHeaderProps) {
  const navigation = useNavigation<NavigationProp<CountdownStackParamList>>();

  const handleSeeAllPress = () => {
    navigation.navigate("SeeAll", { sectionType, title });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={handleSeeAllPress} hitSlop={8}>
        <Text style={styles.seeAllButton}>See All</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: PlatformColor("label"),
  },
  seeAllButton: {
    fontSize: 16,
    color: PlatformColor("systemBlue"),
    fontWeight: "400",
  },
});
