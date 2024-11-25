import React from 'react';
import { View, Button } from 'react-native';
import styles from '../style/style.js';

export default function LogoutScreen({ onLogout }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Log out" onPress={onLogout} />
    </View>
  );
}
