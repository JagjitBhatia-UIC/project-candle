import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Entry } from './Screens/Entry';
import { SignUp } from './Screens/SignUp';
import { LogIn } from './Screens/LogIn';
import { Home } from './Screens/Home';

const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name = "Welcome" component = {Entry} options={{headerShown: false }}/>
          <Stack.Screen name = "Sign Up" component = {SignUp}/>
          <Stack.Screen name = "Log In" component = {LogIn}/>
          <Stack.Screen name = "Home" component = {Home}/>
        </Stack.Navigator>
    </NavigationContainer>
    );
  }
}