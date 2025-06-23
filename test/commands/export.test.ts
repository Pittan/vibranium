import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { runCommand } from '@oclif/test'
import type { ChromeProfile, CustomEmulatedDevice } from '../../src/browsers/chromium-based-browsers.js'

// Mock modules
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn()
  }
}))

vi.mock('find-process', () => ({
  default: vi.fn()
}))

vi.mock('chromium-profile-list', () => ({
  default: vi.fn()
}))

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  access: vi.fn(),
  stat: vi.fn(),
  constants: {
    F_OK: 0
  }
}))

describe('export command', () => {
  const mockProfile: ChromeProfile = {
    profileDirPath: '/mock/profile/path',
    profileName: 'Default'
  }

  const mockDevice: CustomEmulatedDevice = {
    title: 'Test Device',
    type: 'phone',
    'user-agent': 'Mozilla/5.0 Test',
    capabilities: ['touch', 'mobile'],
    'show-by-default': true,
    screen: {
      'device-pixel-ratio': 2,
      width: 375,
      height: 667
    },
    modes: [{
      title: 'Default',
      orientation: 'portrait'
    }]
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should export devices to a JSON file', async () => {
    const inquirer = await import('inquirer')
    const findProcess = (await import('find-process')).default
    const getProfileList = (await import('chromium-profile-list')).default
    const fs = await import('node:fs/promises')

    // Mock browser not running
    vi.mocked(findProcess).mockResolvedValue([])

    // Mock profile list
    vi.mocked(getProfileList).mockReturnValue([{
      ProfilePath: mockProfile.profileDirPath,
      Name: mockProfile.profileName
    }])

    // Mock file system operations
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify({
      devtools: {
        preferences: {
          customEmulatedDeviceList: JSON.stringify([mockDevice])
        }
      }
    }))

    vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'))
    vi.mocked(fs.stat).mockResolvedValue({ isDirectory: () => false } as any)
    vi.mocked(fs.writeFile).mockResolvedValue(undefined)

    // Mock user selecting profile
    vi.mocked(inquirer.default.prompt).mockResolvedValue({ profile: mockProfile })

    const { stdout } = await runCommand(['export'])

    expect(stdout).toContain('Found 1 custom emulated device(s)')
    expect(stdout).toContain('Successfully exported to: vibranium.json')
  })

  it('should warn if browser is running', async () => {
    const findProcess = (await import('find-process')).default
    const getProfileList = (await import('chromium-profile-list')).default
    const fs = await import('node:fs/promises')

    // Mock browser running
    vi.mocked(findProcess).mockResolvedValue([{ name: 'Google Chrome', pid: 1234, cmd: 'chrome' }])

    // Mock profile list
    vi.mocked(getProfileList).mockReturnValue([{
      ProfilePath: mockProfile.profileDirPath,
      Name: mockProfile.profileName
    }])

    // Mock file system operations
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify({
      devtools: {
        preferences: {
          customEmulatedDeviceList: JSON.stringify([mockDevice])
        }
      }
    }))

    const { stdout } = await runCommand(['export'])

    expect(stdout).toContain('is currently running')
    expect(stdout).toContain('Use --force to export anyway')
  })

  it('should handle no custom devices', async () => {
    const inquirer = await import('inquirer')
    const findProcess = (await import('find-process')).default
    const getProfileList = (await import('chromium-profile-list')).default
    const fs = await import('node:fs/promises')

    // Mock browser not running
    vi.mocked(findProcess).mockResolvedValue([])

    // Mock profile list
    vi.mocked(getProfileList).mockReturnValue([{
      ProfilePath: mockProfile.profileDirPath,
      Name: mockProfile.profileName
    }])

    // Mock no devices
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify({
      devtools: {
        preferences: {
          customEmulatedDeviceList: '[]'
        }
      }
    }))

    // Mock user selecting profile
    vi.mocked(inquirer.default.prompt).mockResolvedValue({ profile: mockProfile })

    const { stdout } = await runCommand(['export'])

    expect(stdout).toContain('No custom emulated devices found in this profile')
  })

  it('should export to custom path', async () => {
    const inquirer = await import('inquirer')
    const findProcess = (await import('find-process')).default
    const getProfileList = (await import('chromium-profile-list')).default
    const fs = await import('node:fs/promises')

    // Mock browser not running
    vi.mocked(findProcess).mockResolvedValue([])

    // Mock profile list
    vi.mocked(getProfileList).mockReturnValue([{
      ProfilePath: mockProfile.profileDirPath,
      Name: mockProfile.profileName
    }])

    // Mock file system operations
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify({
      devtools: {
        preferences: {
          customEmulatedDeviceList: JSON.stringify([mockDevice])
        }
      }
    }))

    vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'))
    vi.mocked(fs.stat).mockResolvedValue({ isDirectory: () => false } as any)
    vi.mocked(fs.writeFile).mockResolvedValue(undefined)

    // Mock user selecting profile
    vi.mocked(inquirer.default.prompt).mockResolvedValue({ profile: mockProfile })

    const { stdout } = await runCommand(['export', 'custom-output.json'])

    expect(stdout).toContain('Successfully exported to: custom-output.json')
  })
})