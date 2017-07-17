'use strict';
import Expo from 'expo';
import React, {Component, TextInput, ActivityIndicator} from 'react';
import ReactNative from 'react-native';
import SearchBar from 'react-native-searchbar';
import firebase from 'firebase';
import StatusBar from './components/StatusBar';
import ListOfWords from './components/ListOfWords';
import WordItem from './components/WordItem';
import Spinner from './components/common/Spinner';
import WordOfTheDay from './components/WordOfTheDay';
import { List, ListItem } from 'react-native-elements';
import SplashScreen from './components/SplashScreen';
import Animation from 'lottie-react-native';
const styles = require('./styles.js');


const {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  Switch
} = ReactNative;


import {
  StackNavigator,
} from 'react-navigation';



// Initialize Firebase
const firebaseConfig = {
     apiKey: "AIzaSyDWedZY1svNHxPUi2ReQJTlCf9Q60407E8",
    authDomain: "streetfrench-a84df.firebaseapp.com",
    databaseURL: "https://streetfrench-a84df.firebaseio.com",
    projectId: "streetfrench-a84df",
    storageBucket: "streetfrench-a84df.appspot.com",
    messagingSenderId: "551358813028"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);


class FirebaseReactNative extends Component {

 static navigationOptions = {
    title: 'Street French !',
  };


  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      wordOfTheDayData: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      items: [],
      loading: true
    };
    this.itemsRef = this.getRef().child('items').limitToLast(4);
    this._handleResults = this._handleResults.bind(this);
  }


  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    this.state.loading = false;

    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          french: child.val().french,
          english: child.val().english,
          english_erudite: child.val().english_erudite,
          likes: child.val().likes,
          _key: child.key
        });
      });

      //choose word for the Day
      let i = Math.floor(Math.random() * items.length)
      var selectedItem = items[i]

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items),
        wordOfTheDayData: this.state.wordOfTheDayData.cloneWithRows([selectedItem]),
        items: items,
        loading: false
      });

    });
  }


 componentDidMount() {
    this.listenForItems(this.itemsRef);
  }


  render() {
    const { navigate } = this.props.navigation;

    if (this.state.loading) {
      return (
         <Spinner />
         )
      }
      else{
        return(
          <View style={styles.container}>


            <StatusBar title="Street French, best app to learn true french !" />


            <SearchBar
              ref={(ref) => this.searchBar = ref}
              data={this.state.items}
              handleResults={this._handleResults.bind(this)}
              showOnLoad
              allDataOnEmptySearch
            />

              <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderItem.bind(this)}
              enableEmptySections={true}
              />

              <WordOfTheDay
              dataSource={this.state.wordOfTheDayData}
              renderRow={this._renderItem.bind(this)}
              />


          </View>
          )
      }
  }


_renderItem(item) {
     const { navigate } = this.props.navigation;
     return (
      <ListItem
        title={
               <ListOfWords item={item} onPress={() =>
               navigate('Details', {...item} )} />
               }
        onPressRightIcon= {()=>
               navigate('Details', {...item} )
              }
        />
      );
}


  _handleResults(results){
    this.setState({dataSource: this.state.dataSource.cloneWithRows(results)})
  }

}



export default FirebaseReactNative;


