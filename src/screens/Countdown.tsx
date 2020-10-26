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
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useScrollToTop } from '@react-navigation/native';

function Countdown({ route, navigation }: any) {
  // const colorScheme = Appearance.getColorScheme();
  const [showButtons, setShowButtons] = useState(false);
  const [selections, setSelections] = useState<string[]>([]);
  const [countdownMovies, setCountdownMovies] = useState([]);
  const [countdownGames, setCountdownGames] = useState([]);
  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);

  useEffect(() => {
    if (route.params.uid) {
      const movieSubscription = firestore().collection('users').doc(route.params.uid).collection('items').orderBy("release_date").where("mediaType", "==", "movie")
        .onSnapshot(querySnapshot => { onResult(querySnapshot, "movies") }, onError);

      const gameSubscription = firestore().collection("users").doc(route.params.uid).collection('items').orderBy("date").where("mediaType", "==", "game")
        // firestore().collection("games").orderBy("date").where("owner", "==", user.uid)
        .onSnapshot(querySnapshot => { onResult(querySnapshot, "games") }, onError);

      // Stop listening for updates when no longer required
      return () => {
        // Unmounting
        movieSubscription();
        gameSubscription();
      };
    }
  }, [route.params.uid]);

  useEffect(() => {
    setListData([
      { data: countdownMovies, title: "Movies" },
      { data: countdownGames, title: "Games" }
    ])
  }, [countdownGames, countdownMovies])

  function onResult(querySnapshot: FirebaseFirestoreTypes.QuerySnapshot, mediaType: "movies" | "games") {
    // console.log(querySnapshot.docs);
    let tempMedia: any = []
    querySnapshot.docs.forEach(doc => {
      // console.log(doc.data())
      let data = doc.data();
      data.documentID = doc.id;
      tempMedia.push(data);
    });
    // State change here is forcing user back to home page on addToList();
    mediaType === "movies" ? setCountdownMovies(tempMedia) : setCountdownGames(tempMedia);
  }

  function onError(error: any) {
    console.error("error", error);
  }

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

  function deleteItems() {
    selections.forEach(documentID => {
      // Animate as if deleting and then delete
      // Animate height to 0
      firestore().collection('users').doc(route.params.uid).collection("items").doc(documentID).delete().then(() => {
        console.log('Document deleted!');
      });
      setSelections([]);
    });
  }

  return (
    <SectionList
      contentContainerStyle={{ paddingVertical: 16, marginHorizontal: 16 }}
      sections={listData}
      stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => item + index}
      renderItem={data =>
        <CountdownItem
          item={data.item}
          sectionName={data.section.title}
          isFirstInSection={data.index === 0}
          // isLastInSection={data.section.title === "Movies" ? data.index + 1 === route.params.movies.length : data.index + 1 === route.params.games.length}
          isLastInSection={data.section.title === "Movies" ? data.index + 1 === countdownMovies.length : data.index + 1 === countdownGames.length}
          showButtons={showButtons}
          selected={selections.indexOf(data.item.documentID) > -1}
          updateSelections={updateSelections}
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
