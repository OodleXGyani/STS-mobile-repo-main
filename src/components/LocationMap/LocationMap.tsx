import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { showSafeAlert } from '../../utils/AlertUtils';
import MapView, { PROVIDER_GOOGLE, Marker, UrlTile } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { SmallIcon } from '../../screens/Dashboard/components/AccordianList/accordian-styles';
import BackArrow from '../../assets/icons/backArrow.png';
import { LayerSelector } from './components/LayerSelector';
import { MapLayerMenu } from './components/MapLayerMenu';
import { MapLayerMenuState } from './types';
import { share_location } from '../../utils';
import Icons from '../../common/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
interface LocationMapProps {
  coordinates?: {
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
    item?: any;
  };
}

interface RouteParams {
  coordinates?: {
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
    item?: any;
  };
}

export const LocationMap: React.FC<LocationMapProps> = ({
  coordinates: propCoordinates,
}) => {
  // Mounted ref to prevent alerts on unmounted component
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as RouteParams;
  console.log('routeParams', routeParams);

  // Get coordinates from props or navigation params
  const coordinates = propCoordinates || routeParams?.coordinates;

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuState, setMenuState] = useState<MapLayerMenuState>({
    mapLayer: 'google',
    showGeoFence: false,
    showTraffic: false,
  });

  // Default coordinates (Bahrain) if none provided
  const defaultCoordinates = {
    latitude: 26.0667,
    longitude: 50.5577,
    title: 'Default Location',
    description: 'No coordinates provided',
    item: null,
  };

  const locationData = coordinates || defaultCoordinates;
  // Map region centered on the coordinates
  const mapRegion = useMemo(
    () => ({
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      latitudeDelta: 0.01, // Zoomed in view
      longitudeDelta: 0.01,
    }),
    [locationData.latitude, locationData.longitude],
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleShareLocation = async () => {
    try {
      // Check if we have vehicle item data from route params
      const vehicleItem = routeParams?.coordinates?.item;
      
      console.log('Share Location Debug:', {
        hasVehicleItem: !!vehicleItem,
        vehicleItem: vehicleItem,
        routeParams: routeParams,
        locationData: locationData
      });
      
      if (vehicleItem) {
        // Use the share_location utility function for vehicle data
        await share_location(vehicleItem);
      } else {
        // Fallback to simple location sharing
        const googleMapsUrl = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`;
        const shareMessage = `${
          locationData.title || 'Location'
        }\n\nCoordinates: ${locationData.latitude}, ${
          locationData.longitude
        }\n\nView on Google Maps: ${googleMapsUrl}`;

        await Share.share({
          message: shareMessage,
          url: googleMapsUrl,
          title: 'Share Location',
        });
      }
    } catch (error) {
      console.error('Error sharing location:', error);
      showSafeAlert(mountedRef, 'Error', 'Failed to share location');
    }
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      height: 60,
      backgroundColor: Colors.primary_background_color,
      borderBottomWidth: 1,
      borderBottomColor: Colors.tertiary_font_color,
      paddingHorizontal: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    backButtonText: {
      fontSize: 24,
      color: Colors.primary_blue_80_color,
      fontWeight: 'bold' as const,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center' as const,
      fontSize: 18,
      fontWeight: '600' as const,
      color: Colors.white,
    },
    headerSpacer: {
      width: 40,
    },
    mapContainer: {
      flex: 1,
      position: 'relative' as const,
    },
    map: {
      flex: 1,
    },
    shareButtonContainer: {
        // padding: 16,
      backgroundColor: Colors.primary_background_color,
      borderTopWidth: 1,
      borderTopColor: Colors.tertiary_font_color,
   
    },
    shareButton: {
      
      backgroundColor: Colors.primary_blue_80_color,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
      gap: 10,
    },
    shareButtonText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '600' as const,
    },
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.primary_background_color }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <SmallIcon style={{ width: 25, height: 25 }} source={BackArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Map</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Map Container */}
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={mapRegion}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={true}
            showsScale={true}
            showsTraffic={menuState.showTraffic}
          >
            {/* Google Map Tiles (Default) */}
            {menuState.mapLayer === 'google' && (
              <>{/* Standard Google Map - no additional tiles needed */}</>
            )}

            {/* Satellite View */}
            {menuState.mapLayer === 'satellite' && (
              <UrlTile
                urlTemplate="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                maximumZ={19}
                minimumZ={0}
                zIndex={1}
                tileSize={256}
                flipY={false}
              />
            )}

            {/* STS Full Tiles */}
            {menuState.mapLayer === 'sts' && (
              <UrlTile
                urlTemplate="https://maps.smarttrack-sts.com/sts_full/{z}/{x}/{y}.png"
                maximumZ={19}
                minimumZ={0}
                zIndex={0}
                tileSize={256}
                flipY={false}
              />
            )}

            {/* STS Hybrid Tiles - STS map in satellite view */}
            {menuState.mapLayer === 'stsHybrid' && (
              <UrlTile
                urlTemplate="https://maps.smarttrack-sts.com/sts_full/{z}/{x}/{y}.png"
                maximumZ={19}
                minimumZ={0}
                zIndex={0}
                tileSize={256}
                flipY={false}
              />
            )}

            {/* Location Marker */}
            <Marker
              coordinate={{
                latitude: locationData.latitude,
                longitude: locationData.longitude,
              }}
              title={locationData.title || 'Location'}
              description={
                locationData.item 
                  ? `${locationData.item.VehicleName || locationData.item.name || 'Vehicle'} - ${locationData.item.DriverName || locationData.item.driver_name || 'Driver'}`
                  : locationData.description || `Coordinates: ${locationData.latitude}, ${locationData.longitude}`
              }
              pinColor={Colors.primary_blue_80_color}
            />
          </MapView>

          {/* Layer Selector UI */}
          <LayerSelector
            menuVisible={menuVisible}
            setMenuVisible={setMenuVisible}
            menuState={menuState}
            setMenuState={setMenuState}
          />
        </View>

        {/* Share Location Button */}
        <View style={styles.shareButtonContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareLocation}

          >
            <SmallIcon style={{ width: 25, height: 25 }} source={Icons.share_white} />
            <Text style={styles.shareButtonText}>Share Location</Text>
          </TouchableOpacity>
        </View>

        {/* Layer Menu */}
        <MapLayerMenu
          visible={menuVisible}
          currentState={menuState}
          onChange={setMenuState}
          onClose={() => setMenuVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};
