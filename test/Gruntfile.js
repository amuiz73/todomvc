module.exports = function (grunt) {
	var _ = grunt.util._;
	var bower = require('bower');
	var wrench = require('wrench');

	grunt.registerTask('todomvc-common', function () {
		var done = this.async();

		grunt.file.setBase('../');

		var directories = grunt.file.expand({
			filter: function (src) {
				return grunt.file.isDir(src) && src.substr(-14) === 'todomvc-common' && !src.match(/batman/);
			}
		}, [
			'architecture-examples/**',
			'dependency-examples/**',
			'labs/architecture-examples/**',
			'labs/dependency-examples/**'
		]);

		directories.forEach(function (destPath) {
			wrench.copyDirSyncRecursive(
				'labs/architecture-examples/batman/bower_components/todomvc-common', destPath, {
					forceDelete: true,
					preserveFiles: false
				}, function () {
					console.log(arguments)
				});
		});
	});
};
