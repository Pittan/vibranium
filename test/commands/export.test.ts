import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('export', () => {
  it('runs export cmd', async () => {
    const {stdout} = await runCommand('export')
    expect(stdout).to.contain('hello world')
  })

  it('runs export --name oclif', async () => {
    const {stdout} = await runCommand('export --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
