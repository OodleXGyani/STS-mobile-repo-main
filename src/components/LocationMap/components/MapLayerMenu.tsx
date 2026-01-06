import React from 'react';
import { Menu, MenuTrigger, MenuOptions } from 'react-native-popup-menu';
import { RadioButton } from './RadioButton';
import { SquareCheckBox } from './SquareCheckBox';
import { Section, SectionTitle, Divider } from './MenuComponents';
import { MapLayerMenuProps } from '../types';
import { MAP_LAYER_OPTIONS, TOGGLE_OPTIONS } from './mapOptions';

export const MapLayerMenu: React.FC<MapLayerMenuProps> = ({
  visible,
  currentState,
  onChange,
  onClose,
}) => {
  const handleSelectLayer = (layerKey: string) => {
    onChange({
      ...currentState,
      mapLayer: layerKey,
    });
    onClose();
  };

  const handleToggle = (key: 'showGeoFence' | 'showTraffic') => {
    onChange({
      ...currentState,
      [key]: !currentState[key],
    });
    onClose();
  };

  if (!visible) return null;

  return (
    <Menu opened={visible} onBackdropPress={onClose}>
      <MenuTrigger />
      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderRadius: 12,
            backgroundColor: '#fff',
            padding: 20,
            elevation: 5,
          },
        }}
      >
        <Section>
          <SectionTitle>Select Map Layer</SectionTitle>
          {MAP_LAYER_OPTIONS.map(option => (
            <RadioButton
              key={option.key}
              label={option.label}
              checked={currentState.mapLayer === option.key}
              onPress={() => handleSelectLayer(option.key)}
            />
          ))}
        </Section>
        <Divider />
        <Section>
          {TOGGLE_OPTIONS.map(option => (
            <SquareCheckBox
              key={option.key}
              label={option.label}
              checked={
                !!currentState[option.key as 'showGeoFence' | 'showTraffic']
              }
              onPress={() =>
                handleToggle(option.key as 'showGeoFence' | 'showTraffic')
              }
            />
          ))}
        </Section>
      </MenuOptions>
    </Menu>
  );
};
