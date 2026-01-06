import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeaderGeneral from '../../components/HeaderGeneral';
import UserSettings from './components/UserSettings/UserSettings';

const SystemAdmin: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#003459' }}>
      <AppHeaderGeneral
        title="System Admin"
        searchQuery={searchQuery}
        searchActive={searchActive}
        setSearchQuery={setSearchQuery}
        setSearchActive={setSearchActive}
        showSearchButton={false}
      />
      <View style={styles.screen}>
        <UserSettings />
      </View>
    </SafeAreaView>
  );
};

export default SystemAdmin;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101726',
  },
});
