import React from 'react';
import { Button, View, Text, Pressable, Image, StyleSheet} from 'react-native';


export class Entry extends React.Component {
	constructor(props) {
		super(props);
		this.navigation = props.navigation;
	}

	render() {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50}}>
				<Image style={styles.logo}
        source={require('../assets/candlepic.png')}/>
	  			<View>
				  <Pressable style = {styles.button} onPress={() => this.navigation.navigate('Sign Up')}>
						<Text style = {styles.text}>Sign Up</Text>
					</Pressable>
					<Pressable style = {styles.button} onPress={() => this.navigation.navigate('Log In')}>
						<Text style = {styles.text}>Log In</Text>
					</Pressable>
			  	</View>
					
    		</View>
		);
	}
}

const styles = StyleSheet.create({
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
	logo: {
		width: 250,
		height: 250,
		alignItems: 'center',
		justifyContent: 'center'
	  }
  });