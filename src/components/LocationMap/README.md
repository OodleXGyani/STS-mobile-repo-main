# LocationMap Component

A comprehensive map component for displaying locations with multiple map layers, sharing functionality, and customizable markers.

## Features

- **Multiple Map Layers**: STS Map, STS Hybrid, Google Map, Satellite
- **Traffic Toggle**: Show/hide traffic information
- **Geofence Overlay**: Display geofence boundaries
- **Location Sharing**: Native share sheet integration
- **Customizable Markers**: Support for custom titles and descriptions
- **Responsive Header**: Centered title with back navigation

## Usage

### Basic Usage

```tsx
import { LocationMap } from '../components/LocationMap';

// Using with coordinates prop
<LocationMap 
  coordinates={{
    latitude: 26.0667,
    longitude: 50.5577,
    title: 'Bahrain Location',
    description: 'This is a sample location in Bahrain'
  }}
/>
```

### Navigation Usage

```tsx
// Navigate to LocationMap screen with coordinates
navigation.navigate('LocationMap', {
  coordinates: {
    latitude: 26.0667,
    longitude: 50.5577,
    title: 'Trip Location',
    description: 'Vehicle trip endpoint'
  }
});
```

### Screen Registration

Add to your navigation stack:

```tsx
import { LocationMap } from '../components/LocationMap';

// In your navigator
<Stack.Screen 
  name="LocationMap" 
  component={LocationMap} 
  options={{ headerShown: false }}
/>
```

## Props

### LocationMapProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `coordinates` | `LocationCoordinates` | No | Location data to display on map |

### LocationCoordinates

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `latitude` | `number` | Yes | Latitude coordinate |
| `longitude` | `number` | Yes | Longitude coordinate |
| `title` | `string` | No | Marker title |
| `description` | `string` | No | Marker description |

## Map Layers

The component supports the following map layers:

- **Google Map**: Standard Google Maps view
- **STS Map**: SmartTrack STS custom map
- **STS Hybrid**: STS map with satellite overlay
- **Satellite**: Satellite imagery view

## Features

### Layer Selection
- Tap the "Layers" button in the top-right corner
- Select from available map layers
- Toggle traffic and geofence overlays

### Location Sharing
- Tap "Share Location" button at the bottom
- Opens native share sheet
- Shares coordinates and Google Maps link
- Compatible with WhatsApp, SMS, Email, etc.

### Navigation
- Back arrow in header navigates to previous screen
- Centered "Map" title for clear context

## Default Behavior

If no coordinates are provided, the component defaults to:
- **Location**: Bahrain (26.0667, 50.5577)
- **Title**: "Default Location"
- **Description**: "No coordinates provided"

## Dependencies

- `react-native-maps`
- `react-native-popup-menu`
- `react-native-size-matters`
- `styled-components`
- `@react-navigation/native`

## Styling

The component uses a consistent design system with:
- Primary blue color scheme
- Clean white backgrounds
- Proper spacing and typography
- Responsive layout for different screen sizes
