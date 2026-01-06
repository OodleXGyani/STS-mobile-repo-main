import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VehicleList from './components/VehicleList';
import AppHeaderGeneral from '../../components/HeaderGeneral';

const VehicleManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  const [sortBy, setSortBy] = useState<'name' | 'reg_no'>('name');
  const [sortType, setSortType] = useState<'asc' | 'desc'>('asc');

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'reg_no', label: 'Reg No' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#003459' }}>
      <AppHeaderGeneral
        title="Vehicle Management"
        searchQuery={searchQuery}
        searchActive={searchActive}
        setSearchQuery={setSearchQuery}
        setSearchActive={setSearchActive}
        showSearchButton
        showSortButton
        sortBy={sortBy}
        sortType={sortType}
        sortOptions={sortOptions}
        onSortSelect={value => {
          if (value === 'asc' || value === 'desc') {
            setSortType(value);
          } else {
            setSortBy(value as 'name' | 'reg_no');
          }
        }}
      />
      <View style={styles.screen}>
        <VehicleList
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortType={sortType}
        />
      </View>
    </SafeAreaView>
  );
};

export default VehicleManagement;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101726',
  },
});
