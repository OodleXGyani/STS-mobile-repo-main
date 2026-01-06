import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

type SquareCheckBoxProps = {
  label: string;
  checked: boolean;
  onPress: () => void;
};

export const SquareCheckBox: React.FC<SquareCheckBoxProps> = ({
  label,
  checked,
  onPress,
}) => (
  <Pressable style={styles.container} onPress={onPress}>
    <View style={[styles.square, checked && styles.checkedSquare]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
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
  square: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(4),
    borderWidth: 2,
    borderColor: '#1a3557',
    marginRight: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',  // Set background white when unchecked
  },
  checkedSquare: {
    backgroundColor: '#1a3557',
    borderColor: '#1a3557',
  },
  checkmark: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  label: {
    fontSize: moderateScale(14),
    color: '#1a3557',
  },
});
