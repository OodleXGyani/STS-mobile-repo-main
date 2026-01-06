import { useState, useCallback } from 'react';
import { Region } from 'react-native-maps';
import { BAHRAIN_REGION } from '../constants';

interface SearchResult {
  id: string;
  title: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface UseMapSearchReturn {
  searchResults: SearchResult[];
  selectedSearchResult: string | null;
  handleSearchResult: (coordinates: { latitude: number; longitude: number }, title?: string) => void;
  clearSearchResults: () => void;
  onMarkerPress: (resultId: string) => void;
}

/**
 * useMapSearch - Custom hook for managing map search functionality
 * 
 * @param setRegion - Function to update map region
 * @returns Object containing search state and functions
 */
export const useMapSearch = (setRegion: (region: Region) => void): UseMapSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedSearchResult, setSelectedSearchResult] = useState<string | null>(null);

  // Handle search results from POI search
  const handleSearchResult = useCallback(
    (coordinates: { latitude: number; longitude: number }, title?: string) => {
      console.log(
        '📍 POI Search result coordinates:',
        coordinates,
        'Title:',
        title,
      );

      // Update map region to show search results
      setRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.01, // Zoom in closer for search results
        longitudeDelta: 0.01,
      });

      // Add search result to the map
      const newSearchResult = {
        id: Date.now().toString(),
        title: title || 'Search Result',
        coordinates,
      };

      console.log('📍 New search result to add:', newSearchResult);

      // Clear previous search results and add new one
      setSearchResults([newSearchResult]);
      setSelectedSearchResult(newSearchResult.id);

      console.log('✅ Added POI marker to map:', newSearchResult);
    },
    [setRegion],
  );

  // Clear search results
  const clearSearchResults = useCallback(() => {
    console.log('🧹 Clearing search results, current count:', searchResults.length);
    
    // Clear search results state
    setSearchResults([]);
    setSelectedSearchResult(null);

    // Reset map to initial Bahrain region to show all vehicles
    setRegion(BAHRAIN_REGION);

    console.log('🧹 Cleared search results from map and reset to initial view');
  }, [setRegion, searchResults.length]);

  const onMarkerPress = useCallback((resultId: string) => {
    setSelectedSearchResult(resultId);
  }, []);

  return {
    searchResults,
    selectedSearchResult,
    handleSearchResult,
    clearSearchResults,
    onMarkerPress,
  };
};
