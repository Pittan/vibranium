import { homedir, platform } from 'node:os'
import { join } from 'node:path'
import { readFile, writeFile, copyFile } from 'node:fs/promises'
import findProcess from 'find-process'
import getProfileList from 'chromium-profile-list'

export interface ChromeProfile {
  profileDirPath: string
  profileName: string
}

export interface Viewport {
  width: number
  height: number
}

export interface CustomEmulatedDevice {
  title: string
  type: string
  'user-agent': string
  capabilities: string[]
  'show-by-default': boolean
  screen: {
    'device-pixel-ratio': number
    width: number
    height: number
    vertical?: Viewport
    horizontal?: Viewport
  }
  modes: Array<{
    title: string
    orientation: string
    insets?: {
      left: number
      top: number
      right: number
      bottom: number
    }
    image?: string
  }>
  'dual-screen'?: string
  'show-by-default'?: boolean
}

interface ChromePreferences {
  devtools?: {
    preferences?: {
      customEmulatedDeviceList?: string
      'custom-emulated-device-list'?: string
      [key: string]: unknown
    }
  }
  [key: string]: unknown
}

type BrowserName = 'chrome' | 'chrome-canary' | 'chromium' | 'edge' | 'edge-beta' | 'edge-dev' | 'edge-canary'

const BROWSER_PROCESS_NAMES: Record<BrowserName, string[]> = {
  chrome: ['Google Chrome', 'chrome.exe', 'google-chrome'],
  'chrome-canary': ['Google Chrome Canary', 'chrome.exe'],
  chromium: ['Chromium', 'chromium.exe', 'chromium-browser', 'chromium'],
  edge: ['Microsoft Edge', 'msedge.exe'],
  'edge-beta': ['Microsoft Edge Beta', 'msedge.exe'],
  'edge-dev': ['Microsoft Edge Dev', 'msedge.exe'],
  'edge-canary': ['Microsoft Edge Canary', 'msedge.exe']
}

const BROWSER_DISPLAY_NAMES: Record<BrowserName, string> = {
  chrome: 'Google Chrome',
  'chrome-canary': 'Google Chrome Canary',
  chromium: 'Chromium',
  edge: 'Microsoft Edge',
  'edge-beta': 'Microsoft Edge Beta',
  'edge-dev': 'Microsoft Edge Dev',
  'edge-canary': 'Microsoft Edge Canary'
}

export class ChromePreference {
  async openConfiguration(profileDirPath: string): Promise<ChromePreferences> {
    const preferencePath = join(profileDirPath, 'Preferences')
    const data = await readFile(preferencePath, 'utf-8')
    return JSON.parse(data) as ChromePreferences
  }

  async saveConfiguration(
    profileDirPath: string,
    configuration: ChromePreferences
  ): Promise<void> {
    const preferencePath = join(profileDirPath, 'Preferences')
    const backupPath = join(profileDirPath, 'Preferences.bak')
    
    // Create backup
    await copyFile(preferencePath, backupPath)
    
    // Save new configuration
    const data = JSON.stringify(configuration, null, 2)
    await writeFile(preferencePath, data, 'utf-8')
  }

  getCustomEmulatedDeviceList(configuration: ChromePreferences): CustomEmulatedDevice[] {
    const preferences = configuration.devtools?.preferences
    if (!preferences) return []
    
    // Try both old and new key names
    const devicesString = preferences.customEmulatedDeviceList || 
                         preferences['custom-emulated-device-list']
    
    if (!devicesString) return []
    
    try {
      return JSON.parse(devicesString) as CustomEmulatedDevice[]
    } catch {
      return []
    }
  }

  updateCustomEmulatedDeviceList(
    configuration: ChromePreferences,
    devices: CustomEmulatedDevice[]
  ): ChromePreferences {
    // Ensure nested structure exists
    if (!configuration.devtools) {
      configuration.devtools = {}
    }
    if (!configuration.devtools.preferences) {
      configuration.devtools.preferences = {}
    }
    
    const devicesString = JSON.stringify(devices)
    
    // Update both old and new key names for compatibility
    configuration.devtools.preferences.customEmulatedDeviceList = devicesString
    configuration.devtools.preferences['custom-emulated-device-list'] = devicesString
    
    return configuration
  }

  async isLaunching(browserName: string): Promise<boolean> {
    const processNames = BROWSER_PROCESS_NAMES[browserName as BrowserName]
    if (!processNames) {
      throw new Error(`Unknown browser: ${browserName}`)
    }
    
    for (const processName of processNames) {
      const processes = await findProcess('name', processName)
      if (processes.length > 0) {
        return true
      }
    }
    
    return false
  }

  getBrowserName(browserName: string): string {
    return BROWSER_DISPLAY_NAMES[browserName as BrowserName] || browserName
  }

  getProfileList(browserName: string): ChromeProfile[] {
    const profiles = getProfileList(browserName) as Array<{
      ProfilePath: string
      Name: string
    }>
    
    return profiles.map(profile => ({
      profileDirPath: profile.ProfilePath,
      profileName: profile.Name || 'Default'
    }))
  }
}