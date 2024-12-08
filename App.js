import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import Navigation from './components/Navigation';
import { authenticateWithSpotify } from './components/spotifyAuth';
import { fetchUserData, fetchUserTopTracks } from './components/spotifyApi';
import { PaperProvider,DefaultTheme, Text} from 'react-native-paper';
import { Button } from 'react-native-paper';
import styles from './style/style';

const spotifyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1db954', 
    secondary: '#212121', 
    background: '#121212', 
    surface: '#121212', 
    text: '#b3b3b3', 
    placeholder: '#535353', 
    accent: '#535353', 
  },
};

export default function App() {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [topTracks, setTopTracks] = useState([]);

  const handleLogin = async () => {
    try {
      const accessToken = await authenticateWithSpotify();
      if (!accessToken) {
        console.error('Failed to authenticate with Spotify');
        return;
      }
      setToken(accessToken);
    } catch (error) {
      console.error('Error during Spotify authentication:', error);
    }
  };

  // Kirjautumisen ulos -toiminto
  const handleLogout = () => {
    // Tyhjennetään tunnus (token) ja käyttäjätiedot
    setToken(null);
    setUserData(null);
    setTopTracks([]);
  };
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        setLoading(true);
        try {
          const userData = await fetchUserData(token);
          console.log('User Data:', userData);
          const topTracks = await fetchUserTopTracks(token);
          console.log('Top Tracks:', topTracks);
          setUserData(userData);
          setTopTracks(topTracks);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [token]);

  return (
    <PaperProvider theme={spotifyTheme}>
      <View style={{ flex: 1 }}>
        {!userData ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator size="large" color="#1db954" />
            ) : (
              <>
                <Image
                  source={require('./assets/logo1.png')}
                  style={styles.logoImage}
                />
                <Text style={styles.welcomeText}>Welcome to Spotify Stats!</Text>
                <Button mode="contained" onPress={handleLogin}>
                  Login with Spotify
                </Button>
              </>
            )}
          </View>
        ) : (
          <Navigation
            userData={userData}
            topTracks={topTracks}
            spotifyApiToken={token}
            onLogout={handleLogout}
          />
        )}
      </View>
    </PaperProvider>
  );
}