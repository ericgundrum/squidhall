
var SQUIDCOMMON = function() {
	
	var attachPlacerHooks = function(squidSpace){
		SQUIDSPACE.attachPlacerHook("hookname",
			function(areaName, areaOrigin, config, placeName, data, objName, meshes, scene) {
				
				squidSpace.logDebug(`hookname called! ${areaName}, ${areaOrigin}, ${config}, ${placeName}, ${data}`);
			// function body.
	    });
	};
	
	var attachLoaderHooks = function(squidSpace){
		SQUIDSPACE.attachLoaderHook("BasicRoom",
			function(objName, options, data, scene) {
				
				squidSpace.logDebug(`BasicRoom called! ${areaName}, ${areaOrigin}, ${config}, ${placeName}, ${data}`);
				
				// Get options.
				
				// Get data.
				let size = [4, 2.5, 6];
				if (data["size"]) {
					size = data["size"];
				}
				let floorMat = undefined;
				if (data["floor-material"]) {
					floorMat = data["floor-material"];
				}
				let wallMat = undefined;
				if (data["wall-material"]) {
					wallMat = data["wall-material"];
				}
				let ceilingMat = undefined;
				if (data["ceiling-material"]) {
					ceilingMat = data["ceiling-material"];
				}
				
	    });
	};
	
	return {
		wireSquidSpace: function(options, data, squidSpace) {
			//attachPlacerHooks(squidSpace);
			//attachLoaderHooks(squidSpace);
		}
	}
}();