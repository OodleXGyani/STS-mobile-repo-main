import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/Header';
import AccordionList from './components/AccordionList';
import AppHeaderGeneral from '../../components/HeaderGeneral';

const UserManagement: React.FC = () => {
   const [searchQuery, setSearchQuery] = useState('');
    const [searchActive, setSearchActive] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#003459' }}>
       <AppHeaderGeneral
        title="User Management"
        searchQuery={searchQuery}
        searchActive={searchActive}
        setSearchQuery={setSearchQuery}
        setSearchActive={setSearchActive}
      />
      <View style={styles.screen}>
        <AccordionList />
      </View>
    </SafeAreaView>
  );
};

export default UserManagement;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
