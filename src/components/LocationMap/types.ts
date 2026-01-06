export interface MapLayerMenuState {
  mapLayer: string;
  showGeoFence: boolean;
  showTraffic: boolean;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
}

export interface LayerSelectorProps {
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  menuState: MapLayerMenuState;
  setMenuState: (state: MapLayerMenuState) => void;
}

export interface MapLayerMenuProps {
  visible: boolean;
  currentState: MapLayerMenuState;
  onChange: (state: MapLayerMenuState) => void;
  onClose: () => void;
}
