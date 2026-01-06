import React from 'react';
import { View, Text } from 'react-native';
import MapSearch from './MapSearch';

interface SearchResult {
  id: string;
  title: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface MapSearchControlsProps {
  searchResults: SearchResult[];
  onSearchResult: (coordinates: { latitude: number; longitude: number }, title?: string) => void;
  onClearSearchResults: () => void;
}

/**
 * MapSearchControls - Manages search functionality and clear button
 * 
 * @param searchResults - Array of current search results
 * @param onSearchResult - Callback when search returns results
 * @param onClearSearchResults - Callback to clear search results
 */
export const MapSearchControls: React.FC<MapSearchControlsProps> = ({
  searchResults,
  onSearchResult,
  onClearSearchResults,
}) => {
  return (
    <>
      {/* Map Search Component */}
      <MapSearch onSearchResult={onSearchResult} />

      {/* Clear Search Results Button */}
      {searchResults.length > 0 && (
        <View
          style={{
            position: 'absolute',
            top: 120,
            right: 20,
            backgroundColor: '#dc3545',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              fontWeight: 'bold',
            }}
            onPress={onClearSearchResults}
          >
            Clear POI
          </Text>
        </View>
      )}
    </>
  );
};
