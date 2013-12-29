module.exports = function(grunt) {

grunt.initConfig({
  watch: {
    options: {
      livereload: true
    },
    html: {
      files: ['**/*.html', '!_site/*'],
      tasks: ['exec:build']
    },
    css: {
      files: ['assets/scss/*.scss'],
      tasks: ['compass', 'copy:css', 'copy:images']
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
    jquery: {
      files: {
        'assets/js/jquery.min.js': 'components/jquery/jquery.js'
      }
    }/*,
    bootstrap: {
      files: {
        'assets/js/bootstrap.min.js': ['components/bootstrap/js/bootstrap-collapse.js',
                                       'components/bootstrap/js/bootstrap-scrollspy.js',
                                       'components/bootstrap/js/bootstrap-button.js',
                                       'components/bootstrap/js/bootstrap-affix.js']
      }
    }*/
  },
  copy: {
    /*bootstrap: {
      files: [
        {expand: true, cwd: 'components/bootstrap/img/', src: ['**'], dest: 'assets/img/'}
      ]
    },*/
    css: {
      src: 'assets/css/**',
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
  connect: {
    server: {
      options: {
        livereload: true,
        base: '_site',
        port: 4000,
      }
    }
  },
  exec: {
    build: {
      cmd: 'jekyll build'
    },
    serve: {
      cmd: 'jekyll serve'
    },
    deploy: {
      cmd: 'rsync --progress -a --delete -e "ssh -q" _site/ myuser@host:mydir/'
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-compass');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-exec');

grunt.registerTask('default', [ 'uglify', 'copy', 'exec:build', 'watch' ]);
grunt.registerTask('deploy', [ 'default', 'exec:deploy' ]);
grunt.registerTask('serve', [ 'connect:server', 'default' ]);

};