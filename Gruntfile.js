var jsFiles = [
      'src/utils.js'
    , 'src/stroke_builder.js'
    , 'src/stroke_definitions.js'
    , 'src/haunt.js'
    ]
, jsFilesWithExports = jsFiles.concat('src/exports.js');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')

  , buildDir: 'build'

  , banner: [
      '// ghostwriter <%= pkg.version %>'
    , '// =============<%= new Array(pkg.version.length).join("=") %>'
    , '// * GitHub: https://github.com/jharding/ghostwriter'
    , '// * Copyright (c) <%= grunt.template.today("yyyy") %> Jake Harding'
    , '// * Licensed under the MIT license.\n\n'
    ].join('\n')

  , uglify: {
      options: {
        wrap: 'ghostwriter'
      , banner: '<%= banner %>'
      }
    , js: {
        options: {
          mangle: false,
          beautify: true
        , compress: false
        }
      , src: jsFilesWithExports
      , dest: '<%= buildDir %>/ghostwriter.js'
      }
    , jsmin: {
        options: {
          mangle: true
        , compress: true
        }
      , src: jsFilesWithExports
      , dest: '<%= buildDir %>/ghostwriter.min.js'
      }
    }

  , jshint: {
      options: {
      // enforcing options
        curly: true
      , newcap: true
      , noarg: true
      , noempty: true
      , nonew: true
      , quotmark: true
      , trailing: true
      , maxlen: 80

      // relaxing options
      , boss: true
      , es5: true
      , expr: true
      , laxcomma: true

      // environments
      , browser: true
      }
    , tests: ['test/*.js']
    , gruntfile: ['Gruntfile.js']
    , ghostwriter: ['src/**/*.js']
    }

  , watch: {
      js: {
        files: 'src/**/*.js'
      , tasks: 'uglify:js'
      }
    }

  , jasmine: {
      ghostwriter: {
        src: jsFiles
      , options: {
          specs: 'test/*_spec.js'
        , helpers: 'test/helpers/*'
        , vendor: 'test/vendor/*'
        }
      }
    }

  , exec: {
      open_spec_runner: {
        cmd: 'open _SpecRunner.html'
      }
    , publish_assets: {
        cmd: [
          'zip -r <%= buildDir %>/typeahead.zip <%= buildDir %>',
        , 'git checkout gh-pages',
        , 'cp -r <%= buildDir %> releases/<%= pkg.version %>',
        , 'cp -rf <%= buildDir %> releases/latest',
        , 'git add releases/<%= pkg.version %>',
        , 'git commit --message "Add assets for <%= pkg.version %>."',
        , 'git checkout -'
        ].join(' && ')
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', 'uglify');
  grunt.registerTask('lint', 'jshint');
  grunt.registerTask('test', 'jasmine');
  grunt.registerTask(
    'test:browser'
  , ['jasmine:ghostwriter:build', 'exec:open_spec_runner']
  );
};
