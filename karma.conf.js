/*
===== SETUP OVERVIEW =====

----- CODE COVERAGE -----
The default Karma coverage reporter does not support async/await.
See the issue on GitHub: https://github.com/karma-runner/karma-coverage/issues/321.
Consequently, to circumvent this problem, the setup is as follows:
- Using Babel as a preprocessor to compile down to ES5 on the fly (leveraging Babel poyfill).
- Using a Babel plugin to instrument the code with Istanbul coverage.
- Finally, using the default Karma coverage reporter (now that it can fully understand the code).

Running Karma will generate a text summary of the code coverage to the standard output,
as well as an HTML report located at `coverage/report-html/index.html`.

*/

// Karma configuration
module.exports = config => {
    config.set({
        basePath: '',
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', 'dirty-chai'],
        // list of files / patterns to load in the browser
        files: [
            // Babel polyfill (to be used by the Babel preprocessor)
            'node_modules/@babel/polyfill/dist/polyfill.js',
            // Dependencies
            'node_modules/sinon/pkg/sinon.js',
            'node_modules/sinon-chrome/bundle/sinon-chrome.min.js',
            // Sources
            'src/background/utils/Utils.js',
            // Test files
            { pattern: 'test/**/*.test.js', included: true },
        ],
        // list of files / patterns to exclude
        exclude: ['**/*.html', '**/*.png', '**/*.css'],
        client: {
            mocha: {
                // change Karma's debug.html to the mocha web reporter
                reporter: 'html',
            },
        },
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*.js': ['babel'],
            'test/**/*.js': ['babel'],
        },
        // see: https://github.com/babel/karma-babel-preprocessor
        babelPreprocessor: {
            options: {
                presets: ['@babel/preset-env'],
                sourceMap: 'inline',
                // require: https://github.com/istanbuljs/babel-plugin-istanbul
                plugins: ['istanbul'],
            },
            filename(file) {
                return file.originalPath;
            },
            sourceFileName(file) {
                return file.originalPath;
            },
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'html', 'coverage'],
        // see: https://github.com/matthias-schuetz/karma-htmlfile-reporter
        htmlReporter: {
            outputFile: 'karma/results.html',
            pageTitle: 'Default Bookmark Folder',
            subPageTitle: 'Unit Tests',
            groupSuites: true,
            useCompactStyle: true,
            useLegacyStyle: false,
        },
        // see: https://github.com/karma-runner/karma-coverage
        coverageReporter: {
            type: 'text',
            includeAllSources: true,
            reporters: [
                { type: 'html', subdir: 'report-html' },
                { type: 'text', subdir: 'report-text'},
            ],
        },
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['FirefoxHeadless'],
        customLaunchers: {
            FirefoxHeadless: {
                base: 'Firefox',
                flags: ['-headless'],
            },
        },
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: 1,
    });
};
