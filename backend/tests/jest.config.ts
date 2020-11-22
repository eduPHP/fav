import { resolve } from 'path'
import rootConfig from '../jest.config'

const root = resolve(__dirname, '..')

export default {
  ...rootConfig,
  rootDir: root,
  displayName: 'end2end-tests',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest-setup.ts'],
}
