import React from 'react';
import { View, Text, Image, Linking } from 'react-native';
import styles from '../style/style.js'


export default function ProfileScreen({ userData }) {
  return (
    <View style={styles.container}>
      {userData && (
        <View style={styles.userInfoContainer}>
          {userData.images.length > 0 && (
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
            <Text style={styles.trackText}>Spotify URI: {userData.uri}</Text>
            <Text style={styles.trackText}>
              Spotify Profile: 
              <Text 
                style={styles.link} 
                onPress={() => Linking.openURL(userData.external_urls.spotify)}
              >
                {userData.external_urls.spotify}
              </Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}