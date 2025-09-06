import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('add', () => {
  it('runs add cmd', async () => {
    const {stdout} = await runCommand('add')
    expect(stdout).to.contain('hello world')
  })

  it('runs add --name oclif', async () => {
    const {stdout} = await runCommand('add --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
