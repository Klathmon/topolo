import { delimiter, resolve as pathResolve } from 'path'
import spawn from 'cross-spawn'
import spawnArgs from 'spawn-args'

export function runCommand (command = null, env = {}) {
  if (command === null) {
    return Promise.resolve()
  } else {
    return new Promise((resolve, reject) => {
      const args = spawnArgs(command, { removequotes: 'always' })
      const proc = spawn(args.shift(), args, {
        stdio: 'inherit',
        env: {
          ...process.env,
          PATH: process.env.PATH + delimiter + pathResolve(process.cwd(), 'node_modules', '.bin'),
          ...env
        }
      })

      proc.on('error', (err) => reject(err))

      proc.on('exit', (code) => {
        if (parseInt(code, 10) === 0) {
          resolve()
        } else {
          reject(new Error(`Non-zero exit code of "${code}"`))
        }
      })
    })
  }
}
