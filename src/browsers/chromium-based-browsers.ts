// @ts-expect-error
import ChromeProfiles from 'chromium-profile-list'
import { openJson, writeConfiguration } from '../utils'
import * as Path from 'path'
import find from 'find-process'

export interface ChromeProfile {
  displayName: string
  profileDirName: string
  profileDirPath: string
  profilePictureUrl: string
}

interface ScreenDimension { width: number, height: number }
interface Insets { top: number, bottom: number, left: number, right: number }

export const CHROME_VARIATIONS = {
  CHROME: 0,
  CHROME_CANARY: 1,
  CHROMIUM: 2,
  EDGE: 3,
  EDGE_BETA: 4,
  EDGE_DEV: 5,
  EDGE_CANARY: 6
}
export type ChromeVariations = typeof CHROME_VARIATIONS[keyof typeof CHROME_VARIATIONS]
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
  title: string
  type: string
  'user-agent': string
  capabilities: string[]
  screen: {
    'device-pixel-ratio': number
    vertical: ScreenDimension
    horizontal: ScreenDimension
  }
  modes: Array<{
    title: string
    orientation: 'vertical' | 'horizontal'
    insets: Insets
  }>
  'show-by-default': boolean
  show: string
}

interface GoogleChromeConfig {
  devtools: {
    preferences: {
      customEmulatedDeviceList?: string // JSON (Old Chrome)
      "custom-emulated-device-list"?: string // JSON (New Chrome)
    }
  }
}

export class ChromePreference {
  async openConfiguration (path: string): Promise<GoogleChromeConfig> {
    const preferencePath = Path.join(path, 'Preferences')
    return await openJson<GoogleChromeConfig>(preferencePath).then(async (data) => {
      if (!data.devtools) {
        throw Error('You have to open DevTools at least once.')
      }
      const backupFilePath = `${path}.backup`
      await writeConfiguration(data, backupFilePath)
      return data
    })
  }

  async saveConfiguration (config: GoogleChromeConfig, path: string): Promise<void> {
    const preferencePath = Path.join(path, 'Preferences')
    return await writeConfiguration(config, preferencePath)
  }

  async isLaunching (name: string = ''): Promise<boolean> {
    const browser = this.getBrowser(name)
    const processName = BROWSER_PROCESS_NAME[browser]
    return await new Promise(resolve => {
      find('name', processName)
        .then((list: any[]) => {
          resolve(list.filter(i => i.name === processName).length > 0)
        }, (err: any) => {
          throw new Error(err)
        })
    })
  }

  getProfileList (name: string = ''): ChromeProfile[] {
    const browser = this.getBrowser(name)
    try {
      return ChromeProfiles(browser)
    } catch (e) {
      if (e.code === 'ENOENT') {
        throw Error('The browser is not installed!')
      }
    }
    return []
  }

  getBrowserName (name: string = ''): string {
    const index: ChromeVariations = this.getBrowser(name);
    return BROWSER_PROCESS_NAME[index];
  }

  getBrowser (name: string = ''): ChromeVariations {
    const str = name.toLowerCase().replace(/\s|-|_/g, '').replace('google', '').replace(/^(_)/, '')
    if (str === 'chromium') { return CHROME_VARIATIONS.CHROMIUM }
    if (str === 'chromecanary') { return CHROME_VARIATIONS.CHROME_CANARY }
    if (str === 'chrome') { return CHROME_VARIATIONS.CHROME }
    if (str === 'edge') { return CHROME_VARIATIONS.EDGE }
    if (str === 'edgebeta') { return CHROME_VARIATIONS.EDGE_BETA }
    if (str === 'edgecanary') { return CHROME_VARIATIONS.EDGE_CANARY }
    if (str === 'edgedev') { return CHROME_VARIATIONS.EDGE_DEV }
    return CHROME_VARIATIONS.CHROME
  }

  getCustomEmulatedDeviceList (config: GoogleChromeConfig): CustomEmulatedDevice[] {
    const deviceList = config?.devtools?.preferences?.["custom-emulated-device-list"] || '[]';
    try {
      return JSON.parse(deviceList)
    } catch {
      return []
    }
  }

  setCustomEmulatedDeviceList (config: GoogleChromeConfig, list: CustomEmulatedDevice[] = []): GoogleChromeConfig {
    const newConfig = { ...config }
    newConfig.devtools.preferences["custom-emulated-device-list"] = JSON.stringify(list)
    return newConfig
  }
}
