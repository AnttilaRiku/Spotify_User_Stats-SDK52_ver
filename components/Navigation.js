import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import { StatusBar } from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';
import LogoutScreen from '../screens/LogoutScreen';

const Tab = createBottomTabNavigator();

export default function Navigation({ userData, topTracks,  spotifyApiToken, onLogout }) {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#121212"/>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'user' : 'user';
            } else if (route.name === 'Log out') {
              iconName = focused ? 'sign-out' : 'sign-out';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1db954',
          tabBarInactiveTintColor: '#b3b3b3',
          tabBarStyle: {
            backgroundColor: '#121212', 
            borderTopWidth: 1, 
            borderTopColor: '#1db954', 
          },
          headerStyle: {
            backgroundColor: '#121212',
            borderBottomWidth: 1, 
            borderBottomColor: '#1db954', 
           },     
           headerTintColor: '#FFFFFF',
             headerTitleStyle: {fontWeight: 'bold',},
        })}
      >
        <Tab.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              userData={userData}
              topTracks={topTracks}
              spotifyApiToken={spotifyApiToken} 
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Profile">
          {(props) => (
            <ProfileScreen
              {...props}
              userData={userData}
              spotifyApiToken={spotifyApiToken} 
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Log out">
          {(props) => (
            <LogoutScreen {...props} onLogout={onLogout} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
