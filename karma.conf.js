// Karma configuration

module.exports = function(config) {
  config.set({
    basePath: '',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha',
      //'requirejs'
      'chai',
      'dirty-chai',
    ],
    // list of files / patterns to load in the browser
    files: [
      // Dependencies
      "node_modules/sinon/pkg/sinon.js",
      'node_modules/sinon-chrome/bundle/sinon-chrome.min.js',
      // Sources
      'src/background/utils/Utils.js',
      // Test files
      //'test/test-main.js',
      { pattern: 'test/**/*.test.js', included: true }
    ],
    // list of files / patterns to exclude
    exclude: [
      '**/*.html',
      '**/*.png',
      '**/*.css'
    ],
    client: {
      mocha: {
        // change Karma's debug.html to the mocha web reporter
        reporter: 'html',
      }
    },
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'html'],
    htmlReporter: {
      outputFile: 'karma/results.html',
      pageTitle: 'Default Bookmark Folder',
      subPageTitle: 'Unit Tests',
      groupSuites: true,
      useCompactStyle: true,
      useLegacyStyle: false,  
    },
    // web server port
    port: 9876,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['FirefoxHeadless'],
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: [ '-headless' ],
      },
    },
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,
    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1
  })
}
