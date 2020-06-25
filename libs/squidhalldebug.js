// NOTE: Strict mode is causing problems I can't track down right now. 
// TODO: Find out why this breaks things and fix.
//'use strict'; 

/**
Contains Squid Hall-specific debug code, including web-page functions.
 */

var flyCkbox = function(el) {
	SQUIDDEBUG.gravityMode(!el.checked, scene);
}

var inspctCkbox = function(el) {
	SQUIDDEBUG.inspectorMode(el.checked, scene);
}

var setupDebug = function() {
	// Wire in the SquidSpace.js debug code.
	SQUIDDEBUG.wireSquidSpace(null, null, SQUIDSPACE);

	// Add extra debugging output.
	SQUIDDEBUG.verboseMode(true);
	
}