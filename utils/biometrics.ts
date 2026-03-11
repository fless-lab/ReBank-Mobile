import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

export async function authenticateWithBiometrics(): Promise<boolean> {
    try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
            Alert.alert('Not Supported', 'Biometric authentication is not supported on this device.');
            return false;
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
            Alert.alert('Not Setup', 'There are no biometrics enrolled on this device. Please set up Face ID or Touch ID in your device settings.');
            return false;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to access ReBank',
            cancelLabel: 'Cancel',
            fallbackLabel: 'Use Passcode',
            disableDeviceFallback: false,
        });

        if (result.success) {
            return true;
        }

        if (result.error === 'user_cancel' || result.error === 'system_cancel' || result.error === 'app_cancel') {
            return false;
        }

        Alert.alert('Authentication Failed', 'We could not verify your identity. Please try again or use your password.');
        return false;

    } catch (error) {
        console.warn('Biometric authentication error:', error);
        Alert.alert('Authentication Error', 'An unexpected error occurred during biometric authentication.');
        return false;
    }
}
