import { Alert, RefObject } from 'react-native';

/**
 * Safely shows an alert only if the component is still mounted.
 * This prevents the "Tried to show an alert while not attached to an Activity" error
 * that occurs when alerts are displayed after a component has unmounted.
 *
 * @param mountedRef - A useRef that tracks component mounting status
 * @param title - The alert title
 * @param message - The alert message
 * @param onDismiss - Optional callback when the alert is dismissed
 */
export const showSafeAlert = (
  mountedRef: RefObject<boolean>,
  title: string,
  message: string,
  onDismiss?: () => void,
): void => {
  if (!mountedRef.current) {
    console.warn(
      `Alert suppressed (component unmounted): "${title}" - "${message}"`,
    );
    return;
  }

  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: () => {
        if (onDismiss) {
          onDismiss();
        }
      },
    },
  ]);
};
