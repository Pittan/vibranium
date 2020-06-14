// @ts-expect-error
import ChromeProfiles from 'chrome-profile-list'
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
    orientation: 'vertical' | 'hotizontal'
    insets: Insets
  }>
  'show-by-default': boolean
  show: string
}

interface GoogleChromeConfig {
  devtools: {
    preferences: {
      customEmulatedDeviceList: string // JSON
    }
  }
}

export class ChromePreference {
  async openConfiguration (path: string): Promise<GoogleChromeConfig> {
    const preferencePath = Path.join(path, 'Preferences')
    return await openJson<GoogleChromeConfig>(preferencePath).then(async (data) => {
      const backupFilePath = `${path}.backup`
      await writeConfiguration(data, backupFilePath)
      return data
    })
  }

  async saveConfiguration (config: GoogleChromeConfig, path: string): Promise<void> {
    const preferencePath = Path.join(path, 'Preferences')
    return await writeConfiguration(config, preferencePath)
  }

  async isLaunching (): Promise<boolean> {
    return await new Promise(resolve => {
      find('name', 'Google Chrome')
        .then((list: any[]) => {
          resolve(list.length > 0)
        }, (err: any) => {
          throw new Error(err)
        })
    })
  }

  getProfileList (): ChromeProfile[] {
    return ChromeProfiles()
  }

  getCustomEmulatedDeviceList (config: GoogleChromeConfig): CustomEmulatedDevice[] {
    try {
      return JSON.parse(config?.devtools?.preferences?.customEmulatedDeviceList)
    } catch {
      return []
    }
  }

  setCustomEmulatedDeviceList (config: GoogleChromeConfig, list: CustomEmulatedDevice[] = []): GoogleChromeConfig {
    const newConfig = { ...config }
    newConfig.devtools.preferences.customEmulatedDeviceList = JSON.stringify(list)
    return newConfig
  }
}
