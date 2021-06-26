import { Command, flags } from '@oclif/command'
import {
  ChromePreference,
} from '../browsers/chromium-based-browsers'
import {
  chooseProfile,
  getValidPath,
  writeVibraniumPreferences
} from '../utils'

/**
 * # export
 *
 * ```
 * # This will export vibranium.json to your current directory.
 * $ vibranium export
 *
 * # You can set a custom name for the configuration file.
 * # It will exported as my-configuration.json to your current directory.
 * $ vibranium export my-configuration.json
 *
 * # Or you can pass a full path
 * $ vibranium export ~/path/to/my/config.json
 * ```
 */
export default class Export extends Command {
  static description = 'Export custom virtual device list from your Chrome browser.'

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f', description: 'Skip confirm when overwriting' }),
    browser: flags.string({ char: 'b', description: 'Specify a browser (e.g. chrome-canary, chromium)', default: 'chrome' })
  }

  static examples = [
    `- To export your custom emulated device settings, simply type:
    $ vibranium export`,
    `- You can specify a directory/name for the output file with:
    $ vibranium export ./path/to/the/config.json`,
    `- If you want to export settings from Chrome Canary, type:
    $ vibranium export --browser chrome-canary`
  ]

  static args = [{ name: 'file' }]

  async run (): Promise<void> {
    const { args, flags } = this.parse(Export)
    const browserPreference = new ChromePreference()
    const profiles = browserPreference.getProfileList(flags.browser)
    const profile = await chooseProfile(profiles, 'export')
    const configuration = await browserPreference.openConfiguration(profile.profileDirPath)
    const devices = browserPreference.getCustomEmulatedDeviceList(configuration)
    const filepath = await getValidPath(args.file)
    const result = await writeVibraniumPreferences(devices, filepath, flags.force)
    if (!result) { return }
    this.log(`Custom emulated device list successfully exported on ${filepath}`)
  }
}
