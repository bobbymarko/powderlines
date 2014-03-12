module.exports = function(grunt) {

grunt.initConfig({
  watch: {
    options: {
      livereload: true
    },
    markdown: {
      files: ['**/*.markdown', '!_site/*'],
      tasks: ['exec:build']
    },
    html: {
      files: ['**/*.html', '!_site/*'],
      tasks: ['exec:build']
    },
    css: {
      files: ['assets/scss/*.scss'],
      tasks: ['compass', 'copy:css', 'copy:images']
    },
    js: {
      files: ['assets/scripts/*.js'],
      tasks: ['uglify', 'copy:js']
    },
    gpx: {
      files: ['assets/gpx/*.gpx'],
      tasks: ['copy:gpx']
    }
  },
  compass: {
    dist: {
      options: {
        config: 'compass.rb'
      }
    }
  },
  uglify: {
    app: {
      files: {
        'assets/js/main.js': ['components/jquery/jquery.js', 'assets/scripts/skycons.js', 'assets/scripts/weather.js', 'assets/scripts/mapped.js', 'assets/scripts/jquery.oembed.js', 'assets/scripts/video-player.js', 'assets/scripts/scroller.js', 'assets/scripts/tracking.js']
      }
    }
  },
  copy: {
    /*bootstrap: {
      files: [
        {expand: true, cwd: 'components/bootstrap/img/', src: ['**'], dest: 'assets/img/'}
      ]
    },*/
    gpx: {
      src: 'assets/gpx/**',
      dest: '_site/'
    },
    css: {
      src: 'assets/css/**',
      dest: '_site/'
    },
    js: {
      src: 'assets/js/**',
      dest: '_site/'
    },
    fonts: {
      src: 'assets/fonts/**',
      dest: '_site/'
    },
    images: {
      src: 'assets/img/**',
      dest: '_site/'
    }
  },
  imagemin: {                          // Task
    dynamic: {                         // Another target
      files: [{
        expand: true,                  // Enable dynamic expansion
        cwd: 'assets/img',                   // Src matches are relative to this path
        src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
        dest: '_site/'                  // Destination path prefix
      }]
    }
  },
  connect: {
    server: {
      options: {
        livereload: true,
        base: '_site',
        port: 4000,
      }
    }
  },
  aws: grunt.file.readJSON('grunt-aws.json'),
  aws_s3: {
    options: {
      accessKeyId: '<%= aws.key %>',
      secretAccessKey: '<%= aws.secret %>',
      bucket: '<%= aws.bucket %>',
      access: 'public-read',
      region: 'us-east-1',
      differential: true,
      headers: {
        // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
        "Cache-Control": "max-age=630720000, public",
        "Expires": new Date(Date.now() + 63072000000).toUTCString()
      }
    },
    dev: {
      // These options override the defaults
      options: {
        encodePaths: true,
        uploadConcurrency: 20
      },
      files: [
        {expand: true, cwd: '_site', src: ['**'], dest: ''}
      ]
    }
  },
  exec: {
    build: {
      cmd: 'jekyll build'
    },
    serve: {
      cmd: 'jekyll serve'
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-aws-s3');
grunt.loadNpmTasks('grunt-contrib-compass');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-exec');

grunt.registerTask('default', [ 'uglify', 'copy', 'exec:build', 'watch' ]);
grunt.registerTask('serve', [ 'connect:server', 'default' ]);
grunt.registerTask('deploy', [ 'uglify', 'copy', 'exec:build', 'aws_s3' ]);
grunt.registerTask('optimize', ['imagemin']);

};