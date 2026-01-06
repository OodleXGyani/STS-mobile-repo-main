import React from 'react';
import { View, Platform } from 'react-native';
import { Marker } from 'react-native-maps';
import { SmallIcon } from '../../../../../Dashboard/components/AccordianList/accordian-styles';
import Icons from '../../../../../../common/icons';
import { MarkerComponentProps } from './types';
import { MARKER_STYLES } from './styles';

/**
 * TripMapPage Marker Components
 * 
 * This file contains all marker components for the TripMapPage,
 * separated for better maintainability and reusability.
 */

/**
 * Start marker component (green)
 */
export const StartMarker: React.FC<MarkerComponentProps> = ({ marker }) => (
  <Marker
    coordinate={marker.coordinate}
    title={marker.title}
    description={marker.description}
    pinColor="green"
    anchor={{ x: 0.5, y: 1 }}
  >
    {Platform.OS === 'ios' && (
      <View style={{
        width: MARKER_STYLES.start.width,
        height: MARKER_STYLES.start.height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
      }}>
        <SmallIcon
          source={Icons.location_green}
          style={{
            width: MARKER_STYLES.start.width,
            height: MARKER_STYLES.start.height,
            resizeMode: 'contain'
          }}
        />
      </View>
    )}
  </Marker>
);

/**
 * End marker component (red)
 */
export const EndMarker: React.FC<MarkerComponentProps> = ({ marker }) => (
  <Marker
    coordinate={marker.coordinate}
    title={marker.title}
    description={marker.description}
    pinColor="red"
    anchor={{ x: 0.5, y: 1 }}
  >
    {Platform.OS === 'ios' && (
      <View style={{
        width: MARKER_STYLES.end.width,
        height: MARKER_STYLES.end.height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
      }}>
        <SmallIcon
          source={Icons.location_red}
          style={{
            width: MARKER_STYLES.end.width,
            height: MARKER_STYLES.end.height,
            resizeMode: 'contain'
          }}
        />
      </View>
    )}
  </Marker>
);

/**
 * Waypoint marker component (blue)
 */
export const WaypointMarker: React.FC<MarkerComponentProps> = ({ marker }) => (
  <Marker
    coordinate={marker.coordinate}
    title={marker.title}
    description={marker.description}
    pinColor="blue"
    anchor={{ x: 0.5, y: 1 }}
  >
    {Platform.OS === 'ios' && (
      <View style={{
        width: MARKER_STYLES.waypoint.width,
        height: MARKER_STYLES.waypoint.height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
      }}>
        <SmallIcon
          source={Icons.location_blue}
          style={{
            width: MARKER_STYLES.waypoint.width,
            height: MARKER_STYLES.waypoint.height,
            resizeMode: 'contain'
          }}
        />
      </View>
    )}
  </Marker>
);
