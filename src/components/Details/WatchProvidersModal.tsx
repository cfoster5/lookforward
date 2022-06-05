import React, { useContext } from "react";
import {
  FlatList,
  Image,
  Platform,
  SectionList,
  Text,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import TabStackContext from "../../contexts/TabStackContext";
import { calculateWidth } from "../../helpers/helpers";
import { WatchLocale } from "../../interfaces/tmdb";
import { horizontalListProps } from "./MovieDetails";

function WatchProvidersModal({
  modalRef,
  providers,
}: {
  modalRef: Modalize;
  providers: WatchLocale["US"];
}) {
  const tabBarheight = useBottomTabBarHeight();
  const { theme } = useContext(TabStackContext);

  return (
    <Modalize
      ref={modalRef}
      adjustToContentHeight={true}
      childrenStyle={{
        marginBottom: Platform.OS === "ios" ? tabBarheight + 16 : 16,
      }}
      modalStyle={theme === "dark" ? { backgroundColor: "#121212" } : {}}
    >
      {[
        { title: "Stream on", data: providers?.flatrate },
        { title: "Rent on", data: providers?.rent },
        { title: "Buy on", data: providers?.buy },
      ].map((obj) => (
        <View style={{ marginHorizontal: 16 }}>
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
                    borderColor: theme === "dark" ? "#1f1f1f" : "#e0e0e0",
                    borderRadius: 8,
                  }}
                />
                <Text
                  style={{
                    ...iOSUIKit.bodyObject,
                    color: iOSColors.gray,
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  {item.provider_name}
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            {...horizontalListProps}
          />
        </View>
      ))}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginTop: 16,
          marginHorizontal: 16,
          alignItems: "center",
          alignSelf: "flex-end",
        }}
      >
        <Text
          style={{
            ...iOSUIKit.footnoteObject,
            color: iOSColors.gray,
            marginRight: 8,
          }}
        >
          powered by
        </Text>
        <Image
          source={require("../../../assets/JustWatch-logo-large.webp")}
          style={{
            height: iOSUIKit.footnoteObject.fontSize,
            width: iOSUIKit.footnoteObject.fontSize * (505 / 76),
          }}
        />
      </View>
    </Modalize>
  );
}

export default WatchProvidersModal;
