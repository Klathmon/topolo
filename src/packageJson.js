import { readFileSync } from 'fs'
import { resolve } from 'path'

export const packageJson = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json')))
