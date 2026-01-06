import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DriverList from './components/DriverList';
import AppHeaderGeneral from '../../components/HeaderGeneral';

const DriverManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  const [sortBy, setSortBy] = useState<'name' | 'cpr' | 'employee_id'>('name');
  const [sortType, setSortType] = useState<'asc' | 'desc'>('asc');

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'cpr', label: 'CPR' },
    { value: 'employee_id', label: 'Employee ID' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#003459' }}>
      <AppHeaderGeneral
        title="Driver Management"
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
            setSortBy(value as 'name' | 'cpr' | 'employee_id');
          }
        }}
      />

      <View style={styles.screen}>
        <DriverList
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortType={sortType}
        />
      </View>
    </SafeAreaView>
  );
};

export default DriverManagement;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101726',
  },
});
