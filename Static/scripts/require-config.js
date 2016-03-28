(function (root, factory) {
	'use strict';
	var requireJsShim = {
		cache: null,
		config: function (config) {
			if (config)
				this.cache = config;
			return this.cache;
		}
	};
	if (typeof define === 'function' && define.amd && typeof requirejs !== 'undefined') {
		factory(requirejs);
	} else if (typeof exports === 'object') {
		var config = factory(requireJsShim).config();
		module.exports = config;
	}
}(this, function (requirejs) {
	'use strict';
	requirejs.config({
		baseUrl: '/../js/',
		paths: {
			base: 'src',
			jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min',
			underscore: 'lib/bower/underscore',
			backbone: 'lib/bower/backbone',
			vendor: 'lib/bower'
		},
		map: {
		    '*': {
		        'velocity': 'vendor/velocity'
		    }
		},
		shim: {
		}
	});
	return requirejs;
}));
