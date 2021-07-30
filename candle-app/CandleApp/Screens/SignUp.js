import React from 'react';
import { Text, TextInput, View, StyleSheet, Image, Pressable } from 'react-native';

export class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.navigation = props.navigation;
		this.state = {input: ""};
	}

	render() {
		return (
			<View style={{flex: 1, padding: 10, alignItems: 'center', paddingBottom: 100}}>
				<Image style={styles.logo}
        source={require('../assets/candlepic.png')}/>
				<View style={{marginVertical: 10}}>
					<Text>Username</Text>
					<TextInput
						style={styles.input}
						placeholder=" Enter username "
						onChangeText={text => this.setState({input: text})}
						defaultValue={this.state.input}
					/>
				</View>
				<View style={{marginTop: 10, marginBottom: 30}}>
					<Text>Password</Text>
					<TextInput
						style={styles.input}
						placeholder=" Enter password"
						onChangeText={text => this.setState({input: text})}
						defaultValue={this.state.input}
					/>
				</View>
				<Pressable style = {styles.button} onPress={() => this.navigation.navigate('Sign Up')}>
						<Text style = {styles.text}>Sign Up</Text>
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
	logo: {
		width: 250,
		height: 250,
		alignItems: 'center',
		justifyContent: 'center'
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
	  text: {
		fontSize: 20,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'white',
	  },
  });