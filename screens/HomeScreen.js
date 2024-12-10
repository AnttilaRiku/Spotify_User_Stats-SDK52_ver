import React, { useState, useEffect } from 'react';
import artistsComments from '../components/artistComments.json';
import genreComments from '../components/genreComments.json';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
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
  const [topGenres, setTopGenres] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('Summary');
  const [playlists, setPlaylists] = useState({ created: [], subscribed: [] });
  const [summary, setSummary] = useState('');

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const [artists, tracks, genres] = await Promise.all([
        fetchUserTopArtists(spotifyApiToken),
        fetchUserTopTracks(spotifyApiToken),
        fetchUserTopGenres(spotifyApiToken),
      ]);

      let summaryText = '';

      const topArtist = artists[0];
      if (topArtist) {
        const artistComment = artistsComments[topArtist.name] || `You seem to enjoy ${topArtist.name}!`;
        summaryText += `Top Artist: ${topArtist.name}. ${artistComment}\n`;
      }

      const topGenre = genres[0];
      if (topGenre) {
        const genreComment = genreComments[topGenre] || `You like ${topGenre}, great choice!`;
        summaryText += `Top Genre: ${topGenre}. ${genreComment}\n`;
      }

      const topTrack = tracks[0];
      if (topTrack) {
        summaryText += `Top Track: ${topTrack.name} by ${topTrack.artists.map((a) => a.name).join(', ')}.`;
      }

      setSummary(summaryText);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData('Summary');
  }, []);


  const fetchData = async (apiFunction) => {
    try {
      setLoading(true);
      if (apiFunction === 'Summary') {
        await fetchSummary();
        setCurrentData(null);
        setCurrentTitle('Summary');
      } else {
        const data = await apiFunction(spotifyApiToken);


        if (apiFunction === fetchUserRecentlyPlayedTracks) {
          console.log('Fetched Recently Played Data:', data);
          setCurrentData(data); // Save recently played tracks data
        } else if (apiFunction === fetchUserPlaylists) {
          const createdPlaylists = data.filter(
            (playlist) => playlist.owner.display_name === userData.display_name
          );
          const subscribedPlaylists = data.filter(
            (playlist) => playlist.owner.display_name !== userData.display_name
          );
          setPlaylists({ created: createdPlaylists, subscribed: subscribedPlaylists });
        } else if (apiFunction === fetchUserTopGenres) {
          setTopGenres(data);
          setPlaylists([]);
          setCurrentData([]);
        } else {
          setCurrentData(data);
          setPlaylists([]);
          setTopGenres([]);
        }

        setCurrentTitle(apiFunction.name.replace('fetchUser', '').replace(/([A-Z])/g, ' $1').trim());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentTitle === 'Recently Played') {
      console.log('Recently Played Data:', currentData);
    }

  }, [currentData]);
  const menuOptions = [
    { label: 'Summary', onPress: () => fetchData('Summary') },
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

      {/* Title Section */}
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitle}>{currentTitle}</Text>
      </View>

      {/* Summary Section */}
      {currentTitle === 'Summary' && !loading && (
        <Text style={styles.menuText}>{summary}</Text>
      )}
      <>

        {currentTitle === 'Recently Played' && !loading && (
          <FlatList
            data={currentData}
            keyExtractor={(item) => item.id || item.played_at}
            renderItem={({ item }) => (
              <View style={styles.trackContainer}>
                <View style={styles.trackDetails}>
                  <Text style={styles.trackName}>{item.track.name}</Text>
                  <Text style={styles.trackArtist}>
                    {item.track.artists.map((artist) => artist.name).join(', ')}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
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
