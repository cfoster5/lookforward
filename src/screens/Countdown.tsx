import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Text, View, SectionList, Animated, Platform } from 'react-native';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CountdownItem from '../components/CountdownItem';
import { HeaderButton, HeaderButtons, Item } from 'react-navigation-header-buttons';
import firestore from '@react-native-firebase/firestore';
import { RouteProp, useScrollToTop } from '@react-navigation/native';
import UserContext from '../UserContext';
import { GameSubContext, MovieSubContext, ShowSubContext } from '../SubContexts';
import { getNextEpisode } from '../helpers/requests';
import { Navigation, Trakt } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  route: RouteProp<Navigation.CountdownStackParamList, 'Countdown'>
  navigation: StackNavigationProp<Navigation.CountdownStackParamList, 'Countdown'>;
}

function Countdown({ route, navigation }: Props) {
  const [showButtons, setShowButtons] = useState(false);
  const [selections, setSelections] = useState<{ documentID: string, sectionName: string }[]>([]);
  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);
  const transformAnim = useRef(new Animated.Value(!showButtons ? -16 : 16)).current;
  const opacityAnim = useRef(new Animated.Value(!showButtons ? 0 : 1)).current;
  const uid = useContext(UserContext)
  const movieSubs = useContext(MovieSubContext)
  const gameSubs = useContext(GameSubContext)
  const showSubs = useContext(ShowSubContext)
  const [nextEpisodes, setNextEpisodes] = useState<Trakt.NextEpisode[]>([]);
  const [listData, setListData] = useState([
    // { data: route.params.movies, title: "Movies" },
    // { data: route.params.games, title: "Games" }
    { data: movieSubs, title: "Movies" },
    { data: gameSubs, title: "Games" },
    { data: nextEpisodes, title: "Shows" }
  ])

  useEffect(() => {
    // TODO: Fix bug that removes next epidsodes from countdown on addition/removal
    let tempNextEpisodes: any[] = [];
    for (const show of showSubs) {
      getNextEpisode(show.documentID as number).then(nextEpisode => {
        // console.log(`nextEpisode from TabNav`, nextEpisode);
        (show as any).nextEpisode = nextEpisode;
        tempNextEpisodes.push(show);
      })
        .catch(err => console.log(`err`, err));
    }
    setNextEpisodes(tempNextEpisodes);
  }, [showSubs])

  useEffect(() => {
    console.log(`nextEpisodes from Countdown`, nextEpisodes)
  }, [nextEpisodes])

  useEffect(() => {
    setListData([
      { data: movieSubs, title: "Movies" },
      { data: gameSubs, title: "Games" },
      { data: nextEpisodes, title: "Shows" }
    ])
  }, [gameSubs, movieSubs, nextEpisodes])

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

  function startAnimation() {
    Animated.parallel([
      Animated.timing(transformAnim, {
        toValue: !showButtons ? 16 : -16,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: !showButtons ? 1 : 0,
        duration: 250,
        useNativeDriver: true
      })
    ]).start();
  }

  const renderSectionHeader = ({ section }) => (
    <View style={{ backgroundColor: "#1f1f1f" }}>
      <Text style={{
        ...iOSUIKit.title3EmphasizedWhiteObject,
        marginLeft: 16,
        marginVertical: 8,
      }}
      >
        {section.title}
      </Text>
    </View>
  );

  function updateSelections(documentID: string, sectionName: string) {
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
    for (const selection of selections) {
      // Animate as if deleting and then delete
      // Animate height to 0
      let collection = "";
      if (selection.sectionName === "Movies") { collection = "movies" };
      if (selection.sectionName === "Games") { collection = "gameReleases" };
      if (selection.sectionName === "Shows") { collection = "shows" };
      try {
        await firestore().collection(collection).doc(selection.documentID).update({
          subscribers: firestore.FieldValue.arrayRemove(uid)
        })
        console.log("Document successfully written!");
      } catch (error) {
        console.error("Error writing document: ", error);
      }
      setSelections([]);
    };
  }

  return (
    <SectionList
      contentContainerStyle={{ paddingVertical: 16, marginHorizontal: 16 }}
      // sections={listData}
      sections={[
        { data: movieSubs, title: "Movies" },
        { data: gameSubs, title: "Games" },
        { data: nextEpisodes, title: "Shows" }
      ]}
      stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => item + index}
      renderItem={data =>
        <CountdownItem
          navigation={navigation}
          item={data.item}
          sectionName={data.section.title}
          // isLastInSection={data.section.title === "Movies" ? data.index + 1 === route.params.movies.length : data.index + 1 === route.params.games.length}
          isLastInSection={data.section.title === "Movies" ? data.index + 1 === movieSubs.length : data.index + 1 === gameSubs.length}
          showButtons={showButtons}
          selected={selections.findIndex(obj => obj.documentID === data.item.documentID) > -1}
          updateSelections={documentID => updateSelections(documentID, data.section.title)}
          transformAnim={transformAnim}
          opacityAnim={opacityAnim}
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
