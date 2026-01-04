import * as Colors from "@bacons/apple-colors";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { FlatList, Linking, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { LogoSize, WatchLocale } from "tmdb-ts";

import { CustomBottomSheetModal } from "@/components/CustomBottomSheetModal";
import { horizontalListProps } from "@/constants/HorizontalListProps";
import { calculateWidth } from "@/helpers/helpers";
import { useInterfaceStore } from "@/stores";

export function WatchProvidersModal({
  modalRef,
  providers,
}: {
  modalRef;
  providers: WatchLocale["US"];
}) {
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const { theme } = useInterfaceStore();
  const mod = {
    ...horizontalListProps,
    style: { ...horizontalListProps.style, marginTop: 8 },
  };

  return (
    <CustomBottomSheetModal modalRef={modalRef}>
      <BottomSheetView style={{ paddingBottom: safeBottomArea }}>
        <View
          style={{
            margin: 16,
            marginBottom: 0,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...iOSUIKit.title3EmphasizedWhiteObject,
              alignSelf: "center",
            }}
          >
            Where to watch
          </Text>
          <Pressable
            onPress={() => Linking.openURL(providers.link)}
            style={{ alignSelf: "center" }}
          >
            <Text
              style={{
                ...iOSUIKit.bodyEmphasizedObject,
                color: Colors.systemBlue,
              }}
            >
              More Info
            </Text>
          </Pressable>
        </View>
        {[
          { title: "Stream on", data: providers?.flatrate },
          { title: "Rent on", data: providers?.rent },
          { title: "Buy on", data: providers?.buy },
        ].map(
          (obj, index) =>
            obj.data && (
              <View key={index} style={{ marginHorizontal: 16 }}>
                <Text
                  style={{
                    ...iOSUIKit.bodyEmphasizedWhiteObject,
                    marginTop: 16,
                    // marginHorizontal: 16,
                  }}
                >
                  {obj.title}
                </Text>
                <FlatList
                  data={obj.data}
                  renderItem={({ item }) => (
                    <View style={{ width: calculateWidth(16, 8, 4.5) }}>
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/${LogoSize.W154}${item.logo_path}`,
                        }}
                        style={{
                          height: calculateWidth(16, 8, 4.5),
                          width: calculateWidth(16, 8, 4.5),
                          borderWidth: 1,
                          borderColor:
                            theme === "dark" ? Colors.separator : "#e0e0e0",
                          borderRadius: 12,
                        }}
                      />
                      <Text
                        style={[
                          iOSUIKit.caption2,
                          {
                            color: iOSColors.white,
                            marginTop: 8,
                            textAlign: "center",
                          },
                        ]}
                      >
                        {item.provider_name}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.provider_id.toString()}
                  {...mod}
                />
              </View>
            ),
        )}
        <View
          style={{
            flexDirection: "row",
            // marginTop: 16,
            marginVertical: 16,
            marginHorizontal: 16,
            alignItems: "center",
            alignSelf: "flex-end",
          }}
        >
          <Text
            style={{
              ...iOSUIKit.footnoteObject,
              color: Colors.systemGray,
              marginRight: 8,
            }}
          >
            powered by
          </Text>
          <Image
            source={require("../assets/JustWatch-logo-large.webp")}
            style={{
              height: iOSUIKit.footnoteObject.fontSize,
              width: iOSUIKit.footnoteObject.fontSize * (505 / 76),
            }}
          />
        </View>
      </BottomSheetView>
    </CustomBottomSheetModal>
  );
}
