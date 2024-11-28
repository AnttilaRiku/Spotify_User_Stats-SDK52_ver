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
import styles from '../style/style.js';

import {
  fetchUserTopArtists,
  fetchUserTopGenres,
  fetchUserTopTracks,
  fetchUserRecentlyPlayedTracks,
  fetchUserPlaylists,
} from '../components/spotifyApi';

export default function HomeScreen({ userData, spotifyApiToken }) {
  const [topGenres, setTopGenres] = useState([]); // Genret tallennetaan tähän
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('Top Tracks');
  const [playlists, setPlaylists] = useState({ created: [], subscribed: [] });

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Function to fetch and display data based on user input
  const fetchData = async (apiFunction) => {
    try {
      setLoading(true);
      const data = await apiFunction(spotifyApiToken);

      if (apiFunction === fetchUserPlaylists) {
        const createdPlaylists = data.filter(
          // Sort playlists by the creator. Checks if the playlist is created by the logged in user.
          (playlist) => playlist.owner.display_name === userData.display_name
        );
        const subscribedPlaylists = data.filter(
          (playlist) => playlist.owner.display_name !== userData.display_name
        );
        console.log("Created Playlists:", createdPlaylists);
        console.log("Subscribed Playlists:", subscribedPlaylists);

        setPlaylists({ created: createdPlaylists, subscribed: subscribedPlaylists });
        setCurrentData([]);
      } else if (apiFunction === fetchUserTopGenres) {
        setTopGenres(data); // Päivitä genret
        setCurrentData([]);
      } else {
        setCurrentData(data);
        setPlaylists([]);
        setTopGenres([]);
      }

      //console.log('Fetched Data:', data);
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
    { label: 'My Playlists', onPress: () => fetchData(fetchUserPlaylists) },
  ];

  return (
    <View style={styles.container}>
      {/* User Info Section */}
      {userData && (
        <View style={styles.userInfoContainer}>
          {userData.images?.[0]?.url && (
            <Image
              source={{ uri: userData.images[0].url }}
              style={styles.profileImage}
            />
          )}
          <View style={styles.userDetails}>
            <Text style={styles.displayName}>Hello, {userData.display_name || 'User'}!</Text>
          </View>
        </View>
      )}

      {/* Current Data Section */}
      <Text style={styles.topTracksTitle}>{currentTitle}:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : (
        <>
          {/* Genre-näkymä */}
          {currentTitle === 'Top Genres' ? (
            <FlatList
              data={topGenres}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.genreText}>{item}</Text> 
              )}
            />
          ) : currentTitle === 'My Playlists' ? (
            <>
              {/* Playlists Created by You (WIP) */}
              <Text style={styles.sectionTitle}>Playlists Created by You:</Text>
              {playlists.created.length > 0 ? (
                <FlatList
                  data={playlists.created}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.playlistContainer}>
                      {item.images?.[0]?.url && (
                        <Image
                          source={{ uri: item.images[0].url }}
                          style={styles.playlistImage}
                        />
                      )}
                      <Text style={styles.playlistText}>{item.name}</Text>
                    </View>
                  )}
                />
              ) : (
                <Text>No playlists created by you.</Text>
              )}

              {/* Playlists You've Subscribed To (WIP) */}
              <Text style={styles.sectionTitle}>Playlists You've Subscribed To:</Text>
              {playlists.subscribed.length > 0 ? (
                <FlatList
                  data={playlists.subscribed}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.playlistContainer}>
                      {item.images?.[0]?.url && (
                        <Image
                          source={{ uri: item.images[0].url }}
                          style={styles.playlistImage}
                        />
                      )}
                      <Text style={styles.playlistText}>{item.name}</Text>
                    </View>
                  )}
                />
              ) : (
                <Text>No subscribed playlists.</Text>
              )}
            </>
          ) : (
            <FlatList
              data={currentData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.trackContainer}>
                  
                  {currentTitle === 'Top Artists' && item.images?.[0]?.url ? (
                    <Image
                      source={{ uri: item.images[0].url }}
                      style={styles.trackImage}
                    />
                  ) : currentTitle === 'Top Tracks' && item.album?.images?.[0]?.url ? (
                    <Image
                      source={{ uri: item.album.images[0].url }}
                      style={styles.trackImage}
                    />
                  ) : null}
                  <Text style={styles.trackText}>
                    {item.name}
                    {item.artists?.length > 0 &&
                      ` - ${item.artists.map((artist) => artist.name).join(', ')}`}
                  </Text>
                </View>
              )}
            />
          )}
        </>
      )}

      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <Ionicons name="menu" size={24} />
      </TouchableOpacity>

      <Modal
  visible={menuVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={toggleMenu}
>
<View style={styles.modalContainer}>
<View style={styles.menu}>
      {/* Close Button */}
<TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
<Ionicons name="close" size={24} color="#121212" />
</TouchableOpacity>
 
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
