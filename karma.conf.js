// Karma configuration

module.exports = function (config) {
  config.set({

    // Start these browsers
    browsers: ['PhantomJS'],

    // Files to include in the test
    files: [
      'loupe.js',
      'test/**/*.js'
    ],

    // Testing frameworks
    frameworks: ['jasmine'],

    // Auto run tests on start and exit
    singleRun: true

  });
};
