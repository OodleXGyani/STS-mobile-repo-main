import React, { useMemo } from 'react';
import { Marker } from 'react-native-maps';

interface SearchResult {
  id: string;
  title: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface MapSearchResultsProps {
  searchResults: SearchResult[];
  onMarkerPress: (resultId: string) => void;
}

/**
 * MapSearchResults - Renders POI search result markers on the map
 * 
 * @param searchResults - Array of search results to display
 * @param onMarkerPress - Callback when a search result marker is pressed
 */
const MapSearchResultsComponent: React.FC<MapSearchResultsProps> = ({
  searchResults,
  onMarkerPress,
}) => {
  // Memoize search result markers to prevent unnecessary re-renders
  const searchMarkers = useMemo(() => {
    if (!searchResults || searchResults.length === 0) {
      return null;
    }

    return searchResults.map(result => (
      <Marker
        key={`${result.id}-${searchResults.length}`}
        coordinate={{
          latitude: result.coordinates.latitude,
          longitude: result.coordinates.longitude,
        }}
        title={result.title}
        description={`POI: ${result.title}`}
        pinColor="red"
        onPress={() => onMarkerPress(result.id)}
      />
    ));
  }, [searchResults, onMarkerPress]);

  return <>{searchMarkers}</>;
};

export const MapSearchResults = React.memo(MapSearchResultsComponent);
