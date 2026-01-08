import React, { useState, useMemo, useCallback } from 'react';
import MapView from 'react-native-map-clustering';
import { PROVIDER_GOOGLE, UrlTile, Marker } from 'react-native-maps';
import { Container, MapWrapper } from './Map.styles';
import {
  LayerSelector,
  VehicleInfoPopup,
  MapVehicleRenderer,
  MapSearchResults,
  MapGeofences,
  MapSearchControls,
  VehicleMarker,
} from './components';
import { FilterBar } from '../AccordianList/components/FilterBar';
import { useMapState } from './hooks/useMapState';
import { useMapSearch } from './hooks/useMapSearch';
import { useDashboardLiveTrack } from '../../context';
import { useFilterState } from '../../context/FilterStateContext';
import { Vehicle } from '../../context/types';
import { MapLayerMenuState } from './components/MapSortMenue/MapLayerMenueTypes';
import { BAHRAIN_REGION, CLUSTERING_CONFIG } from './constants';
import { DISPLAYED_STATUSES, STATUS_COLORS } from '../AccordianList/constants';
import MarkerModal from './components/MarkerModal';
import { View } from 'react-native';
import { DynamicVehicleIcon } from './components/VehicleMarker';

interface Props {
  vehicles?: Vehicle[];
  selectedVehicles?: Vehicle[];
  initialRegion?: any;
  onFilterPress: () => void;
}

const initialState: MapLayerMenuState = {
  mapLayer: 'google', // can be 'osm', 'satellite', 'google', 'sts'
  showGeoFence: false,
  showTraffic: false,
};

const MapListView: React.FC<Props> = ({
  vehicles = [],
  selectedVehicles = [],
  onFilterPress,
}) => {
  const {
    region,
    setRegion,
    vehicleInfoVisible,
    selectedVehicle,
    selectedVehicleData,
    onMarkerPress,
    onMarkerPressWithData,
    closeVehicleInfo,
    showModal,
    setShowModal,
  } = useMapState({ vehicles, initialRegion: BAHRAIN_REGION });

  const {
    searchResults,
    handleSearchResult,
    clearSearchResults,
    onMarkerPress: onSearchMarkerPress,
  } = useMapSearch(setRegion);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuState, setMenuState] = useState(initialState);

  const { liveTrackData } = useDashboardLiveTrack();
  const { filters, sort } = useFilterState();

  // Get the current groupBy value for FilterBar
  const currentGroupBy = sort?.groupBy || 'status';

  // Use selectedVehicles directly (already calculated with grouped/filtered data from Dashboard)
  const vehiclesToShow = useMemo(() => {
    console.log('selectedVehicles', selectedVehicles);
    // Use selectedVehicles which already contains the grouped/filtered data
    return selectedVehicles.length > 0 ? selectedVehicles : [];
  }, [selectedVehicles]);
  console.log('vehiclesToShow', vehiclesToShow);

  const renderOsmTile = menuState.mapLayer === 'osm';
  const mapType = useMemo(() => {
    if (
      menuState.mapLayer === 'satellite' ||
      menuState.mapLayer === 'stsHybrid'
    ) {
      return 'satellite';
    }
    return 'standard';
  }, [menuState.mapLayer]);

  return (
    <Container>
      <MapWrapper>
        <MapView
          key={searchResults.length} // forces re-render on searchResults change
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={region}
          initialRegion={region}
          // onRegionChangeComplete={setRegion}
          mapType={mapType as any}
          showsTraffic={menuState.showTraffic}
          // Clustering configuration
          clusterColor={CLUSTERING_CONFIG.clusterColor}
          clusterTextColor={CLUSTERING_CONFIG.clusterTextColor}
          radius={CLUSTERING_CONFIG.radius}
          minZoom={CLUSTERING_CONFIG.minZoom}
          maxZoom={CLUSTERING_CONFIG.maxZoom}
          minPoints={CLUSTERING_CONFIG.minPoints}
          animationEnabled={CLUSTERING_CONFIG.animationEnabled}
          clusteringEnabled={CLUSTERING_CONFIG.clusteringEnabled}
          onClusterPress={(cluster, markers) => {
            console.log('🗺️ Cluster pressed:', {
              clusterId: cluster.id,
              pointCount: cluster.pointCount,
              markers: markers?.length || 0,
            });
          }}
        >

          {/* Vehicle Markers - Direct rendering for clustering */}
          {useMemo(() => {
            return vehiclesToShow.map(vehicle => {
              if (!vehicle.coordinates || vehicle.coordinates.length !== 2) {
                return null;
              }

              return (
                <Marker
                  key={`marker-${vehicle.id}`}
                  coordinate={{
                    latitude: vehicle.coordinates[1],
                    longitude: vehicle.coordinates[0],
                  }}
                  onPress={() => onMarkerPressWithData(vehicle)}
                  tracksViewChanges={false}
                  centerOffset={{ x: 0, y: -12 }}
                >
                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <DynamicVehicleIcon status={vehicle.status} />
                  </View>
                </Marker>
              );
            });
          }, [vehiclesToShow, onMarkerPressWithData])}

          {/* Search Results Markers */}
          <MapSearchResults
            searchResults={searchResults}
            onMarkerPress={onSearchMarkerPress}
          />

          {/* Google Tiles with SmartTrack overlay */}
          {menuState.mapLayer === 'google' && (
            <>
              <UrlTile
                urlTemplate="http://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                maximumZ={19}
                minimumZ={0}
                zIndex={0}
                tileSize={256}
                flipY={false}
              />
              {/* <UrlTile
                urlTemplate="https://maps.smarttrack-sts.com/sts_trans/{z}/{x}/{y}.png"
                maximumZ={19}
                minimumZ={0}
                zIndex={1}
                tileSize={256}
                flipY={false}
              /> */}
            </>
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

          {/* Geofences */}
          <MapGeofences showGeofences={menuState.showGeoFence} />
        </MapView>

        {/* Layer Selector UI */}
        <LayerSelector
          menuVisible={menuVisible}
          setMenuVisible={setMenuVisible}
          menuState={menuState}
          setMenuState={setMenuState}
        />
      </MapWrapper>

      {/* Vehicle Info Popup */}
      {vehicleInfoVisible && selectedVehicle && (
        <VehicleInfoPopup
          vehicle={selectedVehicle}
          onClose={closeVehicleInfo}
        />
      )}

      {/* Filter Bar - using the same data source as accordion list */}
      <FilterBar
        onFilterPress={onFilterPress}
        filterIcon={require('../../../../assets/icons/filter_white.png')}
        totals={
          liveTrackData?.summary || {
            on: 0,
            idle: 0,
            off: 0,
            longoff: 0,
            no_signal: 0,
            overspeed: 0,
            filtered: 0,
            total: 0,
          }
        }
        displayedStatuses={DISPLAYED_STATUSES}
        statusColors={STATUS_COLORS}
        currentGroupBy={currentGroupBy}
      />

      {/* Search Controls */}
      <MapSearchControls
        searchResults={searchResults}
        onSearchResult={handleSearchResult}
        onClearSearchResults={clearSearchResults}
      />

      {/* Modal component */}
      <MarkerModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        vehicleData={selectedVehicleData || undefined}
        onButtonPress={() => console.log('Button pressed')}
      />

    </Container>
  );
};

export default React.memo(MapListView);
