module.exports = function(grunt) {
  const exec = require('child_process').exec;

  grunt.loadNpmTasks('grunt-contrib-watch');

  var tomita_command = '/home/andrew_k/soft/tomita-linux64 config/config.proto';

  grunt.initConfig({
    watch: {
      text: {
        files: ['text/*.txt', 'config/*.cxx', 'config/*.proto', 'config/*.gzt'],
        tasks: ['tomita_parser'],
      },
    },
  });

  grunt.registerTask('tomita_parser', 'Tomita parser', function() {
    var done = this.async();
    exec(tomita_command, function(err, stdout) {
      if (err) {
        console.error(err);
      } else {
        console.log(stdout);
      }
      done();
    });
  });


  grunt.registerTask('default', ['watch']);

};