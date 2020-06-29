// NOTE: Strict mode is causing problems I can't track down right now. 
// TODO: Find out why this breaks things and fix.
//'use strict'; 

/**
Contains Squid Hall-specific debug code, including web-page functions.
 */

var flyCkbox = function(el) {
	SQUIDDEBUG.gravityMode(!el.checked, scene);
}

var identCkbox = function(el) {
	SQUIDDEBUG.identifyMode(el.checked, scene);
	if (el.checked) {
		document.getElementById("ctrl-searchbox").style.display = "block";
	}
	else {
		document.getElementById("ctrl-searchbox").style.display = "none";
	}
}

var inspctCkbox = function(el) {
	SQUIDDEBUG.inspectorMode(el.checked, scene);
}

var setupDebugBefore = function() {
	SQUIDSPACE.logInfo("Setting up Squid Hall debug options. (This message should not appear on production versions.)");
	
	// Set log level.
	SQUIDSPACE.setLogLevel(SQS_LOG_ALL);
	
	// Wire in the SquidSpace.js debug code.
	SQUIDDEBUG.wireSquidSpace(null, null, SQUIDSPACE);
}

var setupDebugAfter = function() {
	// Add extra debugging output.
	SQUIDDEBUG.verboseMode(true);
	
	// Load the search list box.
	var sb = document.getElementById("searchbox");
	SQUIDSPACE.mapObjects(function(objName, obj) {
		sb.options[sb.options.length] = new Option(objName, objName);
		return undefined;
	});
}

var findObject = function(objName) {
	document.getElementById('mPopupBox').style.display = "none";
	document.getElementById('mCtrlPnl').style.display = "none";
	SQUIDDEBUG.labelObject(objName);
}