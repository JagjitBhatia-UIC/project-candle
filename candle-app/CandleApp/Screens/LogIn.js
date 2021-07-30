import React from 'react';
import { Text, TextInput, View, StyleSheet, Image, Pressable } from 'react-native';
import axios from "axios";
import { UserData } from "../User/UserData";

export class LogIn extends React.Component {
	constructor(props) {
		super(props);
		this.navigation = props.navigation;
		this.state = {username: "", password: "", failedAttempt: false};
		this.attemptLogIn = this.attemptLogIn.bind(this);

	}

	attemptLogIn() {
		axios.post('http:192.168.1.17:8080/login', {
			username: this.state.username, 
			password: this.state.password
		}).then(res => {
			if(res.status == 202) {
				UserData.user_id = res.data.user_id;
				this.navigation.navigate('Home');
			}
		}).catch(error => {
			if(error.response.status == 401) this.setState({username: this.state.username, password: this.state.password, failedAttempt: true});
		})
	}

	render() {
		let unauthMsg;
		if(this.state.failedAttempt) unauthMsg = <Text style={styles.unauth}>Log in failed! Please re-enter username and password combination.</Text>
		return (
			<View style={{flex: 1, padding: 10, alignItems: 'center', paddingBottom: 100}}>
				{unauthMsg}
				<Image style={styles.logo}
        source={require('../assets/candlepic.png')}/>
				<View style={{marginVertical: 10}}>
					<Text>Username</Text>
					<TextInput
						style={styles.input}
						placeholder=" Enter username "
						onChangeText={text => this.setState({username: text, password: this.state.password, failedAttempt: false})}
						defaultValue={this.state.username}
					/>
				</View>
				<View style={{marginTop: 10, marginBottom: 30}}>
					<Text>Password</Text>
					<TextInput
						style={styles.input}
						placeholder=" Enter password"
						onChangeText={text => this.setState({username: this.state.username, password: text, failedAttempt: false})}
						defaultValue={this.state.password}
					/>
				</View>
				<Pressable style = {styles.button} onPress={this.attemptLogIn}>
						<Text style = {styles.text}>Log In</Text>
				</Pressable>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	input: {
	  height: 40,
	  width: 300,
	  borderWidth: 2,
	  marginTop: 10,
	  borderRadius: 8,
	},
	unauth: {
		fontSize: 12,
		color: 'red',
		fontWeight: 'bold'
	},
	logo: {
		width: 250,
		height: 250,
		alignItems: 'center',
		justifyContent: 'center'
	  },
	  text: {
		fontSize: 20,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'white',
	  },
	  button: {
		alignItems: 'center',
		paddingVertical: 20,
		paddingHorizontal: 60,
		borderRadius: 4,
		elevation: 3,
		backgroundColor: 'black',
		margin: 20,
	  },
  });