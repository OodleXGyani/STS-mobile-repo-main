// MapLayerMenu/RadioButton.tsx

import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

type RadioButtonProps = {
  label: string;
  checked: boolean;
  onPress: () => void;
};

export const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  checked,
  onPress,
}) => (
  <Pressable
    style={styles.container}
    onPress={onPress}
    android_ripple={{ color: '#ccc', borderless: true }}
  >
    <View style={styles.outerCircle}>
      {checked && <View style={styles.innerCircle} />}
    </View>
    <Text style={styles.label}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(8),
  },
  outerCircle: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(20) / 2,
    borderWidth: 2,
    borderColor: '#1a3557',
    marginRight: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  innerCircle: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(12) / 2,
    backgroundColor: '#1a3557',
  },
  label: {
    fontSize: moderateScale(14),
    color: '#1a3557',
  },
});
