import React from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text } from 'react-native';
// Type imports
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../../../../constants/colors';
import Icons from '../../../../../../common/icons';
import { SmallIcon } from '../../../../../Dashboard/components/AccordianList/accordian-styles';
import BackArrow from '../../../../../../assets/icons/backArrow.png';

// Import layer selector from dashboard map component
// Reference: src/screens/Dashboard/components/Maps/components/LayerSelector.tsx
import { LayerSelector } from '../../../../../Dashboard/components/Maps/components/LayerSelector';

// Import separated modules
import { TripMapPageRouteProp } from './types';
import { getRouteParams, logDebugInfo, transformApiDataToTripMapData } from './utils';
import { useMapLayerState, useMapRegion, useNavigationHandlers, usePathHandlers } from './hooks';
import { renderTripMarkers, renderTripPath, renderMapLayers } from './renderers';
import {
  PageContainer,
  HeaderContainer,
  BackButton,
  HeaderTitle,
  HeaderSpacer,
  MapContainer,
  LayerButton,
  MAP_VIEW_STYLE,
  SAFE_AREA_STYLE,
} from './styles';

/**
 * Main TripMapPage Component
 * 
 * This component provides a dedicated full-screen map view for trip visualization.
 * It's designed to be navigated to from the TripReport component when the map button is pressed.
 * 
 * Key Features:
 * - Full-screen map display with trip path and markers
 * - Header with back navigation and customizable title
 * - Layer selector for different map types
 * - Interactive markers and path elements
 * - Responsive design optimized for mobile devices
 */
const TripMapPage: React.FC = () => {
  const route = useRoute<TripMapPageRouteProp>();

  // Get trip data from route parameters with fallback
  const { tripData, title = "Map" } = getRouteParams(route);
  console.log('🗺️ [TripMapPage] Raw tripData:', tripData);
  console.log('🗺️ [TripMapPage] tripData type:', typeof tripData);
  console.log('🗺️ [TripMapPage] tripData is array?', Array.isArray(tripData));
  console.log('🗺️ [TripMapPage] tripData length:', Array.isArray(tripData) ? tripData.length : 'N/A');

  // Transform API data to expected format
  const transformedTripData = transformApiDataToTripMapData(tripData);
  console.log('🗺️ [TripMapPage] transformedTripData:', transformedTripData);
  console.log('🗺️ [TripMapPage] transformedTripData.path.coordinates length:', transformedTripData.path.coordinates.length);

  // Debug logging
  logDebugInfo('TripMapPage rendered with params:', route.params);
  logDebugInfo('Trip data received:', tripData);

  // Custom hooks for state management
  const { menuVisible, setMenuVisible, menuState, setMenuState } = useMapLayerState();
  const mapRegion = useMapRegion(transformedTripData);
  console.log('🗺️ [TripMapPage] Map region:', mapRegion);
  const { handleBackPress } = useNavigationHandlers();
  const { handlePathPress } = usePathHandlers(transformedTripData);

  // Show error state if no coordinates available
  const hasCoordinates = transformedTripData?.path?.coordinates?.length > 0;

  return (
    <SafeAreaView style={SAFE_AREA_STYLE}>
      <PageContainer>
        {/* Header with back button and title */}
        <HeaderContainer>
          <BackButton onPress={handleBackPress}>
            <SmallIcon
              source={BackArrow}
              style={{
                width: moderateScale(24),
                height: moderateScale(24),
              }}
            />
          </BackButton>

          <HeaderTitle>MAP</HeaderTitle>

          <HeaderSpacer />
        </HeaderContainer>

        {/* Error State - No Data */}
        {!hasCoordinates && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              padding: moderateScale(20),
            }}
          >
            <Text
              style={{
                fontSize: moderateScale(18),
                fontWeight: 'bold',
                color: Colors.primary_blue_color,
                marginBottom: moderateScale(10),
                textAlign: 'center',
              }}
            >
              📍 No Map Data Available
            </Text>
            <Text
              style={{
                fontSize: moderateScale(14),
                color: '#666',
                textAlign: 'center',
                marginBottom: moderateScale(20),
              }}
            >
              No coordinates were returned from the server for this trip.
            </Text>
            <View
              style={{
                backgroundColor: '#f5f5f5',
                padding: moderateScale(10),
                borderRadius: moderateScale(5),
                marginTop: moderateScale(10),
              }}
            >
              <Text style={{ fontSize: moderateScale(11), color: '#666', fontFamily: 'monospace' }}>
                Markers: {transformedTripData?.markers?.length || 0}
              </Text>
              <Text style={{ fontSize: moderateScale(11), color: '#666', fontFamily: 'monospace' }}>
                Path Points: {transformedTripData?.path?.coordinates?.length || 0}
              </Text>
              <Text style={{ fontSize: moderateScale(11), color: '#666', fontFamily: 'monospace' }}>
                Status: {transformedTripData?.status || 'unknown'}
              </Text>
            </View>
          </View>
        )}

        {/* Map Container */}
        {hasCoordinates && (
        <MapContainer>
          {/* Layer selector button */}
          <LayerButton onPress={() => setMenuVisible(true)}>
            <SmallIcon
              source={Icons.layer_icon}
              style={{
                width: moderateScale(24),
                height: moderateScale(24),
              }}
            />
          </LayerButton>

          {/* Main MapView component */}
          <MapView
            provider={PROVIDER_GOOGLE}
            style={MAP_VIEW_STYLE}
            initialRegion={mapRegion}
            mapType="standard"
            toolbarEnabled={false}
            rotateEnabled={true}
            moveOnMarkerPress={false}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={true}
            showsScale={true}
            showsBuildings={true}
            showsTraffic={menuState.showTraffic}
            showsIndoors={true}
            onMapReady={() => console.log('🗺️ Map is ready')}
            onError={(error) => console.error('🗺️ Map error:', error)}
          >
            {/* Render map layers */}
            {renderMapLayers(menuState)}

            {/* Render trip path */}
            {renderTripPath(transformedTripData, handlePathPress)}

            {/* Render trip markers */}
            {renderTripMarkers(transformedTripData)}
          </MapView>

          {/* Layer Selector UI */}
          <LayerSelector
            menuVisible={menuVisible}
            setMenuVisible={setMenuVisible}
            menuState={menuState}
            setMenuState={setMenuState}
          />
        </MapContainer>
        )}
      </PageContainer>
    </SafeAreaView>
  );
};

export default TripMapPage;

/**
 * TripMapPage Component Documentation
 * 
 * This component provides a dedicated full-screen map view for trip visualization.
 * It's designed to be navigated to from the TripReport component when the map button is pressed.
 * 
 * Key Features:
 * - Full-screen map display with trip path and markers
 * - Header with back navigation and customizable title
 * - Trip information overlay with key metrics
 * - Layer selector for different map types
 * - Interactive markers and path elements
 * - Responsive design optimized for mobile devices
 * 
 * Navigation Integration:
 * - Receives trip data via route parameters
 * - Implements proper back navigation
 * - Maintains navigation state and history
 * 
 * References:
 * - Dashboard Map Component: src/screens/Dashboard/components/Maps/Map.tsx
 * - Layer Selector: src/screens/Dashboard/components/Maps/components/LayerSelector.tsx
 * - Trip Summary Documentation: TRIP_SUMMARY_REPORT_DOCUMENTATION.md
 * 
 * Usage:
 * Navigate to this page from TripReport component:
 * ```tsx
 * navigation.navigate('TripMapPage', {
 *   tripData: tripMapData,
 *   title: 'Trip Map'
 * });
 * ```
 */
