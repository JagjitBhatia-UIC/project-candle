import { StatusBar } from 'expo-status-bar';
import { StackActions } from '@react-navigation/native';
import React from 'react';
import {Button, FlatList, StyleSheet, Text, View } from 'react-native';

import Axios from 'axios';

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold'
    },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export class orgList extends React.Component {
  constructor(props) {
    super(props);
	this.navigation = props.navigation;
    this.state = {
      orgs: []
    }
  }

  componentDidMount() {
    this.loadOrgs();
  }

  loadOrgs() {
    Axios.get('http:192.168.1.17:8080/getAllOrgs').then(res => {
      this.setState({orgs: res.data.orgs});
      console.log("ORGS: ", this.state.orgs);
    }).catch(error => console.log(error));
  }

  render() {
    if(this.state.orgs.length > 0) {
      return (
        <View style={styles.container}>
		  <Button title="Retreat!" onPress={() => this.navigation.dispatch(StackActions.pop(1))}/>
          <FlatList
            data={this.state.orgs}
            keyExtractor={item => item._id}
            renderItem={(item) => <View><Text style={styles.sectionHeader}>{item.item.name}</Text><Text>{item.item.bio}</Text></View>}
          />
          <StatusBar style="auto" />
        </View>
      );
    }

    else return null;
    
  }




};



