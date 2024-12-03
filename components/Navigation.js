import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Alert, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function Navigation({ userData, topTracks, spotifyApiToken, onLogout }) {
  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: onLogout },
      ],
      { cancelable: true }
    );
  };

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
          headerTitleStyle: { fontWeight: 'bold',},
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
        <Tab.Screen
          name="Log out"
          component={() => null} 
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); 
              handleLogout(); 
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
