import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import CreateAdScreen from './src/screens/CreateAdScreen';
import ListItemScreen from './src/screens/ListItemScreen';
import AccountScreen from './src/screens/AccountScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const StackNavigator = () => {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />

    </Stack.Navigator>
  )
}
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === 'CreateAdScreen') {
            iconName = 'home'
          } else if (route.name === 'ListScreen') {
            iconName = 'plus-circle'
          }
          else if (route.name === 'AccountScreen') {
            iconName = 'user'
          }
          return <View style={styles.iconStyle}><Feather name={iconName} size={35} color={color} /></View>
        },
        headerShown: false,
        tabBarActiveTintColor: 'deepskyblue',
        tabBarInactiveTintColor: 'gray',
      })}
    >


      <Tab.Screen name="CreateAdScreen" component={CreateAdScreen} options={{ title: '' }} />
      <Tab.Screen name="ListScreen" component={ListItemScreen} options={{ title: '' }} />
      <Tab.Screen name="AccountScreen" component={AccountScreen} options={{ title: '' }} />
    </Tab.Navigator>
  )
}
const Navigation = () => {
  const [isLogedin, setIsLogedIn] = useState(false)

  const [user, setUser] = useState('')
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {

        setUser(user)
        // ...
      } else {
        setUser('')
      }
    });
  }, [])
 
  return (
    <NavigationContainer>
      {user ? <TabNavigator/> :  <StackNavigator /> }

    </NavigationContainer>
  )
}
export default function App() {

 

  return (
    <>
      <StatusBar barStyle="dark content" backgroundColor='deepskyblue' />
      <View style={styles.container}>
        <Navigation />

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'transparent',

  },
  iconStyle: {
    borderColor: 'white',
    borderRadius: 30,
    top: 10,
    alignSelf: 'center'
  }
});
