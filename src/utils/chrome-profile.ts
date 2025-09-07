/**
 * Extracted from https://github.com/Pittan/chromium-profile-list
 * // Originally based on chrome-profile-list by Israel Roldan (@israelroldan) (ISC License).
 * // Heavily modified by Pittan (@Pittan) (2025).
 */
import { promises as fs } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

// Types
export interface ProfileInfo {
    displayName: string;
    profileDirName: string;
    profileDirPath: string;
}

export interface ProfilePreferences {
    profile: {
        name: string;
    };
}

export type Platform = 'linux' | 'macOS' | 'windows';

export enum BrowserVariant {
    CHROME = 0,
    CHROME_CANARY = 1,
    CHROMIUM = 2,
    EDGE = 3,
    EDGE_BETA = 4,
    EDGE_DEV = 5,
    // eslint-disable-next-line perfectionist/sort-enums
    EDGE_CANARY = 6,
}

// Constants
const PLATFORM_MAP: Pick<Record<NodeJS.Platform, Platform>, 'darwin' | 'linux' | 'win32'> = {
    darwin: 'macOS',
    linux: 'linux',
    win32: 'windows',
};

// Source: https://chromium.googlesource.com/chromium/src/+/HEAD/docs/user_data_dir.md
const BROWSER_LOCATIONS: Record<Platform, string[]> = {
    // TODO: consider the `~/.config` part can be overridden by $CHROME_VERSION_EXTRA or $XDG_CONFIG_HOME
    linux: [
        `${homedir()}/.config/google-chrome`,
        `${homedir()}/.config/google-chrome-beta`,
        `${homedir()}/.config/chromium`,
        '', // Edge not available on Linux
        `${homedir()}/.config/microsoft-edge-beta`,
        `${homedir()}/.config/microsoft-edge-dev`,
        '', // Edge Canary not available on Linux
    ],
    macOS: [
        `${homedir()}/Library/Application Support/Google/Chrome`,
        `${homedir()}/Library/Application Support/Google/Chrome Canary`,
        `${homedir()}/Library/Application Support/Chromium`,
        `${homedir()}/Library/Application Support/Microsoft Edge`,
        `${homedir()}/Library/Application Support/Microsoft Edge Beta`,
        `${homedir()}/Library/Application Support/Microsoft Edge Dev`,
        `${homedir()}/Library/Application Support/Microsoft Edge Canary`,
    ],
    windows: [
        `${process.env.LOCALAPPDATA}\\Google\\Chrome\\User Data`,
        `${process.env.LOCALAPPDATA}\\Google\\Chrome SxS\\User Data`,
        `${process.env.LOCALAPPDATA}\\Chromium\\User Data`,
        `${process.env.LOCALAPPDATA}\\Microsoft\\Edge\\User Data`,
        `${process.env.LOCALAPPDATA}\\Microsoft\\Edge Beta\\User Data`,
        `${process.env.LOCALAPPDATA}\\Microsoft\\Edge Dev\\User Data`,
        `${process.env.LOCALAPPDATA}\\Microsoft\\Edge SxS\\User Data`,
    ],
};

// Utility functions
const getCurrentPlatform = (): Platform => PLATFORM_MAP[process.platform as keyof typeof PLATFORM_MAP] || 'linux';

const pathExists = async (path: string): Promise<boolean> => {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
};

const readJsonFile = async <T = unknown>(filePath: string): Promise<T> => {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content) as T;
};

const isValidProfileDirectory = async (profilePath: string): Promise<boolean> => {
    const preferencesPath = join(profilePath, 'Preferences');
    return pathExists(preferencesPath);
};

const createProfileInfo = async (
    browserConfigDir: string,
    profileDirName: string
): Promise<ProfileInfo> => {
    const profileDirPath = join(browserConfigDir, profileDirName);
    const preferencesPath = join(profileDirPath, 'Preferences');

    const preferences = await readJsonFile<ProfilePreferences>(preferencesPath);

    return {
        displayName: preferences.profile.name,
        profileDirName,
        profileDirPath,
    };
};

// Main function
export const getChromiumProfiles = async (
    variant: BrowserVariant = BrowserVariant.CHROME
): Promise<ProfileInfo[]> => {
    const platform = getCurrentPlatform();
    const browserConfigDir = BROWSER_LOCATIONS[platform][variant];

    if (!browserConfigDir) {
        return [];
    }

    if (!(await pathExists(browserConfigDir))) {
        return [];
    }

    try {
        const entries = await fs.readdir(browserConfigDir);

        // Filter valid profile directories
        const validProfileDirs = await Promise.all(
            entries
                .filter(entry => entry !== 'System Profile') // Exclude system profile
                .map(async (entry) => {
                    const profilePath = join(browserConfigDir, entry);
                    const isValid = await isValidProfileDirectory(profilePath);
                    return isValid ? entry : null;
                })
        );

        // Create profile info for valid directories
        const profiles = await Promise.all(
            validProfileDirs
                .filter((dir): dir is string => dir !== null)
                .map(dir => createProfileInfo(browserConfigDir, dir))
        );

        return profiles;
    } catch (error) {
        console.error('Error reading browser profiles:', error);
        return [];
    }
};
