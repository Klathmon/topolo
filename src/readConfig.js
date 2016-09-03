import promisify from 'es6-promisify'
import Liftoff from 'liftoff'
import { jsVariants } from 'interpret'

import { fatalError } from './events'

export default async function readConfig () {
  const liftoff = new Liftoff({
    name: 'topolo',
    extensions: jsVariants
  })
  const launch = promisify(liftoff.launch, liftoff)

  const { configPath } = await launch()

  if (typeof configPath === 'undefined') {
    fatalError('No topolo config file found.')
  } else {
    return require(configPath)
  }
}
