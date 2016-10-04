var fs = require('fs'),
	fsdr = require('fs-readdir-recursive'),
	path = require('path'),
    slash = require('slash'),
	_ = require('lodash');

module.exports = function (deploy) {

	"use strict";

	function getDirectoryContents(baseDir) {

		var ext = '.js';

		return function (filePath, alias) {

			return fsdr(filePath ? path.join(baseDir, filePath) : baseDir).reduce(function getCurrentDirectoryContents(arr, item) {
				return item.indexOf(ext) >= 0 ?
					arr.concat({
						alias: slash(alias ? path.join(alias, item.substring(0, item.indexOf(ext))) : item.substring(0, item.indexOf(ext))),
						path: slash(filePath ? path.join(filePath, item.substring(0, item.indexOf(ext))) : item.substring(0, item.indexOf(ext)))
					})
					: arr;
			}, []);
		}
	};

	function getIncludes(config, dir) {

		if(!config.paths) return [];

		var baseDir = path.join(__dirname, dir),
			readDir = getDirectoryContents(baseDir),
			ext = '.js';

		return _.uniq(Object.keys(config.paths).reduce(function getInclude(arr, filePath) {

			if(_.startsWith(config.paths[filePath], 'http')) return arr;

			try {
				return fs.lstatSync(path.join(baseDir, config.paths[filePath] + ext)).isFile() ?
					arr.concat({
						alias: slash(filePath),
						path: slash(config.paths[filePath])
					})
					: arr;
			}
			catch(fileErr) {
				try {
					return fs.lstatSync(path.join(baseDir, config.paths[filePath])).isDirectory() ? arr.concat(readDir(config.paths[filePath], filePath)) : arr;
				}
				catch(dirErr) {
					return arr;
				}
			}
		}, []), 'path');
	};

	function getIncludeAliases(includes) {

		return includes.map(function getIncludeAlias(include) {
			return include.alias;
		})
	};

	return {
		getIncludes: getIncludes,
		getIncludeAliases: getIncludeAliases
	};
};
