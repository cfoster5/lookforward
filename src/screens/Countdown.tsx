import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Appearance,
  Text,
  View,
  StyleSheet,
  SectionList,
  Animated,
  Platform,
} from 'react-native';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CountdownItem from '../components/CountdownItem';
import { HeaderButton, HeaderButtons, Item } from 'react-navigation-header-buttons';
import firestore from '@react-native-firebase/firestore';
import { useScrollToTop } from '@react-navigation/native';

interface Props {
  route: any,
  navigation: any,
  countdownMovies: any[],
  countdownGames: any[]
}

function Countdown({ route, navigation, countdownMovies, countdownGames }: Props) {
  // const colorScheme = Appearance.getColorScheme();
  const [showButtons, setShowButtons] = useState(false);
  const [selections, setSelections] = useState<{ documentID: string, sectionName: string }[]>([]);
  // const [listData, setListData] = useState([
  //   { data: countdownMovies, title: "Movies" },
  //   { data: countdownGames, title: "Games" }
  // ])
  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);

  // useEffect(() => {
  //   setListData([
  //     { data: countdownMovies, title: "Movies" },
  //     { data: countdownGames, title: "Games" }
  //   ])
  // }, [countdownGames, countdownMovies])

  const IoniconsHeaderButton = (props) => (
    // the `props` here come from <Item ... />
    // you may access them and pass something else to `HeaderButton` if you like
    <HeaderButton IconComponent={Ionicons} iconSize={30} color={iOSColors.blue} {...props} />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        Platform.OS === "ios" ?
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton} left>
            {showButtons &&
              <Item title="Delete" buttonStyle={{ ...iOSUIKit.bodyEmphasizedObject, color: selections.length === 0 ? "#48494a" : iOSColors.red }} onPress={() => {
                if (selections.length > 0) {
                  setShowButtons(false);
                  deleteItems();
                  setSelections([]);
                  startAnimation();
                }
              }} />
            }
          </HeaderButtons>
          : null
      ),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          {!showButtons &&
            <Item title="Edit" onPress={() => { setShowButtons(true); startAnimation() }} />
          }
          {Platform.OS === "ios" ?
            showButtons &&
            <Item title="Done" buttonStyle={{ ...iOSUIKit.bodyEmphasizedObject, color: iOSColors.blue }} onPress={() => {
              setShowButtons(false);
              setSelections([]);
              startAnimation()
            }} />
            :
            showButtons && selections.length === 0 && Platform.OS === "android" &&
            <Item title="Done" buttonStyle={{ ...iOSUIKit.bodyEmphasizedObject, color: iOSColors.blue }} onPress={() => {
              setShowButtons(false);
              setSelections([]);
              startAnimation()
            }} />
          }
          {/* {(showButtons && Platform.OS === "ios") || (showButtons && selections.length === 0 && Platform.OS === "android") &&
            <Item title="Done" buttonStyle={{ ...iOSUIKit.bodyEmphasizedObject, color: iOSColors.blue }} onPress={() => {
              setShowButtons(false);
              setSelections([]);
              startAnimation()
            }} />
          } */}
          {Platform.OS === "android" && showButtons && selections.length > 0 &&
            <Item title="Delete" buttonStyle={{ ...iOSUIKit.bodyEmphasizedObject, color: selections.length === 0 ? "#48494a" : iOSColors.red }} onPress={() => {
              if (selections.length > 0) {
                setShowButtons(false);
                deleteItems();
                setSelections([]);
                startAnimation();
              }
            }} />
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
    // { data: route.params.movies, title: "Movies" },
    // { data: route.params.games, title: "Games" }
    { data: countdownMovies, title: "Movies" },
    { data: countdownGames, title: "Games" }
  ])

  const renderSectionHeader = ({ section }) => <View style={{ backgroundColor: "#1f1f1f" }}><Text style={{
    ...iOSUIKit.title3EmphasizedWhiteObject,
    marginLeft: 16,
    marginVertical: 8,
  }}
  >
    {section.title}
  </Text>
  </View>;

  function updateSelections(documentID: string, sectionName: string) {
    console.log('sectionName', sectionName)
    let tempSelections = selections.slice();
    let selectionIndex = tempSelections.findIndex(obj => obj.documentID === documentID)
    if (selectionIndex === -1) {
      tempSelections.push({ documentID: documentID, sectionName: sectionName });
    }
    else {
      tempSelections.splice(selectionIndex, 1)
    }
    setSelections(tempSelections);
  }

  async function deleteItems() {
    selections.forEach(async selection => {
      // Animate as if deleting and then delete
      // Animate height to 0
      try {
        await firestore().collection(selection.sectionName === "Movies" ? "movies" : "gameReleases").doc(selection.documentID).update({
          subscribers: firestore.FieldValue.arrayRemove(route.params.uid)
        })
        console.log("Document successfully written!");
      } catch (error) {
        console.error("Error writing document: ", error);
      }
      setSelections([]);
    });
  }

  return (
    <SectionList
      contentContainerStyle={{ paddingVertical: 16, marginHorizontal: 16 }}
      // sections={listData}
      sections={[
        { data: countdownMovies, title: "Movies" },
        { data: countdownGames, title: "Games" }
      ]}
      stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => item + index}
      renderItem={data =>
        <CountdownItem
          navigation={navigation}
          item={data.item}
          sectionName={data.section.title}
          isFirstInSection={data.index === 0}
          // isLastInSection={data.section.title === "Movies" ? data.index + 1 === route.params.movies.length : data.index + 1 === route.params.games.length}
          isLastInSection={data.section.title === "Movies" ? data.index + 1 === countdownMovies.length : data.index + 1 === countdownGames.length}
          showButtons={showButtons}
          selected={selections.findIndex(obj => obj.documentID === data.item.documentID) > -1}
          updateSelections={documentID => updateSelections(documentID, data.section.title)}
          SlideView={SlideView}
          FadeView={FadeView}
        />
      }
      renderSectionHeader={renderSectionHeader}
      ListHeaderComponent={<View style={{ height: 16, backgroundColor: "#1f1f1f", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}></View>}
      ListFooterComponent={<View style={{ height: 16, backgroundColor: "#1f1f1f", borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}></View>}
      ref={scrollRef}
    />
  );
};

export default Countdown;
