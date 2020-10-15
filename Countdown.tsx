import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  Appearance,
  Text,
  View,
  StyleSheet,
  SectionList,
  Animated,
} from 'react-native';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CountdownItem from './components/CountdownItem';
import { HeaderButton, HeaderButtons, Item } from 'react-navigation-header-buttons';

function Countdown({ route, navigation }: any) {
  const colorScheme = Appearance.getColorScheme();
  const [showButtons, setShowButtons] = useState(false);
  const [selections, setSelections] = useState<string[]>([]);

  const IoniconsHeaderButton = (props) => (
    // the `props` here come from <Item ... />
    // you may access them and pass something else to `HeaderButton` if you like
    <HeaderButton IconComponent={Ionicons} iconSize={30} color={iOSColors.blue} {...props} />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          {!showButtons &&
            <Item title="Edit" onPress={() => { setShowButtons(true); startAnimation() }} />
          }
          {showButtons && selections.length === 0 &&
            <Item title="Done" buttonStyle={{ ...iOSUIKit.bodyEmphasizedObject, color: iOSColors.blue }} onPress={() => { setShowButtons(false); startAnimation() }} />
          }
          {showButtons && selections.length !== 0 &&
            <Item title="Delete" buttonStyle={{ ...iOSUIKit.bodyEmphasizedObject, color: iOSColors.red }} onPress={() => { setShowButtons(false); startAnimation() }} />
          }
        </HeaderButtons>
      )
    });
  }, [navigation, showButtons, selections]);

  const transformAnim = useRef(new Animated.Value(!showButtons ? -16 : 16)).current;
  const opacityAnim = useRef(new Animated.Value(!showButtons ? 0 : 1)).current;


  function startAnimation() {
    Animated.timing(
      transformAnim,
      {
        toValue: !showButtons ? 16 : -16,
        duration: 250,
        useNativeDriver: true
      }
    ).start();

    Animated.timing(
      opacityAnim,
      {
        toValue: !showButtons ? 1 : 0,
        duration: 250,
        useNativeDriver: true
      }
    ).start();
  }

  const SlideView = (props) => {
    return (
      <Animated.View
        style={{
          ...props.style,
          transform:
            [{ translateX: transformAnim }]
        }}
      >
        {props.children}
      </Animated.View>
    );
  }

  const FadeView = (props) => {
    return (
      <Animated.View
        style={{
          ...props.style,
          opacity: opacityAnim
        }}
      >
        {props.children}
      </Animated.View>
    );
  }

  const [listData, setListData] = useState([
    { data: route.params.movies, title: "Movies" },
    { data: route.params.games, title: "Games" }
  ])

  const renderSectionHeader = ({ section }) => <View style={{ backgroundColor: "#1f1f1f" }}><Text style={{
    ...iOSUIKit.title3EmphasizedWhiteObject,
    marginLeft: 16,
    marginVertical: 16,
  }}
  >
    {section.title}
  </Text>
  </View>;

  function updateSelections(documentID: string) {
    let tempSelections = selections.slice();
    let selectionIndex = tempSelections.indexOf(documentID)
    if (selectionIndex === -1) {
      tempSelections.push(documentID);
    }
    else {
      tempSelections.splice(selectionIndex, 1)
    }
    setSelections(tempSelections);
  }

  return (
    <SectionList
      contentContainerStyle={{ paddingVertical: 16, marginHorizontal: 16 }}
      sections={listData}
      stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }) => <CountdownItem item={item} showButtons={showButtons} selected={selections.indexOf(item.documentID) > -1} updateSelections={updateSelections} SlideView={SlideView} FadeView={FadeView} />}
      renderSectionHeader={renderSectionHeader}
      ListHeaderComponent={<View style={{ height: 16, backgroundColor: "#1f1f1f", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}></View>}
      ListFooterComponent={<View style={{ height: 16, backgroundColor: "#1f1f1f", borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}></View>}
    />
  );
};

const styles = StyleSheet.create({
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
  }
});

export default Countdown;
