/**
 * Module dependencies.
 */
var fs = require('fs'),
	path = require('path');

// Fixtures are private
var _fixtures = {};

/**
 * Fixtures constructor.
 */
function Fixtures () {

	var fixtures = {},
		fpath = _findPath();

	if ( !fpath ) throw new Error('fixtures path not found');

	var files = fs.readdirSync(fpath);

	files.forEach( function (file) {
		var isJSON = _endsWith(file, '.json'),
			isJS = _endsWith(file, '.js')
			fname = (isJSON) ? _trunc(file, 5) :
					(isJS) ? _trunc(file, 3) : null;
		if (fname) {
			fixtures[fname] = JSON.parse( fs.readFileSync( path.join(fpath, file), 'utf8') );
		}
	});

	_fixtures = fixtures;
	this.reset();
};

/**
 * Reset all the fixtures from the source.
 * It is commonly used on setup when the fixtures has been modified.
 */
Fixtures.prototype.reset = function () {
	var fixtures = _clone(_fixtures);
	for ( var i in fixtures ) {
		if ( fixtures.hasOwnProperty(i) ) {
			this[i]= fixtures[i];
		}
	};
};

/**
 * Deep clone of Object
 *
 * @param {Object} param
 * @return {Object}
 * @api private
 */
function _clone (param) {

	var result;

	if (typeof param === 'undefined')
		return undefined;
	else if (param instanceof Array)
		result = [];
	else if (typeof param === 'object' && param != null)
		result = {};
	else
		return param;

	for (var i in param) {
		result[i] = _clone(param[i]);
	}

	return result;
};

/**
 * Truncate the end of given string by N
 *
 * @param {String} str the string to truncate
 * @param {String} n number of chars to remove
 * @return {String} result
 * @api private
 */
function _trunc(str, n) {
	return str.substr(0, str.length - n);
}

/**
 * Check whether the string ends with a given sub-string
 *
 * @param {String} str the string to check
 * @param {String} a the sub-string to find
 * @return {Boolean} true/false
 * @api private
 */
function _endsWith(str, a) {
	if (a.constructor.name === "RegExp") {
		a = escape(a);
		str = escape(str);
	} else {
		a = a.toString().replace(/(^\/)|(\/$)/g, "");
	}
	return eval("/" + a + "$/.test(str)");
}

/**
 * Find the path where the fixtures are located
 *
 * @return {String}
 * @api private
 */
function _findPath () {
	// Remove the startup filename
	var dirpath = path.join( module.parent.filename, '..'),
		dirname = path.basename(dirpath),
		fpath;

	if (fs.existsSync(path.join(dirpath, 'test'))) {
		dirpath = path.join(dirpath, 'test');
		dirname = 'test';
	} else {
		// TODO exit strategy can be improved.
		while( dirname !== 'test' && dirname !=='' ) {
			dirpath = path.join( dirpath, '..');
			dirname = path.basename(dirpath);
		}
	}

	if ( dirname === 'test' ) {
		fpath = path.join( dirpath, 'fixtures');
		if ( fs.existsSync( fpath ) ) {
			return fpath;
		}
	}
};

module.exports = new Fixtures();

