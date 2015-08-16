'use strict'

var ngrok = require('ngrok');
module.exports = function(grunt) {

  // Load grunt tasks
  require('load-grunt-tasks')(grunt);

  // Grunt configuration
  grunt.initConfig({
    pagespeed: {
      options: {
        nokey: true,
        locale: "en_GB",
        threshold: 40
      },
      local: {
        options: {
          strategy: "desktop"
        }
      },
      mobile: {
        options: {
          strategy: "mobile"
        }
      }
    },
    imagemin: {
      png: {
        options: {
          optimizationLevel: 7
        },
        files: [
          {
            expand: true,
            cwd: 'UP5-WebSiteOptimization/img',
            src: ['**/*.png'],
            dest: 'UP5-WebSiteOptimization/img/compressed/',
            ext: '.png'
          }
        ]
      },
      jpg: {
        options: {
          progressive: true       
        },
        files: [
          {
          expand: true,
          cwd: 'UP5-WebSiteOptimization/img/',
          src: ['**/*.jpg'],
          dest: 'UP5-WebSiteOptimization/img/compressed/',
          ext: '.jpg'
          }
        ]
      }
    }
  });

  // Register customer task for ngrok
  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 8080;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      done();
    });
  });


  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.registerTask('imagemin', ['imagemin']);
  // Register default tasks
  grunt.registerTask('default', ['psi-ngrok']);
  
}