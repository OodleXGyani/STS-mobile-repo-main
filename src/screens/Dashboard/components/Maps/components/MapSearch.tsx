import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../../../../constants/colors';
import { useSearchPOIMutation } from '../../../../../services/geofences';
import { POIPoint } from '../../../../../services/geofences';
import { Image } from 'react-native';

const searchIcon = require('../../../../../assets/icons/Search.png');
// Types
interface SearchResult {
  id: string;
  title: string;
  category?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface MapSearchProps {
  onSearchResult: (coordinates: {
    latitude: number;
    longitude: number;
  }, title?: string) => void;
}

// Styled Components
const SearchButton = styled.TouchableOpacity`
  position: absolute;
  bottom: ${verticalScale(60)}px;
  right: ${moderateScale(20)}px;
  width: ${moderateScale(40)}px;
  height: ${moderateScale(40)}px;
  background-color: ${Colors.white};
  border-radius: ${moderateScale(25)}px;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-offset: 0px 2px;
  shadow-radius: 4px;
  elevation: 5;
`;

const SearchButtonText = styled.Text`
  font-size: ${moderateScale(20)}px;
  color: white;
`;

const SearchModal = styled.Modal`
  flex: 1;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;

const SearchContainer = styled.View`
  position: absolute;
  top: ${verticalScale(100)}px;
  left: ${moderateScale(20)}px;
  right: ${moderateScale(20)}px;
  background-color: white;
  border-radius: ${moderateScale(12)}px;
  padding: ${moderateScale(20)}px;
  max-height: ${verticalScale(400)}px;
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-offset: 0px 4px;
  shadow-radius: 8px;
  elevation: 8;
`;

const SearchHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${verticalScale(20)}px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  height: ${verticalScale(40)}px;
  border-width: 1px;
  border-color: #e0e0e0;
  border-radius: ${moderateScale(8)}px;
  padding-horizontal: ${moderateScale(12)}px;
  font-size: ${moderateScale(16)}px;
  color: ${Colors.default_font_color};
  background-color: #f8f9fa;
`;

const ClearButton = styled.TouchableOpacity`
  margin-left: ${moderateScale(12)}px;
  padding: ${moderateScale(8)}px;
`;

const ClearButtonText = styled.Text`
  color: #6c757d;
  font-size: ${moderateScale(14)}px;
  font-weight: 500;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: ${moderateScale(-15)}px;
  right: ${moderateScale(20)}px;
  width: ${moderateScale(30)}px;
  height: ${moderateScale(30)}px;
  background-color: ${Colors.primary_blue_color};
  border-radius: ${moderateScale(15)}px;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const CloseButtonText = styled.Text`
  color: white;
  font-size: ${moderateScale(16)}px;
  font-weight: bold;
`;

const ResultsList = styled.ScrollView`
  flex: 1;
`;

const ResultItem = styled.TouchableOpacity<{ isCategory?: boolean }>`
  padding-vertical: ${verticalScale(12)}px;
  padding-horizontal: ${moderateScale(8)}px;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
  background-color: ${props => (props.isCategory ? '#f8f9fa' : 'white')};
`;

const ResultItemText = styled.Text<{ isCategory?: boolean }>`
  font-size: ${moderateScale(14)}px;
  color: ${props => (props.isCategory ? '#6c757d' : Colors.default_font_color)};
  font-weight: ${props => (props.isCategory ? '500' : '400')};
`;

const LoadingText = styled.Text`
  text-align: center;
  color: #6c757d;
  font-size: ${moderateScale(14)}px;
  padding: ${verticalScale(20)}px;
`;

const ErrorText = styled.Text`
  text-align: center;
  color: #dc3545;
  font-size: ${moderateScale(14)}px;
  padding: ${verticalScale(20)}px;
`;

const MapSearch: React.FC<MapSearchProps> = ({ onSearchResult }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // POI Search API hook
  const [searchPOI] = useSearchPOIMutation();

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for 500ms
    debounceTimeoutRef.current = setTimeout(async () => {
      if (query.trim().length < 2) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('🔍 Searching POI for:', query);
        const result = await searchPOI({ query: query.trim() }).unwrap();
        
        // Convert POI response to SearchResult format
        const convertedResults: SearchResult[] = result.pois.map((poi: POIPoint, index: number) => ({
          id: `poi-${index}`,
          title: poi.name,
          coordinates: {
            latitude: poi.coordinates[0], // coordinates[1] is latitude
            longitude: poi.coordinates[1], // coordinates[0] is longitude
          },
        }));

        console.log('✅ POI search results:', convertedResults);
        setSearchResults(convertedResults);
      } catch (err) {
        console.error('❌ POI search error:', err);
        setError('Search failed. Please try again.');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce delay
  }, [searchPOI]);

  // Handle search input change
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    
    if (text.trim().length === 0) {
      setSearchResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debouncedSearch(text);
  }, [debouncedSearch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setIsLoading(false);
    
    // Clear any pending debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  const handleResultSelect = useCallback(
    (result: SearchResult) => {
      if (result.coordinates) {
        console.log('📍 Selected POI:', result.title, 'at coordinates:', result.coordinates);
        onSearchResult(result.coordinates, result.title);
        setIsVisible(false);
        setSearchQuery('');
        setSearchResults([]);
        setError(null);
      }
    },
    [onSearchResult],
  );

  const handleSearchButtonPress = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setIsLoading(false);
    
    // Clear any pending debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  return (
    <>
      <SearchButton onPress={handleSearchButtonPress}>
        <Image style={{tintColor: '#000', resizeMode: 'contain', height: 18, width: 18}} source={searchIcon} />
      </SearchButton>

      <SearchModal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <ModalOverlay>
          <SearchContainer>
            <CloseButton onPress={handleClose}>
              <CloseButtonText>×</CloseButtonText>
            </CloseButton>

            <SearchHeader>
              <SearchInput
                placeholder="Search for places..."
                value={searchQuery}
                onChangeText={handleSearchChange}
                autoFocus
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <ClearButton onPress={handleClearSearch}>
                  <ClearButtonText>Clear</ClearButtonText>
                </ClearButton>
              )}
            </SearchHeader>

            <ResultsList showsVerticalScrollIndicator={false}>
              {isLoading && (
                <LoadingText>Searching...</LoadingText>
              )}
              
              {error && (
                <ErrorText>{error}</ErrorText>
              )}
              
              {!isLoading && !error && searchResults.length === 0 && searchQuery.length > 0 && (
                <LoadingText>No results found</LoadingText>
              )}
              
              {!isLoading && !error && searchResults.map(result => (
                <ResultItem
                  key={result.id}
                  onPress={() => handleResultSelect(result)}
                >
                  <ResultItemText>
                    {result.title}
                  </ResultItemText>
                </ResultItem>
              ))}
            </ResultsList>
          </SearchContainer>
        </ModalOverlay>
      </SearchModal>
    </>
  );
};

export default MapSearch;
