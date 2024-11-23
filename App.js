import React, { useState, useEffect } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
import Navigation from './components/Navigation';
import { authenticateWithSpotify } from './components/spotifyAuth';
import { fetchUserData, fetchUserTopTracks } from './components/spotifyApi';

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
    <View style={{ flex: 1 }}>
      {!userData ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {loading ? (
            <ActivityIndicator size="large" color="#6200ee" />
          ) : (
            <Button title="Login with Spotify" onPress={handleLogin} />
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
  );
}