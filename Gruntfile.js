module.exports = function(grunt){

    // 项目配置
    grunt.initConfig({
    	uglify: {
	    	my_target: {
		      files: [{
		          expand: true,
		          cwd: 'public/jsmin',
		          src: '**/*.js',
		          dest: 'public/js'
		      }]
		    }
	    },

	    less: {
			production: {
                options: {
                    yuicompress: true
                },
                files: {
                    "public/css/style.css": "public/css/style.less"
                }
            }
		},

        watch: {
        	css: {
				files: 'public/css/**/*.less',
				tasks: ['less'],
				options: {
				  	livereload: true
				}
			},
            jade: {
                files: ['views/**'],
				options:{
					livereload:true
				}
            },
            js: {
                files:['public/js/**','public/jsmin/**', 'routes/*.js', 'data/**/*.js','lib/*.js'],
				options:{
					livereload:true
				}
            }               
        },
		
		nodemon: {
            dev: {
				script: 'app.js',
				options: {
					file: 'app.js',
					args: [],
					ignored: ['node_modules/**'],
					watchedExtensions: ['js'],
					watchedFolders: ['app', 'config'],
					debug:true,
					delayTime: 1,
					env: {
						PORT: '3000'
					},
					cwd:__dirname
				}
			}
		},
		
		concurrent: {
			tasks: ['nodemon', 'watch','uglify','less'],
            options: {
              logConcurrentOutput: true
            }
		}
    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
	
	grunt.option('force',true);
	
    // 默认任务
    grunt.registerTask('default',['concurrent']);
}