import React, {Component} from 'react';import ReactNative from 'react-native';import { List, ListItem, Icon, Card } from 'react-native-elements';const styles = require('../styles.js');const firebase = require('firebase');const { View, TouchableHighlight, Text, ListView, Switch, Button, Share, AsyncStorage } = ReactNative;                // <Icon                // raised                // name='heartbeat'                // type='font-awesome'                // color= 'white'                // onPress={()=>{this.onPressIcon(_key)}}                // />class WordItem extends Component {    constructor(props) {    super(props);    this._shareMessage = this._shareMessage.bind(this);    this._showResult = this._showResult.bind(this);    this.onPressIcon = this.onPressIcon.bind(this);    this.state= {      value_of_likes: 0,      trueSwitchIsOn: false,      };    }    componentWillMount() {      this.createDataSource(this.state.value_of_likes);      //AsyncStorage.removeItem('AlreadyLiked');      this._renderSwitchButtonWithAsyncStorage().done;    }     _renderSwitchButtonWithAsyncStorage = async() =>  {              let token = await AsyncStorage.getItem('AlreadyLiked');              if (token){                this.setState({trueSwitchIsOn: true});              }else{                this.setState({trueSwitchIsOn: false});              }            };    createDataSource(value_of_likes) {      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });      this.dataSource = ds.cloneWithRows(value_of_likes);    }            onSwitchChange(_key){            const{trueSwitchIsOn}=this.state;              switch (this.state.trueSwitchIsOn){                case false:                  return(                    <TouchableHighlight onClick={this.onPressIcon(_key)}>                    {this.setState({trueSwitchIsOn: true})}                    </TouchableHighlight>                    );                case true:                  return(                  <TouchableHighlight onClick={this.onUnPressIcon(_key)}>                    {this.setState({trueSwitchIsOn: false})}                    </TouchableHighlight>                    );                  }              }            onPressIcon(word){              AsyncStorage.setItem('AlreadyLiked', JSON.stringify({trueSwitchIsOn}));                      const{trueSwitchIsOn}=this.state;                        //Initialize Firebase                        var config = {                        apiKey: "AIzaSyDWedZY1svNHxPUi2ReQJTlCf9Q60407E8",                        authDomain: "streetfrench-a84df.firebaseapp.com",                        databaseURL: "https://streetfrench-a84df.firebaseio.com"                        };                        var ref = firebase.database().ref();                        let childItem = word+"/likes";                        //Create reference                        var likes_words = ref.child("items").child(word).child("likes");                              // Increment by One                               likes_words.transaction(function(currentLike) {                                      return currentLike + 1;                                });                               //Sync Object Changes                               likes_words.on('value', snapshot => {                                      value_of_likes = snapshot.val()                                });                               this.setState({ value_of_likes: value_of_likes});                               this.setState({trueSwitchIsOn : true});                               console.log(value_of_likes)                      }          onUnPressIcon(word){            AsyncStorage.removeItem('AlreadyLiked');            //const{trueSwitchIsOn}=this.state;                        //Initialize Firebase                        var config = {                        apiKey: "AIzaSyDWedZY1svNHxPUi2ReQJTlCf9Q60407E8",                        authDomain: "streetfrench-a84df.firebaseapp.com",                        databaseURL: "https://streetfrench-a84df.firebaseio.com"                        };                        var ref = firebase.database().ref();                        let childItem = word+"/likes";                        //Create reference                        var likes_words = ref.child("items").child(word).child("likes");                              // Increment by One                               likes_words.transaction(function(currentLike) {                                      return currentLike - 1;                                });                               //Sync Object Changes                               likes_words.on('value', snapshot => {                                      value_of_likes = snapshot.val()                                });                               this.setState({ value_of_likes: value_of_likes});                               this.setState({trueSwitchIsOn : false});                               console.log(value_of_likes)                      }           _showResult(result){              return (this.state.value_of_likes);           }            _shareMessage() {              Share.share({                message: 'StreetFrench : check out this word!',                url: undefined,              }).then(this._showResult);              console.log(this.state.result)            }render() {    const {english, english_erudite, likes, _key} = this.props.navigation.state.params;    return (        <TouchableHighlight>            <View style={styles.li}>                <Text style={styles.liText} >{english}</Text>                <Text style={styles.liText} >{english_erudite}</Text>                <Text style={{marginBottom: 10}}>                 {this.state.value_of_likes !== 0 ? <Text>{this.state.value_of_likes} likes</Text> : <Text>{likes} likes</Text>}                </Text>                {this._renderSwitchButtonWithAsyncStorage}                <Switch                    onValueChange={(value)=>this.onSwitchChange(_key)}                    style={{marginBottom: 10}}                    value={this.state.trueSwitchIsOn}                />                 <Icon                name='facebook'                type='font-awesome'                color='#417fa4'                onPress={()=>{this._shareMessage(_key)}}                />           </View>        </TouchableHighlight>    );}}export default WordItem;