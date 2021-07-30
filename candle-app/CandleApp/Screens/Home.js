import React from 'react';
import { Text, View, StyleSheet, FlatList} from 'react-native';
import axios from "axios";
import { UserData } from "../User/UserData";

export class Home extends React.Component {
	constructor(props) {
		super(props);
		this.navigation = props.navigation;
		this.state = {orgs: []};
	}

	populateHomePage() {
		if(UserData.user_id != "") {
			axios.get('http:192.168.1.17:8081/getOrgsByID?user_id=' + UserData.user_id).then(res => {
				this.setState({orgs: res.data.orgs});
			}).catch(err => console.log(err));
		}
	}

	componentDidMount() {
		this.populateHomePage();
	}

	componentDidUpdate() {
		this.populateHomePage();
	}

	render() {
		if(this.state.orgs.length > 0) {
		  return (
			<View style={styles.container}>
			  <FlatList
				data={this.state.orgs}
				keyExtractor={item => item._id}
				renderItem={(item) => <View><Text style={styles.sectionHeader}>{item.item.name}</Text><Text>{item.item.bio}</Text></View>}
			  />
			</View>
		  );
		}
	
		else return (
			<View style={styles.container}>
			  <Text style={styles.sectionHeader}>Looks like you're not a part of any orgs at the moment!</Text>
			</View>
		);
		
	  }
}


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