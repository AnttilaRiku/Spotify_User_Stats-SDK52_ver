import React from 'react';
import { View, Button, Text } from 'react-native';
import { authenticateWithSpotify } from './spotifyAuth';
import { fetchUserData } from './spotifyApi';

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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Login with Spotify" onPress={handleLogin} />
    </View>
  );
}