//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
module.exports = {
  testURL: "http://localhost/",
  testRegex: '.*.spec\\.(js|jsx)$',
  setupTestFrameworkScriptFile: './node_modules/prism-jest/src/SetupReactEnzyme.js',
  moduleDirectories: [
    './node_modules'
  ],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/node_modules/prism-jest/src/styleMock.js',
    "\\.(bmp|gif|jpg|jpeg|png|psd|svg|webp)$": "<rootDir>/tests/utils/MediaFileTransformer.js"
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/history.js',
    '!src/registerServiceWorker.js',
    '!src/utils/StatsUtil.js',
    '!../**/node_modules/**'
  ],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'json-summary'],
  reporters: [
    'default',
    [
      '<rootDir>/node_modules/prism-jest/src/CoverageThreshold.js',
      { coverageThresholdFile: './jest/coverageThreshold.json' }
    ]
  ],
  snapshotSerializers: [
    // This allows enzyme wrapper to jest snapshot
    'enzyme-to-json/serializer'
  ],
  bail: true
};
