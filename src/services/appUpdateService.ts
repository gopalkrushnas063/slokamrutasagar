import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';

interface UpdateConfig {
    ios_minimum_version: string;
    android_minimum_version: string;
    latest_android_version: string;
    latest_ios_version: string;
    extra: {
        force_update: boolean;
        release_notes: {
            android: string;
            ios: string;
        };
        maintenance_mode: boolean;
        support_url: string;
    };
}

export enum UpdateType {
    FORCE_UPDATE = 'FORCE_UPDATE',
    SOFT_UPDATE = 'SOFT_UPDATE',
    NONE = 'NONE',
    MAINTENANCE = 'MAINTENANCE'
}

const UPDATE_CONFIG_URL = 'https://gopalkrushnas063.github.io/slokamruta_sagar_json/appUpdate.json';

/**
 * Checks if the app needs an update by comparing current version with server config
 * @returns Promise<UpdateType> - The type of update needed
 */
export const checkAppUpdate = async (): Promise<UpdateType> => {
    try {
        // Skip update checks in development mode
        // if (__DEV__) {
        //     console.log('Development mode - skipping update check');
        //     return UpdateType.NONE;
        // }

        const response = await fetch(UPDATE_CONFIG_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updateConfig: UpdateConfig = await response.json();

        // Check for maintenance mode first
        if (updateConfig.extra.maintenance_mode) {
            return UpdateType.MAINTENANCE;
        }

        // Get current version - prefer expo-constants, fallback to Application
        const currentVersion = Constants.expoConfig?.version || Application.nativeApplicationVersion;

        if (!currentVersion) {
            console.warn('Could not determine current app version');
            return UpdateType.NONE;
        }

        const minVersion = Platform.select({
            ios: updateConfig.ios_minimum_version,
            android: updateConfig.android_minimum_version,
        });
        const latestVersion = Platform.select({
            ios: updateConfig.latest_ios_version,
            android: updateConfig.latest_android_version,
        });

        // Validate version strings
        if (!minVersion || !latestVersion) {
            console.warn('Invalid version numbers in update config');
            return UpdateType.NONE;
        }

        console.log(`Version check - Current: ${currentVersion}, Min: ${minVersion}, Latest: ${latestVersion}`);

        // Compare versions
        if (compareVersions(currentVersion, minVersion) < 0) {
            return updateConfig.extra.force_update ? UpdateType.FORCE_UPDATE : UpdateType.SOFT_UPDATE;
        } else if (compareVersions(currentVersion, latestVersion) < 0) {
            return UpdateType.SOFT_UPDATE;
        }

        return UpdateType.NONE;
    } catch (error) {
        console.error('Update check error:', error);
        return UpdateType.NONE;
    }
};

/**
 * Shows appropriate alert based on update type
 * @param updateType - Type of update needed
 * @param updateConfig - Update configuration from server
 */
export const showUpdateAlert = (updateType: UpdateType, updateConfig: UpdateConfig) => {
    const isAndroid = Platform.OS === 'android';
    const releaseNotes = isAndroid
        ? updateConfig.extra.release_notes.android
        : updateConfig.extra.release_notes.ios;

    switch (updateType) {
        case UpdateType.FORCE_UPDATE:
            Alert.alert(
                'Update Required',
                `A new version is available. Please update to continue using the app.\n\n${releaseNotes}`,
                [
                    {
                        text: 'Update Now',
                        onPress: () => openStore(),
                    },
                ],
                { cancelable: false }
            );
            break;

        case UpdateType.SOFT_UPDATE:
            Alert.alert(
                'New Version Available',
                `A new version is available with improvements and new features.\n\n${releaseNotes}`,
                [
                    {
                        text: 'Later',
                        style: 'cancel',
                    },
                    {
                        text: 'Update Now',
                        onPress: () => openStore(),
                    },
                ]
            );
            break;

        case UpdateType.MAINTENANCE:
            Alert.alert(
                'Maintenance Mode',
                'The app is currently under maintenance. Please try again later.',
                [
                    {
                        text: 'Contact Support',
                        onPress: () => Linking.openURL(updateConfig.extra.support_url),
                    },
                ],
                { cancelable: false }
            );
            break;

        default:
            break;
    }
};

/**
 * Opens the app store page for the current platform
 */
export const openStore = () => {
    const storeUrl = Platform.select({
        ios: 'https://apps.apple.com/app/idYOUR_APP_ID', // Replace with your iOS App ID
        android: 'https://play.google.com/store/apps/details?id=com.slokamrutasagar', // From your android config
    });

    if (storeUrl) {
        Linking.openURL(storeUrl).catch(err => {
            console.error('Failed to open store:', err);
            Alert.alert('Error', 'Could not open app store. Please try again later.');
        });
    }
};

/**
 * Compares two version strings (e.g., "1.2.3" and "1.10.0")
 * @returns -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 */
const compareVersions = (version1: string, version2: string): number => {
    // Handle null/undefined cases
    if (!version1 || !version2) return 0;

    // Remove any non-numeric characters (like 'v' prefix)
    const v1 = version1.replace(/[^\d.]/g, '');
    const v2 = version2.replace(/[^\d.]/g, '');

    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const v1Part = v1Parts[i] || 0;
        const v2Part = v2Parts[i] || 0;

        if (v1Part > v2Part) return 1;
        if (v1Part < v2Part) return -1;
    }

    return 0;
};