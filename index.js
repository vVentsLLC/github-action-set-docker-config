const fs = require('fs')
const path = require('path')
const core = require('@actions/core')
const io = require('@actions/io')

async function run() {
  const registry = core.getInput('registry')
  const username = core.getInput('username')
  const password = core.getInput('password')

  const auth = Buffer.from(`${username}:${password}`).toString('base64')
  const config = {
    auths: { [registry]: { auth } }
  }

  core.debug(`setting docker config to: ${JSON.stringify(config, null, 2)}}`)

  const fileDir = `/tmp/set_docker_config_${Date.now()}`
  const fileName = 'config.json'
  const filePath = path.join(fileDir, fileName)

  core.debug(`writing docker config to: ${filePath}`)

  await io.mkdirP(fileDir)
  fs.writeFileSync(filePath, JSON.stringify(config), 'utf8')

  core.debug(`Setting DOCKER_CONFIG to: ${fileDir}`)
  core.exportVariable('DOCKER_CONFIG', fileDir)

}

run().catch(error => {
  console.error(error)
  core.setFailed(error.message)
})
