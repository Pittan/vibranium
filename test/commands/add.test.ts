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
  copyFile: vi.fn(),
  access: vi.fn(),
  stat: vi.fn(),
  constants: {
    F_OK: 0
  }
}))

describe('add command', () => {
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

  it('should add devices from a JSON file', async () => {
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
    vi.mocked(fs.readFile).mockImplementation(async (path) => {
      if (path.toString().includes('Preferences')) {
        return JSON.stringify({
          devtools: {
            preferences: {
              customEmulatedDeviceList: '[]'
            }
          }
        })
      }
      if (path.toString().includes('test-devices.json')) {
        return JSON.stringify([mockDevice])
      }
      throw new Error('File not found')
    })

    vi.mocked(fs.copyFile).mockResolvedValue(undefined)
    vi.mocked(fs.writeFile).mockResolvedValue(undefined)

    // Mock user selecting profile
    vi.mocked(inquirer.default.prompt).mockResolvedValue({ profile: mockProfile })

    const { stdout } = await runCommand(['add', 'test-devices.json'])

    expect(stdout).toContain('Current custom emulated device count: 0')
    expect(stdout).toContain('Devices to add from config: 1')
    expect(stdout).toContain('Successfully updated devices! New total: 1')
  })

  it('should error if browser is running without --force', async () => {
    const findProcess = (await import('find-process')).default
    
    // Mock browser running
    vi.mocked(findProcess).mockResolvedValue([{ name: 'Google Chrome', pid: 1234, cmd: 'chrome' }])

    const { error } = await runCommand(['add', 'test-devices.json'])

    expect(error?.message).toContain('must be closed')
  })

  it('should replace all devices with --replace flag', async () => {
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

    // Mock existing devices
    const existingDevice = { ...mockDevice, title: 'Existing Device' }
    vi.mocked(fs.readFile).mockImplementation(async (path) => {
      if (path.toString().includes('Preferences')) {
        return JSON.stringify({
          devtools: {
            preferences: {
              customEmulatedDeviceList: JSON.stringify([existingDevice])
            }
          }
        })
      }
      if (path.toString().includes('test-devices.json')) {
        return JSON.stringify([mockDevice])
      }
      throw new Error('File not found')
    })

    vi.mocked(fs.copyFile).mockResolvedValue(undefined)
    vi.mocked(fs.writeFile).mockResolvedValue(undefined)

    // Mock user interactions
    vi.mocked(inquirer.default.prompt)
      .mockResolvedValueOnce({ profile: mockProfile })
      .mockResolvedValueOnce({ confirmReplace: true })

    const { stdout } = await runCommand(['add', 'test-devices.json', '--replace'])

    expect(stdout).toContain('Current custom emulated device count: 1')
    expect(stdout).toContain('Replacing all devices...')
    expect(stdout).toContain('Successfully updated devices! New total: 1')
  })
})