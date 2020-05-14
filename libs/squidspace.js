// NOTE: Strict mode is causing problems I can't track down right now. 
// TODO: Find out why this breaks things and fix.
//'use strict'; 


/** The SquidSpace module provides a runtime for a simulated
	scene. It allows you to define a 'world' and will then run
	that world as a simulation using the world's settings and 
	allowing the user to move around it in similar to how they 
	navigate through a real world. 

	In most cases the physics used are simplified, but broadly similar 
	to the real-world. However, some physics parameters may 
	be changed. For example, gravity can be increased or decreased;
	affecting how far you can jump and how fast you move.

	NOTE: This is a PoC version of the module and is intended only
	      to support the Squid Hall project. Later versions may be
	      very different than this one.

	## Some ideas for improvement

	Some options reduce CPU, but degrade the experience. One way to handle this might
	be to have a basic setting for 'low', 'medium', and 'high', where high uses every
	option and low uses the least. We could provide a way to choose the setting on the web
	page, which saves the setting to a cookie and reloads the page. The code would simply
	check the cookie on startup and use the appropriate options based on the setting.

	We need to figure out what is required to support tablets and phones and implement that.

	We need to determine if we want to support gamepads.
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

	// Debug modes.
	var debugCamera = false;

	// This is the NW corner of the arena and the origin for layouts. 
	var floorOriginNW = [0, 0, 0]; 
	var floorSize = [0, 0];

	// TODO: Move these values into the pack file data.
	var pnlwidth = 1;
	var pnldepth = 0.005;
	var pnlSpacing = pnlwidth + 0.3;
	var tblwidth = 1.8;
	var tbldepth = 0.75;
	var tblheight = 0.05;
	var tblSpacing = tblwidth + 0.02;
	var bmWidth = 1;
	var bmSpacing = bmWidth + 10;

	// TODO: Determine if these belong in the pack file data.
	var norot = 0; // Do not rotate.
	var rot = Math.PI / 2; // Rotate 90 degrees.


	//
	// Module data.
	//


	var textures = {};
	var materials = {};
	var objects = {};

	var placerHooks = {};

	//
	// Helper functions.
	//

	var getValIfKeyInDict = function(key, dict, defaultVal) {
		if ((dict != undefined) && (typeof dict === "object")) {
			if (key in dict) {
				return dict[key];
			}
		}
		
		return defaultVal;
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
	// Object spec loader.
	//
	
	var objectSpecLoader = function(objDict, scene, onSuccessFunc) {
		for (key in objDict) {
			// Assume failure.
			let success = false;
			
			let obj = undefined;
			let config = undefined;
			let visible = false;
			if (typeof objDict[key]["config"] === "object") {
				config = objDict[key]["config"];
				visible = getValIfKeyInDict("space-object", config, false);
			}
			let builtin = getValIfKeyInDict("builtin", objDict[key], false);
			
			if (builtin) {
				if (typeof objDict[key]["data"] === "object") {
					let data = objDict[key]["data"];
					let tp = getValIfKeyInDict("type", data, "");
					let sz = getValIfKeyInDict("size", data, [1, 1]);
					let pos = getValIfKeyInDict("position", data, [0, 0, 0]);
					let mn = getValIfKeyInDict("material", data, "");
					// TODO: Get material from material list by material name
					//       with a default if not loaded.
					// TODO: Refactor this into a function
					if (tp === "floor") {
						obj = addFloor(pos[0], pos[1], pos[2], sz[0], sz[1], 
										materials.macadam, scene);
						success = true;
					}
					else if (tp === "floorSection") {
						obj = addFloorSection(key, pos[0], pos[2], sz[0], sz[1], 
											materials.marble, scene);
						//addFloorSection("hugos", 15, 15, 10, 15, materials.marble, scene);
						success = true;
					}
					else if (tp === "usercamera") {
						let targetPos = getValIfKeyInDict("target-position", data, [20, 1.6, 20]);
						obj = addCamera(pos[0], pos[1], pos[2], 
										targetPos[0], targetPos[1], targetPos[2], scene);
						//addFloorSection("hugos", 15, 15, 10, 15, materials.marble, scene);
						success = true;
					}
				}
				else {
					// TODO: Throw Error.
					Console.log("Builtin without data section.")
				}
			}
			else {
				obj = SquidSpace.loadObject(key, objDict[key], scene, function(newMeshes) {
					// Process each mesh.
					for (mesh of newMeshes) {
						if (visible) {
							mesh.isVisible = true;
							mesh.checkCollisions = true;
						}
						else {
							mesh.isVisible = false;
						}
					}
				
					if (typeof onSuccessFunc == "function") onSuccessFunc(newMeshes);
				
					// We are good to go!
					success = true;
				});
			}
			
			if (success && obj !== undefined) {
				// Append the config?
				if (typeof config === "object") {
					obj["config"] = config;
				}
			}			
		}
	}
	
	//
	// Object Builtins.
	//
	// TODO: See if any of these can be moved to hooks.
	//

	var addFloor = function (x, y, z, w, d, material, scene) {
		// NOTE: This makes the floor origin/size and the layout-based origin/size the same 
		//       so long as both use the same origin and size.
		// IMPORTANT! This function *must* be called before doing any layouts. 

		// Override global origin and size because everything else will calculate from that.
		// IMPORTANT! The origin specifies the point the floor starts from at the NW corner of
		// the arena. All layout offsets are calculated from that point!
		floorOriginNW = [x, y, z]; 
		floorSize = [w, d]; 

		// Calculate offsets.
		x = x + (w / 2);
		z = z - (d / 2);

		// Make the floor.
		let floor = BABYLON.Mesh.CreateGround('floor', w, d, 2, scene);
		floor.position = new BABYLON.Vector3(x, y, z);
	    floor.material = material;
	    //floor.receiveShadows = true; // This seems to increase the CPU requirements by quite a bit.
		floor.checkCollisions = true;

		return floor;
	}


	var addFloorSection = function(secName, x, z, w, d, material, scene) {
		var floorSection = BABYLON.MeshBuilder.CreatePlane(secName, 
												{width: w, height:d}, scene);
		floorSection.position = new SquidSpace.makeLayoutVector(x, 0.001, z, w, d);
		floorSection.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
	    floorSection.material = material;
		floorSection.material.backFaceCulling = false;
		return floorSection;
	}
	
	
	var addCamera = function(x, y, z, targetX, targetY, targetZ, scene) {

		// Add a camera to the scene and attach it to the canvas
		// TODO: Specify camera in world file.
		// TODO: Support switching to VirtualJoysticksCamera if running on a tablet or phone.
		// See https://doc.babylonjs.com/babylon101/cameras#virtual-joysticks-camera
		let camera = new BABYLON.UniversalCamera("usercamera", 
												SquidSpace.makePointVector(x, y, x), scene);
		//var camera = new BABYLON.FreeCamera("default camera", new BABYLON.Vector3(0, 5, -10), scene);
		//var camera = new BABYLON.FlyCamera("default camera", new BABYLON.Vector3(0, 5, -10), scene);
		camera.setTarget(new SquidSpace.makePointVector(targetX, targetY, targetZ));
		camera.attachControl(canvas, true);

		//
		// Enable walking.
		// TODO: Specify the options in world file, add support code to squidspace.js
		//

		// Set the ellipsoid around the camera for collision detection.
		// TODO: Experiment with values to find best.
		// TODO: Consider making pack file settable.
		// NOTE: ellipsoid values must be carefully chosen to reduce image tearing when
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

		// Apply collisions and gravity to the active camera
		camera.checkCollisions = true;
		camera.applyGravity = true;

		// Other camera settings.
		// TODO: Experiment with values to find best.
		// TODO: Consider making pack file settable.
		camera.fov = 1.3;
		if (!debugCamera) {
			camera.speed = 0.55; // Lower values slow movement down.
		    //camera.inertia = 0.2; // Lower values slow movement down, but also affect turning.
			camera.inertia = 0.4;
			//camera.inertia = 0.6;
		}
		
		return camera;
	}
	
	
	// TODO: Spec loaders for materials, lights, etc.
	
	// TODO: Builtins for materials, lights, etc.
	

	//
	// Layout spec loader.
	//

	var layoutSpecLoader = function(layoutsList, scene) {
		for (layout of layoutsList) {
			let areaName = getValIfKeyInDict("area", layout, "");
			let areaOrigin = getValIfKeyInDict("origin", layout, [0,0,0]);
			let config = undefined;
			if (typeof layout["config"] === "object") {
				config = layout["config"];
			}
			
			for (placement of layout["object-placements"]) {
				let placerName =  getValIfKeyInDict("name", placement, "");
				let placer = getValIfKeyInDict("placer", placement, "");
				let objName = getValIfKeyInDict("object", placement, "");
				let data = getValIfKeyInDict("data", placement, {});
				
				// Get meshes.
				if (objName in objects || objName === "_none_") {
					
					// Is the placer hooked?
					if (placer in placerHooks) {
						// Try to get the meshes.
						let meshes = SquidSpace.getLoadedObjectMeshes(objName);
						// TODO: Wrap with try/catch.
						placerHooks[placer](areaName, areaOrigin, config, 
											placerName, meshes, data);
					}
					else if (placerName == "linear-series") {
						// TODO: Implement with placeObjects().
					}
					else if (placerName == "rectangle-series") {
						// TODO: Implement with placeObjects().
					}
					else if (placerName == "single") {
						// TODO: Implement with placeObjects().
					}
					else {
						// TODO: Throw exception.
					}
				}
				else {
					// TODO: Throw exception or otherwise handle. (Log?)
				}					
			}
			
		}
	}
	
	
	//
	// Layout Placers.
	//
	
	// TODO: Implement.

	
	return {
		//
		// Public helper functions.
		//
		
		makeLayoutXYZ: function(x, y, z, w, d) {
			// TODO: This function was created because I don't understand how Babylon
			//       does local vectors and was under time pressure, so couldn't do the
			//       research. At some point we need to use the BJS code instead, but could
			//       just insert it here without breaking dependent code.
			// IMPORTANT! The origin specifies the point the floor starts from at the NW corner of
			// the arena. All layout offsets are calculated from that point!

			return [
				floorOriginNW[0] + x + (w / 2), 
				floorOriginNW[1] + y, 
				floorOriginNW[2] + (z * -1) - (d / 2)
			];
		},


		makePointVector: function(x, y, z) {
			// TODO: This function was created because I don't understand how Babylon
			//       does local vectors and was under time pressure, so couldn't do the
			//       research. At some point we need to use the BJS code instead, but could
			//       just insert it here without breaking dependent code.
			// IMPORTANT! The origin specifies the point the floor starts from at the NW corner of
			// the arena. All layout offsets are calculated from that point!

			return new BABYLON.Vector3(
				floorOriginNW[0] + x, 
				floorOriginNW[1] + y, 
				floorOriginNW[2] + (z * -1)
			);
		},


		makeLayoutVector: function(x, y, z, w, d) {
			// TODO: This function was created because I don't understand how Babylon
			//       does local vectors and was under time pressure, so couldn't do the
			//       research. At some point we need to use the BJS code instead, but could
			//       just insert it here without breaking dependent code.
			// IMPORTANT! The origin specifies the point the floor starts from at the NW corner of
			// the arena. All layout offsets are calculated from that point!

			return new BABYLON.Vector3(
				floorOriginNW[0] + x + (w / 2), 
				floorOriginNW[1] + y, 
				floorOriginNW[2] + (z * -1) - (d / 2)
			);
		},
		

		loadObject: function(objName, objData, scene, onSuccessFunc) {
			let obj = undefined;
			
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
			if ("file" in objData) {
				fn = objData["file"];
			}
			else if ("data" in objData) {
				fn = "data:" + objData["data"];
			}
			else {
				// TODO: Throw exception.
			}

			let meshNameFilter = ""; // Empty string means import *all* meshes in the object.

			obj = BABYLON.SceneLoader.ImportMesh(meshNameFilter, fr, fn, scene, 
					function(newMeshes) {
						if (debugVerbose) console.log("'" + objName + 
							"' mesh import suceeded. Mesh count: " + newMeshes.length);
			
						// Force ID of all meshes to the object name.
						for (m of newMeshes) {
							m.id = objName;
						}
						
						// Save the meshes for later.
						objects[objName] = newMeshes;
			
						if (typeof onSuccessFunc == "function") onSuccessFunc(newMeshes);
					}, null,
					function(scene, message, exception) {
						console.log("== '" + objName + 
							"' mesh import failed. ==\n  Message: " + 
							message.substring(0, 64) + " ... " +  message.substring(message.length - 64) +
							"\n  Exception: " + exception);
					}, 
					loaderPluginExtension); 
			
			// Done.
			return obj;
		},
		
		/** Returns the meshes for the passed object name, assuming the object was 
		specified in the pack file or loaded with the loadObject() function. If the
		object was loaded it returns an array of meshes. If it was not it returns 
		undefined. */
		getLoadedObjectMeshes: function(objName) {
			if (objName in objects) {
				return objects[objName];
			}
			
			return undefined;
		},
		
		
		//
		// Layout helper functions.
		//
	
		addSingleInstanceToPlacements: function(instanceName, placements, count, x, z, 
												offset, rotation) {
			placements.push([instanceName, x, z, rotation]);
		},
	
	
		/** Adds a count series of placements elements to an existing placements, starting
			at the the provided x and z and separated by the provided offset. If across
			is true the elements start at the west and go east. Otherwise the elements
			start at the south and go north. The passed rotation is used for all elements
			in the series.
		*/
		addLinearSeriesToPlacements: function(seriesName, placements, count, x, z, offset,
												across, rotation) {
			for (let i = 0;i < count;i++) {
				placements.push([seriesName + i, x, z, rotation])
				if (across) {
					x += offset;
				}
				else {
					z += offset;
				}
			}
		},


		addRectangleSeriesToPlacements: function(seriesName, placements, countWide, countDeep,
													x, z, lengthOffset, widthOffset) {
			// Calculate starting positions.
			let wx = x - widthOffset;
			let bz = z + (countDeep * lengthOffset) - widthOffset;
			let rx = x - (countWide * lengthOffset);

			// Do width placements.
			for (let i = 0;i < countWide;i++) {
				addLinearSeriesToPlacements(seriesName + "top-", placements, countWide, wx, z,
								lengthOffset, true, norot);
				addLinearSeriesToPlacements(seriesName + "bottom-", placements, countWide, wx, bz,
								lengthOffset, true, norot);
			}

			// Do depth placements.
			for (let i = 0;i< countDeep;i++) {
				addLinearSeriesToPlacements(seriesName + "left-", placements, countDeep, x + widthOffset, bz - widthOffset,
								lengthOffset, false, rot);
				addLinearSeriesToPlacements(seriesName + "right-", placements, countDeep, rx, bz - widthOffset,
								lengthOffset, false, rot);
			}
		},

	
		placeObjects: function(objName, placements, material, scene) {
			// Check the object. (Must be loaded by SquidSpace.)
			let obj = objects[objName];
			if (typeof obj != "object") throw `Invalid object reference: ''${objName}''.`;
		
			// Get the meshes.
			let meshes = objects[objName];
			if ((typeof meshes != "object") && !(meshes instanceof Array) && (meshes.length < 1))
				 throw `Mesh not loaded for object reference: ''${objName}''.`;
		
			for (mesh of meshes) {
				for (instance of placements) {
					let m = mesh.createInstance(instance[0]);
					m.position = SquidSpace.makeLayoutVector(
										instance[0], 0.01, instance[2], pnlwidth, pnldepth);
					if (placements[3] != 0) {
						m.rotate(BABYLON.Axis.Y, instance[3]);
						m.position.z -= (pnlwidth / 2);
					}
					m.checkCollisions = true;
				}
			}
		},


		//
		// Hooks.
		//
		
		
		attachPlacerHook: function(hookName, placerFunction) {
			placerHooks[hookName] = placerFunction;
		},
		
		
		//
		// Public scene management functions.
		//
		
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
			
			
			// Add some builtin objects we'll be using.
			//objects.floorsection = BABYLON.MeshBuilder.CreatePlane("floorsection", 
			//							{width: width, size:depth, tileSize:1}, scene);
		},
	
		/** PoC-specific function to load the passed scene from the world 
		    and content specs. 
		*/
		buildWorld: function(worldSpec, contentSpecs, scene, debugVerbose) {
			// Assume success.
			let success = true;
		 
			debugCamera = debugVerbose;
			if (debugVerbose) {
				//showWorldAxis(10)
			}
		 
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
			objectSpecLoader(world.objects, scene, null);
			// TODO: material, lights, etc. spec loaders.	
			layoutSpecLoader(world.layouts, scene);

			// Set gravity for the scene (G force on Y-axis)
			// See https://doc.babylonjs.com/babylon101/cameras,_mesh_collisions_and_gravity
			// TODO: Determine best settings here.
			if (debugVerbose) {
				// TODO: Give this it's own argument instead of debugVerbose.
				// Allow user to fly.
				scene.gravity = new BABYLON.Vector3(0, 0, 0); 
			}
			else {
				// User walks on ground.
				// TODO: Configure from pack file?
				scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
			}


			// Enable Collisions for scene.
			scene.collisionsEnabled = true;

			// Done.
			return success;
		}
	}
}();
