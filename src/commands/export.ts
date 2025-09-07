import {Args, Command, Flags} from '@oclif/core'

import {
  ChromePreference,
} from '../utils/chromium-based-browsers.js'
import {
  chooseProfile,
  getValidPath,
  writeVibraniumPreferences
} from '../utils/index.js'

export default class Export extends Command {
  static override args = {
    file: Args.string({ name: 'file' }),
  }
  static override description = 'Export custom virtual device list from your Chromium-based browser.'
  static override examples = [
    `- To export your custom emulated device settings, simply type:
    $ vibranium export`,
    `- You can specify a directory/name for the output file with:
    $ vibranium export ./path/to/the/config.json`,
    `- If you want to export settings from Chrome Canary, type:
    $ vibranium export --browser chrome-canary`
  ]
  static override flags = {
    browser: Flags.string({ char: 'b', default: 'chrome', description: 'Specify a browser (e.g. chrome-canary, chromium, edge)' }),
    force: Flags.boolean({ char: 'f', description: 'Skip confirm when overwriting' }),
    help: Flags.help({ char: 'h' })
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Export)
    const browserPreference = new ChromePreference()
    const profiles = await browserPreference.getProfileList(flags.browser)
    const profile = await chooseProfile(profiles, 'export')
    const configuration = await browserPreference.openConfiguration(profile.profileDirPath)
    const devices = browserPreference.getCustomEmulatedDeviceList(configuration)
    const filepath = await getValidPath(args.file)
    const result = await writeVibraniumPreferences(devices, filepath, flags.force)
    if (!result) { return }
    this.log(`Custom emulated device list successfully exported on ${filepath}`)
  }
}
