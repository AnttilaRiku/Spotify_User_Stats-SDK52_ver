import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/style';

import {
  fetchUserTopArtists,
  fetchUserTopGenres,
  fetchUserTopTracks,
  fetchUserRecentlyPlayedTracks,
} from '../components/spotifyApi';

export default function HomeScreen({ userData, spotifyApiToken }) {
  const [topGenres, setTopGenres] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('Top Tracks');

  // Toggles menu modal visibility
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Function to fetch and display data based on user input
  const fetchData = async (apiFunction) => {
    try {
      setLoading(true);
      const data = await apiFunction(spotifyApiToken);
      console.log('Fetched Data:', data);
      setCurrentData(data);
      //Important line of code! 
      //Ie. The original name would be printed "fetchUserTopGenres"
      //Remove "fetchUser from the name that is visible so the name is now --> "Top Genres" instead of "fetchUserTopGenres"
      //Adds spaces before uppercase letters so the name is printed --> "Top Genres"
      setCurrentTitle(apiFunction.name.replace('fetchUser', '').replace(/([A-Z])/g, ' $1').trim());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
    console.log("Spotify api token:", spotifyApiToken);
    
  };

  const menuOptions = [
    { label: 'Top Genres', onPress: () => fetchData(fetchUserTopGenres) },
    { label: 'Top Artists', onPress: () => fetchData(fetchUserTopArtists) },
    { label: 'Top Tracks', onPress: () => fetchData(fetchUserTopTracks) },
    { label: 'Recently Played', onPress: () => fetchData(fetchUserRecentlyPlayedTracks) },
  ];

  return (
    <View style={styles.container}>
      {/* User Info Section, visible all the time */}
      {userData && (
        <View style={styles.userInfoContainer}>
          {userData.images?.[0]?.url && (
            <Image
              source={{ uri: userData.images[0].url }}
              style={styles.profileImage}
            />
          )}
          <View style={styles.userDetails}>
            <Text style={styles.displayName}>Hello, {userData.display_name}!</Text>
            <Text style={styles.email}>{userData.email}</Text>
          </View>
        </View>
      )}

      {/* Current Data Section */}
      <Text style={styles.topTracksTitle}>{currentTitle}:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : currentData && currentData.length > 0 ? (
        <FlatList
        data={currentData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.trackContainer}>
            {currentTitle === 'Top Artists' && item.images?.[0]?.url && (
              <Image
                source={{ uri: item.images[0].url }}  // Access the first image URL for artist
                style={styles.trackImage}
              />
            )}
            {currentTitle === 'Top Tracks' && item.album?.images?.[0]?.url && (
              <Image
                source={{ uri: item.album.images[0].url }}  // Access the first album image URL for track
                style={styles.trackImage}
              />
            )}
            <Text style={styles.trackText}>
              {item.name} {item.artists?.map((artist) => artist.name).join(', ')}
            </Text>
          </View>
        )}
      />
      ) : (
        <Text>No data available.</Text>
      )}

      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <Ionicons name="menu" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleMenu}
      >
        <View style={styles.modalContainer}>
          <View style={styles.menu}>
            {menuOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  option.onPress();
                  toggleMenu();
                }}
              >
                <Text style={styles.menuText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}