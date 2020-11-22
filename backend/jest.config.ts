import { resolve } from 'path'

const root = resolve(__dirname)

export default {
  rootDir: root,
  displayName: 'root-tests',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest-setup.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
}
