import React from 'react';
import { View, Image } from 'react-native'; 
import { Button, Text } from 'react-native-paper'; 
import { authenticateWithSpotify } from './spotifyAuth';
import { fetchUserData } from './spotifyApi';
import styles from '../style/style.js';

export default function LoginScreen({ navigation, setToken, setUserData }) {

  const handleLogin = async () => {
    const accessToken = await authenticateWithSpotify();
    if (accessToken) {
      setToken(accessToken);
      const userData = await fetchUserData(accessToken);
      setUserData(userData);
      navigation.navigate('Home'); 
    } else {
      console.log('Login failed');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      
      <Button mode="contained" onPress={handleLogin}>
        Login with Spotify
      </Button>
    </View>
  );
}
