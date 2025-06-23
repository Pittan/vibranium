import { Command, Flags } from '@oclif/core'
import {
  ChromePreference,
  type CustomEmulatedDevice
} from '../browsers/chromium-based-browsers.js'
import {
  chooseProfile,
  openJson
} from '../utils.js'
import inquirer from 'inquirer'

export default class Add extends Command {
  static override description = 'Add custom emulated devices from a JSON config file.'

  static override flags = {
    help: Flags.help({ char: 'h' }),
    force: Flags.boolean({ char: 'f', description: 'Skip confirm when overwriting' }),
    browser: Flags.string({ char: 'b', description: 'Specify a browser (e.g. chrome-canary, chromium, edge)', default: 'chrome' }),
    replace: Flags.boolean({ char: 'r', description: 'Replace all your existing emulated devices inside Chrome.' }),
  }

  static override examples = [
    {
      description: 'To add a custom device to your browser, simply type:',
      command: '<%= config.bin %> <%= command.id %> vibranium.json'
    },
    {
      description: 'To add from a specific path:',
      command: '<%= config.bin %> <%= command.id %> path/to/the/config.json'
    },
    {
      description: 'To swap all the devices with your config:',
      command: '<%= config.bin %> <%= command.id %> vibranium.json --replace'
    },
    {
      description: 'To add settings to Chrome Canary:',
      command: '<%= config.bin %> <%= command.id %> --browser chrome-canary'
    }
  ]

  static override args = {
    file: {
      name: 'file',
      required: true,
      description: 'JSON file containing device configurations'
    }
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Add)

    const browserPreference = new ChromePreference()
    const isLaunching = await browserPreference.isLaunching(flags.browser)
    if (isLaunching && !flags.force) {
      const browserName = browserPreference.getBrowserName(flags.browser)
      this.error(`${browserName} must be closed. use --force to run anyway.`)
    }

    const profiles = browserPreference.getProfileList(flags.browser)
    const profile = await chooseProfile(profiles, 'add device(s)')
    const configuration = await browserPreference.openConfiguration(profile.profileDirPath)
    const currentDevices = browserPreference.getCustomEmulatedDeviceList(configuration)
    const config = await openJson<CustomEmulatedDevice[]>(args.file)
    let list: CustomEmulatedDevice[] = currentDevices

    this.log(`📱  Current custom emulated device count: ${currentDevices.length}`)
    this.log(`📦  Devices to add from config: ${config.length}`)

    if (flags.replace) {
      const response = await inquirer.prompt<{ confirmReplace: boolean }>([
        {
          type: 'confirm',
          name: 'confirmReplace',
          message: 'Are you sure you want to replace all existing devices?',
          default: false
        }
      ])

      if (!response.confirmReplace) {
        this.log('❌  Operation cancelled')
        return
      }

      list = config
      this.log('🔄  Replacing all devices...')
    } else {
      const duplicates: string[] = []
      
      for (const device of config) {
        const existingIndex = currentDevices.findIndex(d => d.title === device.title)
        
        if (existingIndex >= 0) {
          duplicates.push(device.title)
        } else {
          list.push(device)
        }
      }

      if (duplicates.length > 0) {
        this.log(`⚠️   Found ${duplicates.length} duplicate device(s): ${duplicates.join(', ')}`)
        
        const response = await inquirer.prompt<{ overwriteDuplicates: boolean }>([
          {
            type: 'confirm',
            name: 'overwriteDuplicates',
            message: 'Do you want to overwrite the duplicate devices?',
            default: false
          }
        ])

        if (response.overwriteDuplicates) {
          for (const device of config) {
            const existingIndex = list.findIndex(d => d.title === device.title)
            if (existingIndex >= 0) {
              list[existingIndex] = device
            }
          }
          this.log('✅  Duplicates overwritten')
        } else {
          this.log('ℹ️   Skipped duplicate devices')
        }
      }
    }

    const updatedConfiguration = browserPreference.updateCustomEmulatedDeviceList(configuration, list)
    await browserPreference.saveConfiguration(profile.profileDirPath, updatedConfiguration)

    this.log(`✨  Successfully updated devices! New total: ${list.length}`)
  }
}