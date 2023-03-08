module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['jest-extended/all'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './test/tsconfig.json',
      },
    ],
  },
}
