

export interface MapLayerMenuProps {
  visible: boolean;
  currentState: MapLayerMenuState;
  onChange: (state: MapLayerMenuState) => void;
  onClose: () => void;
}

export type MapLayerKey = 'mapLayer' | 'showGeoFence' | 'showTraffic';

export type MapLayerMenuState = {
  mapLayer: string;
  showGeoFence: boolean;
  showTraffic: boolean;
};