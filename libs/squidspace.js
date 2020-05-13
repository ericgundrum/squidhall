// NOTE: Strict mode is causing problems I can't track down right now. 
// TODO: Find out why this breaks things and fix.
//'use strict'; 


/** The squidscene module provides a runtime for a simulated
	scene. It allows you to define a 'world' and will then run
	that world as a simulation using the world's settings and 
	allowing the user to move around it in similar to how they 
	navigate through a real world. 

	In most cases the physics used are simplified, but broadly similar 
	to the real-world. However, some physics parameters may 
	be changed. For example, gravity can be increased or decreased;
	affecting how far you can jump and how fast you move.

	NOTE: This is a PoC version of the module and is intended only
	      to support the Squid Hall project. Later versions will be
	      very different than this one.

	## Some ideas for improvement

	Some options reduce CPU, but degrade the experience. One way to handle this might
	be to have a basic setting for 'low', 'medium', and 'high', where high uses every
	option and low uses the least. We could provide a way to choose the setting on the web
	page, which saves the setting to a cookie and reloads the page. The code would simply
	check the cookie on startup and use the appropriate options based on the setting.

	We need to figure out what is required to support tablets and phones and implement that.

	We need to determine if we need to support gamepads.
*/


var SquidSpace = function() {

	//
	// Defaults.
	//


	//
	// Some size variables we need for calculations.
	//
	// NOTE: Each unit corresponds to 1 meter, so 1.75 is one and three quarter meters.
	//


	// This is the SE corner of the arena and the origin for layouts. 
	var floorOriginSE = [0, 0, 0]; 
	var floorSize = [0, 0]
	// This is the offset to the north from the south for where the first elements are placed. 
	// It represents the starting point from the south wall from which every layout point is 
	// calculated.
	var startOffsetS = -32.5; 
	// This is the offset to the west from the east for where the first elements are placed.
	// It represents the starting point from the east wall from which every layout point is 
	// calculated.
	var startOffsetE = 11.2; 
	var pnlwidth = 1;
	var pnldepth = 0.005;
	var pnlSpacing = pnlwidth + 0.3;
	var tblwidth = 1.8;
	var tbldepth = 0.75;
	var tblheight = 0.05;
	var tblSpacing = tblwidth + 0.02;
	var bmWidth = 1;
	var bmSpacing = bmWidth + 10;
	var norot = 0; // Do not rotate.
	var rot = Math.PI / 2; // Rotate 90 degrees.


	//
	// Module data.
	//


	var textures = {};
	var materials = {};
	var objects = {};


	//
	// Helper functions.
	//


	var loadObject = function(objName, objData, scene, onSuccessFunc) {
		// Note: You can add this ImportMesh() argument to force a specific 
		//       loader plugin by file type. 
		let loaderPluginExtension = null;
		//let loaderPluginExtension = ".obj"; // Force obj file loader plugin.

		// File Root arg.
		let fr = "";
		if ("root" in objData) {
			fr = objData["root"];
		}

		// File Name arg.
		let fn = null;
		if ("url" in objData) {
			fn = objData["url"];
		}
		else if ("data" in objData) {
			fn = "data:" + objData["data"];
		}
		else if ("loaderfunc" in objData) {
			// TODO: Throw exception. Do we need to support loader funcs at some point? How?
		}
		else {
			// TODO: Throw exception.
		}

		let meshNameFilter = ""; // Empty string means import *all* meshes in the object.

		return BABYLON.SceneLoader.ImportMesh(meshNameFilter, fr, fn, scene, 
				function(newMeshes) {
					if (debugVerbose) console.log("'" + objName + 
						"' mesh import suceeded. Mesh count: " + newMeshes.length);
			
					for (m of newMeshes) {
						m.id = objName;
					}
			
					if (typeof onSuccessFunc == "function") onSuccessFunc(newMeshes);
				}, null,
				function(scene, message, exception) {
					console.log("== '" + objName + 
						"' mesh import failed. ==\n  Message: " + 
						message.substring(0, 64) + " ... " +  message.substring(message.length - 64) +
						"\n  Exception: " + exception);
				}, 
		loaderPluginExtension); 
	}


	/* I want to add this for debugVerbose mode, but it isn't working and I don't have time to figure it out.
	var showWorldAxis = function showWorldAxis(size, scene) {
	    var makeTextPlane = function(text, color, size) {
	        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
	        dynamicTexture.hasAlpha = true;
	        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
	        var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
	        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
	        plane.material.backFaceCulling = false;
	        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
	        plane.material.diffuseTexture = dynamicTexture;
	    return plane;
	     };
	    var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
	      BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
	      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
	      ], scene);
	    axisX.color = new BABYLON.Color3(1, 0, 0);
	    var xChar = makeTextPlane("X", "red", size / 10);
	    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
	    var axisY = BABYLON.Mesh.CreateLines("axisY", [
	        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
	        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
	        ], scene);
	    axisY.color = new BABYLON.Color3(0, 1, 0);
	    var yChar = makeTextPlane("Y", "green", size / 10);
	    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
	    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
	        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
	        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
	        ], scene);
	    axisZ.color = new BABYLON.Color3(0, 0, 1);
	    var zChar = makeTextPlane("Z", "blue", size / 10);
	    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
	};
	*/


	//
	// Layout helper functions.
	//
	

	var makeLayoutXYZ = function(x, y, z, w, d) {
		// TODO: This function was created because I don't understand how Babylon
		//       does local vectors and was under time pressure, so couldn't do the
		//       research. At some point we need to use the BJS code instead, but could
		//       just insert it here without breaking dependent code.
		// IMPORTANT! The origin specifies the point the floor starts from at the NW corner of
		// the arena. All layout offsets are calculated from that point!

		return [
			floorOriginSE[0] + x + startOffsetE + (w / 2), 
			floorOriginSE[1] + y, 
			floorOriginSE[2] + (z * -1) + startOffsetS - (d / 2)
		];
	}


	var makeLayoutVector = function(x, y, z, w, d) {
		// TODO: This function was created because I don't understand how Babylon
		//       does local vectors and was under time pressure, so couldn't do the
		//       research. At some point we need to use the BJS code instead, but could
		//       just insert it here without breaking dependent code.
		// IMPORTANT! The origin specifies the point the floor starts from at the NW corner of
		// the arena. All layout offsets are calculated from that point!

		return new BABYLON.Vector3(
			floorOriginSE[0] + x + startOffsetE + (w / 2), 
			floorOriginSE[1] + y, 
			floorOriginSE[2] + (z * -1) + startOffsetS - (d / 2)
		);
	}

	
	var addSingleInstanceToLayout  = function(instanceName, layout, count, x, z, 
											offset, rotation) {
		layout.push([instanceName, x, z, rotation]);
	}
	
	
	/** Adds a count series of layout elements to an existing layout, starting
		at the the provided x and z and separated by the provided offset. If across
		is true the elements start at the west and go east. Otherwise the elements
		start at the south and go north. The passed rotation is used for all elements
		in the series.
	*/
	var addLinearSeriesToLayout = function(seriesName, layout, count, x, z, offset,
											across, rotation) {
		for (let i = 0;i < count;i++) {
			layout.push([seriesName + i, x, z, rotation])
			if (across) {
				x += offset;
			}
			else {
				z += offset;
			}
		}
	}


	var addRectangleSeriesToLayout = function(seriesName, layout, countWide, countDeep,
												x, z, lengthOffset, widthOffset) {
		// Calculate starting positions.
		let wx = x - widthOffset;
		let bz = z + (countDeep * lengthOffset) - widthOffset;
		let rx = x - (countWide * lengthOffset);

		// Do width layout.
		for (let i = 0;i < countWide;i++) {
			addLinearSeriesToLayout(seriesName + "top-", layout, countWide, wx, z,
							lengthOffset, true, norot);
			addLinearSeriesToLayout(seriesName + "bottom-", layout, countWide, wx, bz,
							lengthOffset, true, norot);
		}

		// Do depth layout.
		for (let i = 0;i< countDeep;i++) {
			addLinearSeriesToLayout(seriesName + "left-", layout, countDeep, x + widthOffset, bz - widthOffset,
							lengthOffset, false, rot);
			addLinearSeriesToLayout(seriesName + "right-", layout, countDeep, rx, bz - widthOffset,
							lengthOffset, false, rot);
		}
	}

	
	var layoutObjects = function(objName, layout, material, scene) {
		// Get the object.
		let obj = objects[objName];
		if (typeof obj != "object") throw `Invalid object reference: ''${objName}''.`;
		
		// Get the meshes.
		let meshes = objects[objName];
		if ((typeof meshes != "object") && !(meshes instanceof Array) && (meshes.length < 1))
			 throw `Mesh not loaded for object reference: ''${objName}''.`;
		
		for (mesh of meshes) {
			for (instance of layout) {
				let m = mesh.createInstance(instance[0]);
				pnl.position = makeLayoutVector(instance[1], 0.01, instance[2], pnlwidth, pnldepth);
				if (layout[3] != 0) {
					pnl.rotate(BABYLON.Axis.Y, instance[3]);
					pnl.position.z -= (pnlwidth / 2);
				}
				pnl.checkCollisions = true;
			}
		}
	}

	//
	// Object functions.
	//


	var addFloor = function (x, y, z, w, d, material, scene) {
		// NOTE: This makes the floor origin/size and the layout-based origin/size the same 
		//       so long as both use the same origin and size.
		// IMPORTANT! This function *must* be called before doing any layouts. 

		// Override global origin and size because everything else will calculate from that.
		// IMPORTANT! The origin specifies the point the floor starts from at the NW corner of
		// the arena. All layout offsets are calculated from that point!
		floorOriginSE = [x, y, z]; 
		floorSize = [w, d]; 

		// Calculate offsets.
		x = x + (w / 2);
		z = z - (d / 2);

		// Make the floor.
		let floor = BABYLON.Mesh.CreateGround('floor', w, d, 2, scene);
		floor.position = new BABYLON.Vector3(x, y, z);
	    floor.material = material;
	    //floor.receiveShadows = true; // This seems to increase the CPU requirements by quite a bit.

		return floor;
	}


	var addFloorSection = function(secName, x, z, width, depth, material, scene) {
		// TODO: Support width and depth.
		var floorSection = BABYLON.MeshBuilder.CreatePlane(secName, {width: width, size:depth, tileSize:1}, scene);
		floorSection.position = new makeLayoutVector(x, 0.001, z, width, depth);
		floorSection.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
	    floorSection.material = material;
		floorSection.material.backFaceCulling = false;
		return floorSection;
	}


	var addPanels = function(panelLayouts, scene) {
		let data = world.panel();
		let panel = loadObject("panel", data, scene, function(newMeshes) {
			for (index = 0; index < newMeshes.length; index++) {

				let panelmesh = newMeshes[index];
				panelmesh.isVisible = false;

				for (layout of panelLayouts) {
					let pnl = panelmesh.createInstance(layout[0]);
					pnl.position = makeLayoutVector(layout[1], 0.01, layout[2], pnlwidth, pnldepth);
					if (layout[3] != 0) {
						pnl.rotate(BABYLON.Axis.Y, layout[3]);
						pnl.position.z -= (pnlwidth / 2);
					}
					pnl.checkCollisions = true;
				}
			}
		}); 
	}


	var addBeams = function(scene) {
		let data = world.beam();
		var beam = loadObject("beam", data, scene, function(newMeshes) {
			for (var index = 0; index < newMeshes.length; index++) {
				for (var index = 0; index < newMeshes.length; index++) {

					var beammesh = newMeshes[index];
					beammesh.isVisible = false;

					for (var i = 0; i < 9; i++ ) {
						var bm = beammesh.createInstance("beam" + i);
						bm.position.x = 0;
						bm.position.y = 0;
						bm.position.z = -1 * i * 8.3;
						bm.checkCollisions = false;
					}
				}
			}
		}); 
	}

	var addCurtains = function(scene) {
		let data = world.curtain();
		let curtain = loadObject("curtain", data, scene, function(newMeshes) {
			for (index = 0; index < newMeshes.length; index++) {

				let curtainmesh = newMeshes[index];
				curtainmesh.isVisible = false;

				for (let i = 0; i < 7; i++ ) {
					let bm = curtainmesh.createInstance("curtain1" + i);
					bm.position.x = 0;
					bm.position.y = 0;
					bm.position.z = -1 * i * 10;
					bm.checkCollisions = false;
				}

				for (let i = 0; i < 7; i++ ) {
					let bm = curtainmesh.createInstance("curtain2" + i);
					bm.rotation.y = Math.PI;
					bm.position.x = 38;
					bm.position.y = 0;
					bm.position.z = -1 * i * 10 - 10;
					bm.checkCollisions = false;
				}

				for (let i = 0; i < 4; i++ ) {
					let bm = curtainmesh.createInstance("curtain3" + i);
					bm.rotation.y = -1 * Math.PI / 2;
					bm.position.x = i * 10;
					bm.position.y = 0;
					bm.position.z = -64;
					bm.checkCollisions = false;
				}

			}
		});
	}


	var addTables = function(tblLayouts, material, scene) {
		// TODO: Currently using a box for the table, we may want to 
		//       replace that with a mesh, like the panels.
		for (layout of tblLayouts) {
			//var table = BABYLON.MeshBuilder.CreatePlane(layout[0], {width: 2, size:1, tileSize:1}, scene);
			var table = BABYLON.MeshBuilder.CreateBox(layout[0],
											{width: tblwidth, depth:tbldepth, height:tblheight}, scene);
			table.position = new BABYLON.Vector3(layout[1], 1.25, layout[2]);
			//table.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
		    table.material = material;
			table.material.backFaceCulling = false;
			if (layout[3] != 0) {
				table.rotate(BABYLON.Axis.Y, layout[3]);
			}
			table.checkCollisions = true;
		}
	}



	return {
		/** PoC-specific function to add Babylon.js built-ins and do other setup. */
		prepareWorld: function(scene, debugVerbose, debugLayer) {
			// TODO: Figure out how to move this stuff into world spec.
		
		
			if (debugVerbose) {
				// Log plugin activations.
				BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
				    console.log(`Plugin Activated: ${plugin.name}`);
				});
			}
		
			// Turn on optimizaton.
			var options = new BABYLON.SceneOptimizerOptions();
			options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1));
			/* Set Degredation Level - TODO: Come up with a way to make this user settable.
			BABYLON.SceneOptimizerOptions.LowDegradationAllowed()  
			BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed()  
			BABYLON.SceneOptimizerOptions.HighDegradationAllowed() 
			*/
			options.addOptimization(new BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed());
			var optimizer = new BABYLON.SceneOptimizer(scene, options);
			optimizer.targetFrameRate = 40 // TODO: Come up with a way to make this user settable.
			if (debugVerbose) {
				console.log(`Optimizer target framerate: ${optimizer.targetFrameRate}`)
				optimizer.onSuccessObservable = new function() {
					console.log("Optimizer 'success'.")
				}
				optimizer.onNewOptimizationAppliedObservable = new function() {
					console.log("New optimization applied.")
				}
				optimizer.onFailureObservable = new function() {
					console.log(`Optimizer unable to reach target framerate: ${optimizer.targetFrameRate}`)
				}
			}
			//optimizer.start(); // Don't need?

			// TODO: Make this dynamic somehow.
			if (debugLayer) scene.debugLayer.show();
		
			// Add some materials we'll be using.
			// TODO: Determine if we want to use ambient or diffuse textures. Currently using
			//       ambient on marble and diffuse on macadam. See:
			// * https://gamedev.stackexchange.com/questions/14334/the-difference-between-diffuse-texture-and-ambient-occlusion-texture
			// * https://www.quora.com/What-is-the-difference-between-Ambient-Diffuse-and-Specular-Light-in-OpenGL-Figures-for-illustration-are-encouraged?share=1
		    materials.macadam = new BABYLON.StandardMaterial("macadam", scene);
		    textures.macadam = new BABYLON.RoadProceduralTexture("macadamtext", 2048, scene);
			materials.macadam.backFaceCulling = false;
		    materials.macadam.diffuseTexture = textures.macadam;
		    materials.marble = new BABYLON.StandardMaterial("marble", scene);
		    textures.marble = new BABYLON.MarbleProceduralTexture("marbletext", 512, scene);
		    materials.marble.ambientTexture = textures.marble;
		    //materials.marble.numberOfBricksHeight = 1; // Doesn't seem to do anything?
		    //materials.marble.numberOfBricksWidth = 1; // Doesn't seem to do anything?
		    materials.wood = new BABYLON.StandardMaterial("wood", scene);
		    textures.wood = new BABYLON.WoodProceduralTexture("woodtext", 1048, scene);
			textures.wood.ampScale = 256; // TODO: Experiment with this, read docs again.
			textures.wood.woodColor = new BABYLON.Color3(0.8, 0.8, 0.8);
			materials.wood.backFaceCulling = false;
		    materials.wood.diffuseTexture = textures.wood;
		
		},
	
		/** PoC-specific function to load the passed scene from the world 
		    and content specs. 
		*/
		buildWorld: function(worldSpec, contentSpecs, scene, debugVerbose) {
			// Assume success.
			let success = true;
		 
			// Verify inputs.
			// TODO: Add other validation checks, such as object
			//       member validation.
			if (typeof debugVerbose === "undefined") {
				// Default to true.
				debugVerbose = false;
			}
			if (typeof worldSpec != "object") {
				// World spec is required.
				success = false;
			}
			if ((typeof contentSpecs != "object") && !(contentSpecs instanceof Array)) {
				// Default to empty list.
				contentSpecs = [];
			}
			if (typeof scene != "object") {
				// Scene is required.
				success = false;
			}
		
			// Are we OK to continue?
			if (!success) {
				return success;
			}
		
			// Create world from spec.
		
			// Load arena.
			let arenaData = world.arena();
			objects.arena = loadObject("arena", arenaData, scene);

			addBeams(scene);
			addCurtains(scene);

			// Load squid.
			let squidData = world.squid();
			let squid = loadObject("squid", squidData, scene, function(newMeshes) {
				if (newMeshes.length > 0) {
					var squidmesh = newMeshes[0];
					squidmesh.position.x = 4;
					squidmesh.position.y = 10;
					squidmesh.position.z = -60;
				}
			});

			// Add a floor.
			// TODO: Specify floor in world file.
			objects.floor = addFloor(0.5, 0, 7.5, 57, 83, materials.macadam, scene);

			// Add floor sections.
			// TODO: Use layouts pattern for these, see if we can reduce meshes.
			addFloorSection("exhibits", 18, 8, 15, 25, materials.marble, scene);
			addFloorSection("artshow", 0, 0, 15, 17, materials.marble, scene);
			addFloorSection("dealerleft", 4, 35, 10, 10, materials.marble, scene);
			addFloorSection("dealerright", 20, 35, 10, 10, materials.marble, scene);

			// Create panel layouts.
			let panelLayouts = [];

			addLinearSeriesToLayout("testh", panelLayouts, 4, 1, 1, pnlSpacing, true, norot);
			addLinearSeriesToLayout("testh", panelLayouts, 4, 8, 1, pnlSpacing, false, rot);

			/* TODO: Recalcuate.
			// Art Show.
			let nm = "artshowpnl-";
			let arx1 = 0;
			let arz1 = 20;
			let arz2 = arz1 + 4;
			addLinearSeriesToLayout(nm + "1-", panelLayouts, 8, arx1, arz1, pnlSpacing, true, norot);
			addLinearSeriesToLayout(nm + "2-", panelLayouts, 8, arx1, arz2, pnlSpacing, true, norot);
			addLinearSeriesToLayout(nm + "3-", panelLayouts, 2, arx1, arz1, pnlSpacing, false, rot);
			addLinearSeriesToLayout(nm + "4-", panelLayouts, 2, arx1, arz2, pnlSpacing, false, rot);
			addLinearSeriesToLayout(nm + "5-", panelLayouts, 2, arx1 - (pnlSpacing * 2), arz1, pnlSpacing, false, rot);
			addLinearSeriesToLayout(nm + "6-", panelLayouts, 2, arx1 - (pnlSpacing * 2), arz2, pnlSpacing, false, rot);
			addLinearSeriesToLayout(nm + "7-", panelLayouts, 2, arx1 - (pnlSpacing * 4), arz1, pnlSpacing, false, rot);
			addLinearSeriesToLayout(nm + "8-", panelLayouts, 2, arx1 - (pnlSpacing * 4), arz2, pnlSpacing, false, rot);
			addLinearSeriesToLayout(nm + "9-", panelLayouts, 2, arx1 - (pnlSpacing * 6), arz1, pnlSpacing, false, rot);
			addLinearSeriesToLayout(nm + "10-", panelLayouts, 2, arx1 - (pnlSpacing * 6), arz2, pnlSpacing, false, rot);
			addLinearSeriesToLayout(nm + "11-", panelLayouts, 2, arx1 - (pnlSpacing * 8), arz1, pnlSpacing, false, rot);
			addLinearSeriesToLayout(nm + "12-", panelLayouts, 2, arx1 - (pnlSpacing * 8), arz2, pnlSpacing, false, rot);

			// History.
			nm = "historypnl-";
			let hix1 = 15;
			let hiz1 = arz2;
			let hix2 = hix1 - 4;
			let hiz2 = hiz1 + 3.5;
			addLinearSeriesToLayout(nm + "1-", panelLayouts, 3, hix1, hiz1, pnlSpacing, true, norot);
			addLinearSeriesToLayout(nm + "2-", panelLayouts, 6, hix2, hiz2, pnlSpacing, true, norot);
			addLinearSeriesToLayout(nm + "3-", panelLayouts, 1, hix2 - (pnlSpacing * 3), hiz2 - pnlSpacing, pnlSpacing, false, rot);

			// Hugos.
			nm = "hugospnl-";
			let hux = hix1;
			let huz = arz1 - 2;
			addLinearSeriesToLayout(nm, panelLayouts, 8, hux, huz, pnlSpacing, true, norot);

			// New Zealand Genre.
			nm = "nzgenrepnl-";
			let nzx = hix2 - (pnlSpacing * 2);
			let nzz = -39;
			addLinearSeriesToLayout(nm, panelLayouts, 3, nzx, nzz, pnlSpacing, true, norot);
			*/

			// Load panels with the layout.
			addPanels(panelLayouts, scene)

			// TODO: Add images to panels with CreateDecal().

			/* TODO: Recalcuate.
			// Create table layouts.
			let tableLayouts = []

			// Art Show Tables
			nm = "artshowtbl-";
			arx1 = 23;
			let arx2 = 28.5;
			arz1 = -65;
			arz2 = arz1 + 3;
			addLinearSeriesToLayout(nm + "1-", tableLayouts, 3, arx1, arz1, tblSpacing, true, norot);
			addLinearSeriesToLayout(nm + "2-", tableLayouts, 1, arx1 - (tblSpacing * 3) + tbldepth, arz1 - tbldepth, pnlSpacing, false, rot);
			addLinearSeriesToLayout(nm + "3-", tableLayouts, 5, arx2, arz2, tblSpacing, true, norot);

			// Fan Tables
			let ftx = 15;
			let ftz = arz1;
			nm = "fantbl-";
			addLinearSeriesToLayout(nm + "1-", tableLayouts, 8, ftx, ftz, tblSpacing, true, norot);
			addLinearSeriesToLayout(nm + "2-", tableLayouts, 6, ftx - tblSpacing, ftz + 3, pnlSpacing, true, norot);

			// Dealer Tables
			nm = "dealer-chatham-";
			addRectangleSeriesToLayout(nm, tableLayouts, 5, 3, 38.5, -39, tblSpacing, tbldepth);
			nm = "dealer-north-";
			addRectangleSeriesToLayout(nm, tableLayouts, 5, 3, 24.5, -39, tblSpacing, tbldepth);

			// Load tables with the layout.
			addTables(tableLayouts, materials.wood, scene);
			*/

			// Add a camera to the scene and attach it to the canvas
			// TODO: Specify camera in world file.
			// TODO: Support switching to VirtualJoysticksCamera if running on a tablet or phone.
			// See https://doc.babylonjs.com/babylon101/cameras#virtual-joysticks-camera
			let camera = new BABYLON.UniversalCamera("default camera", new BABYLON.Vector3(45, 1.6, -20), scene);
			//var camera = new BABYLON.FreeCamera("default camera", new BABYLON.Vector3(0, 5, -10), scene);
			//var camera = new BABYLON.FlyCamera("default camera", new BABYLON.Vector3(0, 5, -10), scene);
			camera.setTarget(new BABYLON.Vector3(20, 1.6, -60));
			camera.attachControl(canvas, true);

			//
			// Enable walking.
			// TODO: Specify the options in world file, add support code to squidspace.js
			//

			// Set the ellipsoid around the camera for collision detection.
			// TODO: Experiment with ellipsoid to find best.
			// NOTE: ellipsoid values are carefully chosen to reduce image tearing when
			//       up close to objects, while still allowing you to navigate around without
			//       getting stuck between things. However, this does mean you can't get really
			//       close to anything straight in front of you.
			camera.ellipsoid = new BABYLON.Vector3(1.7, 1, 0.3);

			// WASD movement.
		    camera.keysUp.push(87);    //W
		    camera.keysDown.push(83)   //D
		    camera.keysLeft.push(65);  //A
		    camera.keysRight.push(68); //S

			// Support gamepad.
			//camera.inputs.add(new BABYLON.FreeCameraGamepadInput());
			//camera.inputs.attached.gamepad.gamepadAngularSensibility = 250;

			// Other camera settings.
			camera.fov = 1.3;
			if (!debugVerbose) {
				camera.speed = 0.55; // Lower values slow movement down.
			    //camera.inertia = 0.2; // Lower values slow movement down, but also affect turning.
				camera.inertia = 0.4;
				//camera.inertia = 0.6;
				showWorldAxis(10)
			}

			// Set gravity for the scene (G force on Y-axis)
			// See https://doc.babylonjs.com/babylon101/cameras,_mesh_collisions_and_gravity
			// TODO: Determine best settings here.
			if (debugVerbose) {
				// Allow user to fly.
				scene.gravity = new BABYLON.Vector3(0, 0, 0); 
			}
			else {
				// User walks on ground.
				scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
			}


			// Enable Collisions for scene.
			scene.collisionsEnabled = true;

			// Apply collisions and gravity to the active camera
			camera.checkCollisions = true;
			camera.applyGravity = true;

			// Set collision detection on anything we haven't already done.
			objects.floor.checkCollisions = true;
			objects.arena.collisionsEnabled = true; // Doesn't seem to be working.
			objects.arena.checkCollisions = true; // Doesn't seem to be working.

			//
			// Lights
			//

			let gl = new BABYLON.GlowLayer("glow", scene, {});
			gl.intensity = 1.0;

			let lightFrontFill = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(25, 20, 70), scene);
			lightFrontFill.diffuse = new BABYLON.Color3(0.3, 0.3, 0.2);
			lightFrontFill.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
			lightFrontFill.range = 150;

			let lightTopFill = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(25, 230, 70), scene);
			lightTopFill.diffuse = new BABYLON.Color3(1, 1, 1);
			lightTopFill.specular = new BABYLON.Color3(0.8, 0.8, 0.8);
			lightTopFill.range = 300;


			let light1 = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(40, 9, -50), new BABYLON.Vector3(0, -70, 0), Math.PI / 5, 1, scene);
			light1.diffuse = new BABYLON.Color3(0, 1, 0);
			light1.specular = new BABYLON.Color3(0, 1, 0);
			light1.range = 40;

			let light2 = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(20, 9, -50), new BABYLON.Vector3(0, -70, 0), Math.PI / 3, 1, scene);
			light2.diffuse = new BABYLON.Color3(0, 0.7, 0.7);
			light2.specular = new BABYLON.Color3(0.7, 0.7, 0.7);
			light2.range = 40;

			//var light = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
		
			// Done.
			return success;
		}
	}
}();
