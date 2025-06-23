import { Command, Flags } from '@oclif/core'
import {
  ChromePreference
} from '../browsers/chromium-based-browsers.js'
import {
  chooseProfile,
  getValidPath,
  writeVibraniumPreferences
} from '../utils.js'

export default class Export extends Command {
  static override description = 'Export custom virtual device list from your Chromium-based browser.'

  static override flags = {
    help: Flags.help({ char: 'h' }),
    force: Flags.boolean({ char: 'f', description: 'Skip confirm when overwriting' }),
    browser: Flags.string({ char: 'b', description: 'Specify a browser (e.g. chrome-canary, chromium, edge)', default: 'chrome' }),
  }

  static override examples = [
    {
      description: 'To export your custom emulated device settings, simply type:',
      command: '<%= config.bin %> <%= command.id %>'
    },
    {
      description: 'You can specify a directory/name for the output file:',
      command: '<%= config.bin %> <%= command.id %> ./path/to/the/config.json'
    },
    {
      description: 'To export settings from Chrome Canary:',
      command: '<%= config.bin %> <%= command.id %> --browser chrome-canary'
    }
  ]

  static override args = {
    file: {
      name: 'file',
      required: false,
      description: 'Output file path (defaults to vibranium.json)'
    }
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Export)

    const browserPreference = new ChromePreference()
    const isLaunching = await browserPreference.isLaunching(flags.browser)
    
    if (isLaunching && !flags.force) {
      const browserName = browserPreference.getBrowserName(flags.browser)
      this.log(`⚠️   ${browserName} is currently running. For best results, close it first.`)
      this.log('    Use --force to export anyway (may not capture latest changes).')
    }

    const profiles = browserPreference.getProfileList(flags.browser)
    const profile = await chooseProfile(profiles, 'export device(s) from')
    const configuration = await browserPreference.openConfiguration(profile.profileDirPath)
    const devices = browserPreference.getCustomEmulatedDeviceList(configuration)

    if (devices.length === 0) {
      this.log('❌  No custom emulated devices found in this profile.')
      return
    }

    this.log(`📱  Found ${devices.length} custom emulated device(s)`)

    const outputPath = getValidPath(args.file, 'vibranium.json')
    
    try {
      await writeVibraniumPreferences(outputPath, devices, { force: flags.force })
      this.log(`✨  Successfully exported to: ${outputPath}`)
    } catch (error) {
      if (error instanceof Error && error.message.includes('cancelled')) {
        this.log('❌  Export cancelled')
      } else {
        throw error
      }
    }
  }
}