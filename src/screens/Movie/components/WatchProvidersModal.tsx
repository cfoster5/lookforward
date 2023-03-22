import { DynamicHeightModal } from "components/DynamicHeightModal";
import TabStackContext from "contexts/TabStackContext";
import { calculateWidth } from "helpers/helpers";
import { WatchLocale } from "interfaces/tmdb";
import React, { useContext } from "react";
import {
  FlatList,
  Image,
  Linking,
  PlatformColor,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSColors, iOSUIKit } from "react-native-typography";

import { horizontalListProps } from "../Movie";

function WatchProvidersModal({
  modalRef,
  providers,
}: {
  modalRef;
  providers: WatchLocale["US"];
}) {
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const { theme } = useContext(TabStackContext);
  const mod = {
    ...horizontalListProps,
    style: { ...horizontalListProps.style, marginTop: 8 },
  };

  return (
    <DynamicHeightModal modalRef={modalRef}>
      <View style={{ paddingBottom: safeBottomArea }}>
        <View
          style={{
            margin: 16,
            marginBottom: 0,
            flex: 1,
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
                color: PlatformColor("systemBlue"),
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
                          uri: `https://image.tmdb.org/t/p/w154${item.logo_path}`,
                        }}
                        style={{
                          height: calculateWidth(16, 8, 4.5),
                          width: calculateWidth(16, 8, 4.5),
                          borderWidth: 1,
                          borderColor:
                            theme === "dark"
                              ? PlatformColor("systemGray6")
                              : "#e0e0e0",
                          borderRadius: 8,
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
            )
        )}
        <View
          style={{
            flex: 1,
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
              color: PlatformColor("systemGray"),
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
      </View>
    </DynamicHeightModal>
  );
}

export default WatchProvidersModal;
