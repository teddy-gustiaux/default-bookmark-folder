// Karma configuration
// Generated on Tue Jul 24 2018 19:51:12 GMT-0400 (Eastern Summer Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'requirejs', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'src/background/utils/Utils.js',
      'test/test-main.js',
      { pattern: 'test/**/*.js', included: false }
    ],


    // list of files / patterns to exclude
    exclude: [
      '**/*.html',
      '**/*.png',
      '**/*.css'
    ],


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
    logLevel: config.LOG_DEBUG,


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
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
