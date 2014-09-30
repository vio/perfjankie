var Q = require('q');
var browserPerf = require('browser-perf');

module.exports = function(grunt) {
	grunt.registerMultiTask('metricsgen', 'Generates the names of metrics', function() {
		var apiDocs = new browserPerf.docs();
		var regex = /(_avg|_max|_count)$/;
		var doc = {};

		for (var key in apiDocs.metrics) {
			var modifier = null;
			if (key.match(regex)) {
				var idx = key.lastIndexOf('_');
				modifier = key.substr(idx + 1);
				key = key.substr(0, idx);
			}
			if (typeof doc[key] === 'undefined') {
				doc[key] = apiDocs.metrics[key] || {};
				doc[key].stats = [];
			}
			if (modifier) {
				doc[key].stats.push(modifier);
			}
		}

		this.files.forEach(function(file) {
			grunt.file.write(file.dest, ['var METRICS_LIST =', JSON.stringify(doc)].join(''));
		});
	});
};