import find, { ProcessInfo } from 'find-process'
import Path from 'node:path'

import {BrowserVariant, getChromiumProfiles, ProfileInfo} from './chrome-profile.js'
import { openJson, writeConfiguration } from './index.js'

interface ScreenDimension { height: number; width: number, }
interface Insets { bottom: number, left: number, right: number; top: number, }

export type ChromeVariations = typeof BrowserVariant[keyof typeof BrowserVariant]
const BROWSER_PROCESS_NAME = [
    'Google Chrome',
    'Google Chrome Canary',
    'Chromium',
    'Microsoft Edge',
    'Microsoft Edge Beta',
    'Microsoft Edge Dev',
    'Microsoft Edge Canary'
]

export interface CustomEmulatedDevice {
    capabilities: string[]
    modes: Array<{
        insets: Insets
        orientation: 'horizontal' | 'vertical'
        title: string
    }>
    screen: {
        'device-pixel-ratio': number
        horizontal: ScreenDimension
        vertical: ScreenDimension
    }
    show: string
    'show-by-default': boolean
    title: string
    type: string
    'user-agent': string
}

interface GoogleChromeConfig {
    devtools: {
        preferences: {
            "custom-emulated-device-list"?: string // JSON (New Chrome)
            customEmulatedDeviceList?: string // JSON (Old Chrome)
        }
    }
}

export class ChromePreference {
    getBrowser (name: string = ''): ChromeVariations {
        const str = name.toLowerCase().replaceAll(/\s|-|_/g, '').replace('google', '').replace(/^(_)/, '')
        if (str === 'chromium') { return BrowserVariant.CHROMIUM }
        if (str === 'chromecanary') { return BrowserVariant.CHROME_CANARY }
        if (str === 'chrome') { return BrowserVariant.CHROME }
        if (str === 'edge') { return BrowserVariant.EDGE }
        if (str === 'edgebeta') { return BrowserVariant.EDGE_BETA }
        if (str === 'edgecanary') { return BrowserVariant.EDGE_CANARY }
        if (str === 'edgedev') { return BrowserVariant.EDGE_DEV }
        return BrowserVariant.CHROME
    }

    getBrowserName (name: string = ''): string {
        const index: ChromeVariations = this.getBrowser(name);
        return BROWSER_PROCESS_NAME[index];
    }

    getCustomEmulatedDeviceList (config: GoogleChromeConfig): CustomEmulatedDevice[] {
        const deviceList = config?.devtools?.preferences?.["custom-emulated-device-list"] || '[]';
        try {
            return JSON.parse(deviceList)
        } catch {
            return []
        }
    }

    async getProfileList (name: string = ''): Promise<ProfileInfo[]> {
        const browser = this.getBrowser(name)
        try {
            return getChromiumProfiles(browser)
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'ENOENT') {
                throw new Error('The browser is not installed!')
            }
        }

        return []
    }

    async isLaunching (name: string = ''): Promise<boolean> {
        const browser = this.getBrowser(name)
        const processName = BROWSER_PROCESS_NAME[browser]
        return new Promise(resolve => {
            find.default('name', processName)
                .then((list: ProcessInfo[]) => {
                    resolve(list.some(i => i.name === processName))
                }).catch((error: unknown) => {
                    throw new Error(String(error))
                })
        })
    }

    async openConfiguration (path: string): Promise<GoogleChromeConfig> {
        const preferencePath = Path.join(path, 'Preferences')
        return openJson<GoogleChromeConfig>(preferencePath).then(async (data) => {
            if (!data.devtools) {
                throw new Error('You have to open DevTools at least once.')
            }

            const backupFilePath = `${path}.backup`
            await writeConfiguration(data, backupFilePath)
            return data
        })
    }

    async saveConfiguration (config: GoogleChromeConfig, path: string): Promise<void> {
        const preferencePath = Path.join(path, 'Preferences')
        return writeConfiguration(config, preferencePath)
    }

    setCustomEmulatedDeviceList (config: GoogleChromeConfig, list: CustomEmulatedDevice[] = []): GoogleChromeConfig {
        const newConfig = { ...config }
        newConfig.devtools.preferences["custom-emulated-device-list"] = JSON.stringify(list)
        return newConfig
    }
}
