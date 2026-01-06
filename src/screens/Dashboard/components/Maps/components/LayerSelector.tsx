import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import { MapLayerMenu } from './MapSortMenue/MapLayerMenu';
import { MapLayerMenuState } from './MapSortMenue/MapLayerMenueTypes';

interface LayerSelectorProps {
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  menuState: MapLayerMenuState;
  setMenuState: (state: MapLayerMenuState) => void;
}

const layersIcons = require('../../../../../assets/icons/layers.png');

export const LayerSelector: React.FC<LayerSelectorProps> = ({
  menuVisible,
  setMenuVisible,
  menuState,
  setMenuState,
}) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => setMenuVisible(!menuVisible)}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: '#fff',
          padding: 10,
          borderRadius: 50,
          zIndex: 20, // High zIndex to be above map
        }}
      >
        <Image
          style={{
            width: 18,
            height: 18,
            resizeMode: 'contain',
            tintColor: '#000',
          }}
          source={layersIcons}
        />
        <MapLayerMenu
          visible={menuVisible}
          currentState={menuState}
          onChange={setMenuState}
          onClose={() => setMenuVisible(false)}
        />
      </TouchableOpacity>
    </>
  );
};
