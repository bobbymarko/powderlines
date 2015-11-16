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
      tasks: ['compass', 'copy:css'/*, 'copy:images'*/]
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
        'assets/js/main.js': ['components/jquery/dist/jquery.js', 'components/chartist/dist/chartist.js', 'assets/scripts/skycons.js', 'assets/scripts/weather.js', 'assets/scripts/mapped.js', 'assets/scripts/jquery.oembed.js', 'assets/scripts/video-player.js', 'assets/scripts/scroller.js', 'assets/scripts/tracking.js'],
        'assets/js/uber-map.js': ['assets/scripts/smart-resize.js','assets/scripts/uber-map.js'],
        'assets/js/api-docs.js': ['assets/scripts/api-docs.js']
      }
    }
  },
  copy: {
    /*bootstrap: {
      files: [
        {expand: true, cwd: 'components/bootstrap/img/', src: ['**'], dest: 'assets/img/'}
      ]
    },*/
    cesium: {
      src: 'assets/Cesium/**',
      dest: '_site/'
    },
    gpx: {
      src: 'assets/gpx/**',
      dest: '_site/'
    },
    css: {
      src: 'assets/css/**', /* application.css is only generated when watch is run */
      dest: '_site/'
    },
    js: {
      src: 'assets/js/**',
      dest: '_site/'
    },
    fonts: {
      src: 'assets/fonts/**',
      dest: '_site/'
    }//,
    //images: {
    //  src: 'assets/img/**',
    //  dest: '_site/'
    //}
  },
  imagemin: {
    dynamic: {
      files: [{
        expand: true,
        cwd: 'assets/img',
        src: ['**/*.{png,jpg,gif}'],
        dest: '_site/assets/img'
      }],
      options: {
        cache: false // this slows down the task but fixes a bug that makes the images 0kb
      }
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
  s3: {
    options: {
      accessKeyId: '<%= aws.key %>',
      secretAccessKey: '<%= aws.secret %>',
      bucket: '<%= aws.bucket %>',
      access: 'public-read',
      region: 'us-east-1',
    },
    build: {
      cwd: "_site/",
      src: "**"
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
grunt.loadNpmTasks('grunt-aws');
grunt.loadNpmTasks('grunt-newer');
grunt.loadNpmTasks('grunt-contrib-compass');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-exec');

grunt.registerTask('default', [ 'uglify', 'compass', 'copy', 'optimize', 'exec:build', 'watch' ]);
grunt.registerTask('serve', [ 'connect:server', 'default' ]);
grunt.registerTask('deploy', [ 'uglify', 'copy', 'optimize', 'exec:build', 's3' ]);
grunt.registerTask('optimize', ['imagemin']);

};