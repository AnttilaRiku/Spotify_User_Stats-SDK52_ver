import React, { useEffect, useState } from 'react';
import { View, Text, Image, Linking, ActivityIndicator } from 'react-native';
import styles from '../style/style.js';
import { fetchUserData, fetchListeningTimes } from '../components/spotifyApi.js'; 

export default function ProfileScreen({ spotifyApiToken }) {
  const [userData, setUserData] = useState(null);
  const [listeningTimes, setListeningTimes] = useState({
    week: 0,
    month: 0,
    year: 0,
  });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      if (!spotifyApiToken) {
        console.error('No token provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true); 

        const userDataResponse = await fetchUserData(spotifyApiToken); 
        setUserData(userDataResponse);

        const listeningTimesResponse = await fetchListeningTimes(spotifyApiToken); 
        setListeningTimes(listeningTimesResponse);
      } catch (error) {
        console.error('Error fetching user data or listening times:', error);
        setListeningTimes({
          week: 0,
          month: 0,
          year: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (spotifyApiToken) {
      fetchData();
    }
  }, [spotifyApiToken]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userData ? (
        <View style={styles.userInfoContainer}>
          {userData.images?.length > 0 && (
            <Image
              source={{ uri: userData.images[0].url }}
              style={styles.profileImage}
            />
          )}
          <View style={styles.userDetails}>
            <Text style={styles.displayName}>{userData.display_name}</Text>
            <Text style={styles.trackText}>{userData.email}</Text>
            <Text style={styles.trackText}>Country: {userData.country}</Text>
            <Text style={styles.trackText}>Spotify ID: {userData.id}</Text>
            <Text style={styles.trackText}>Followers: {userData.followers.total}</Text>
            <Text style={styles.trackText}>Product: {userData.product}</Text>
            <Text style={styles.trackText}>
              Spotify Profile: 
              <Text 
                style={styles.link} 
                onPress={() => Linking.openURL(userData.external_urls.spotify)}
              >
                {userData.external_urls.spotify}
              </Text>
            </Text>

            <Text style={styles.trackText}>
              Listening Time Weekly: {listeningTimes.week} hours
            </Text>
            <Text style={styles.trackText}>
              Listening Time Monthly: {listeningTimes.month} hours
            </Text>
            <Text style={styles.trackText}>
              Listening Time Yearly: {listeningTimes.year} hours
            </Text>
          </View>
        </View>
      ) : (
        <Text style={styles.trackText}>Unable to load user data.</Text> 
      )}
    </View>
  );
}