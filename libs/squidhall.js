// NOTE: Strict mode is causing problems I can't track down right now. 
// TODO: Find out why this breaks things and fix.
//'use strict'; 

/**
Contains web page support for Squid Hall, plus the SquidHall module. The 
SquidHall module is a SquidSpace.js mod providing Squid Hall-specific hooks, 
events, and extensions.
 */

//
// Web Page Stuff.
//

document.addEventListener("DOMContentLoaded", (event) =>{
	var mpopup = document.getElementById('mPopupBox');
	var closepopup = document.getElementById("mPopupBox-close");
	var mctrlpnl = document.getElementById('mCtrlPnl');
	var closectrlpnl = document.getElementById("mCtrlPnl-close");

	window.showMessagePopup = function(data) {
		let mainText = data[`<p>${data["text"]}</p>`];
		let linkText = undefined;

		if ("title" in data) {
			document.getElementById('mpopup-title').innerHTML = data["title"];
		}
		else {
			document.getElementById('mpopup-title').innerHTML = "Attention!";
		}

		if ("text" in data) {
			document.getElementById('mpopup-text').innerHTML = `<p>${data["text"]}</p>`;
		}
		else {
			document.getElementById('mpopup-text').innerHTML = "<p>&nbsp;</p>";
		}

		if ("link" in data && "link-text" in data) {
			document.getElementById('mpopup-link').innerHTML = `<p>See more here: <a href='${data["link"]}' target='_blank'>${data["link-text"]}</a></p>`;
		}
		mpopup.style.display = "block";
	}

	closepopup.onclick = function() {
	    mpopup.style.display = "none";
	}

	showCntrlPanelPopup = function() {
		mctrlpnl.style.display = "block";
	}

	closectrlpnl.onclick = function() {
	    mctrlpnl.style.display = "none";
	}

	window.onclick = function(event) {
	    if (event.target == mpopup) {
	        mpopup.style.display = "none";
	    }
	    else if (event.target == mctrlpnl) {
	        mctrlpnl.style.display = "none";
	    }
	}

	showMessagePopup(
		{
			"title": "Welcome to Squid Hall - A VR re-creation of the TSB Arena",
		 	"text": "Your mouse controls the direction you are facing. The arrow keys or the W, A, S, and D keys control movement forward/back, and left/right. You can click on some of the objects to learn more about them.<br/><br/>Click the close button or outside this message box to start."
		}
	);
});

var aCtx;
var aSource;
var aBuff;
var aGainNode;
var aVolume = 0.05;

var audioCkbox = function(el) {
	if (AudioContext) {
		if (el.checked) {
			aSource.start(0); // start our bufferSource
		} 
		else {
			aSource.stop(0); // this destroys the buffer source
			aSource = aCtx.createBufferSource(); // so we need to create a new one
			aSource.buffer = aBuff;
			aSource.loop = true;
			//aSource.connect(aCtx.destination);
			aGainNode = aCtx.createGain();
		    aGainNode.gain.value = aVolume;
		    aSource.connect(aGainNode);
		    aGainNode.connect(aCtx.destination);
	  	}
	}
	else {
		console.log("No AudioContext available. Sound will not play.")
	}
}

var playSound = function() {
	// Play audio loop. (No audio if browser doesn't support AudioContext.)
	if (AudioContext) {
		aCtx = new AudioContext();
		aSource = aCtx.createBufferSource();
		fetch('audio/crowdambiance.mp3') 
		  .then(resp => resp.arrayBuffer())
		  .then(aBuff => aCtx.decodeAudioData(aBuff))
		  .then(decoded => {
		    aSource.buffer = aBuff = decoded;
		    aSource.loop = true;
		    //aSource.connect(aCtx.destination);
			aGainNode = aCtx.createGain();
		    aGainNode.gain.value = aVolume;
		    aSource.connect(aGainNode);
		    aGainNode.connect(aCtx.destination);
			audioCkbox(document.getElementById('mAudioCB'))
		});
	}
	else {
		console.log("No AudioContext available. Sound will not play.")
	}
}

//
// Squid Hall mod.
//

/**
This is a SquidSpace.js mod providing Squid Hall-specific hooks, events, and extensions.
 */
var SquidHall = function() {
	
	//
	// Some size variables we need for calculations.
	//
	// NOTE: Each unit corresponds to 1 meter, so 1.75 is one and three quarter meters.
	//

	// TODO: Refactor to remove these.
	var pnlwidth = 1;
	var pnldepth = 0.005;
	var pnlSpacing = pnlwidth + 0.3;
	var tblwidth = 1.8;
	var tbldepth = 0.75;
	var tblheight = 0.05;
	var tblSpacing = tblwidth + 0.02;
	var bmWidth = 1;
	var bmSpacing = bmWidth + 10;
	
	//
	// Helper Functions.
	//

	var addFloorSection = function(sectionName, x, z, w, d, material, scene) {
		let floorSection = BABYLON.MeshBuilder.CreatePlane(sectionName, 
												{width: w, height:d}, scene);
		floorSection.position = new SQUIDSPACE.makeLayoutVector(x, 0.001, z, w, d);
		floorSection.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
	    floorSection.material = material;
		floorSection.material.backFaceCulling = false;
		return [floorSection];
	}
	
	var makeArtFrame = function(objName, textureName, size, position, rotation, eventData) {
		txtr = SQUIDSPACE.getTexture(textureName);
		
		let mat = new BABYLON.StandardMaterial(objName, scene);
		//mat.diffuseTexture = txtr;
		mat.emissiveTexture = txtr;
		//mat.alpha = 0.9;
		mat.backFaceCulling = false;

		let frame = BABYLON.MeshBuilder.CreatePlane(objName, {width: size[0], height: size[1]}, scene);
		frame.material = mat;
		frame.position = position;
		frame.rotation = rotation;
		frame.checkCollisions = false;
		frame.isVisible = true;
		
		// Add frame object to SquidSpace.
		SQUIDSPACE.addObjectInstance(objName, [frame]);
		
		// Set event data.
    	if (eventData) {
			SQUIDSPACE.attachClickEventToObject(objName, "onClickShowPopup", eventData, scene);
    	}
		
		return frame;
	}
	
	//
	// Object Loader Hooks
	//
	
	var attachObjectLoaderHooks = function(squidSpace){
		squidSpace.attachObjectLoaderHook("FloorSection",
			function(objName, options, data, scene) {
			
			squidSpace.logDebug(`FloorSection Loader called! ${objName}, ${options}, ${data}`);
			
			// TODO: Size should be 3 elements.
			let sz = SQUIDSPACE.getValIfKeyInDict("size", data, [1, 1]);
			let pos = SQUIDSPACE.getValIfKeyInDict("position", data, [0, 0, 0]);
			let mn = SQUIDSPACE.getValIfKeyInDict("material", data, "");
			let mat = SQUIDSPACE.getMaterial("marble");
			// TODO: Get material from material list by material name
			//       with a default if not loaded.
			return addFloorSection(key, pos[0], pos[2], sz[0], sz[1], mat, scene);
	    });
		
		squidSpace.attachObjectLoaderHook("SkyBox",
			function(objName, options, data, scene) {
		
			squidSpace.logDebug(`SkyBox Loader called! ${objName}, ${options}, ${data}`);
			
			cubeTx = data["cube-texture"];
		
			var skybox = BABYLON.Mesh.CreateBox(objName, 1000.0, scene);
			var skyboxMaterial = new BABYLON.StandardMaterial(objName, scene);
			skyboxMaterial.backFaceCulling = false;
			skyboxMaterial.disableLighting = true;
			skyboxMaterial.disableLighting = true;
			skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(cubeTx, scene);
			skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			skybox.material = skyboxMaterial;
			skybox.infiniteDistance = true;
			
			return [skybox];
	    });
	}
	
	//
	// Data for placer hooks.
	//

	// TODO: Add support for expression strings and move this to the world.json.file as 'data'.
	var bannerlayout = {
		"artshow":{
			"x":5,
			"y":11.7,
			"z":-1 * 8.3 * 2 - 2,
			"rotateY":0,
			"texture":"arena-banner-artshow.png"
		},
		"artshow2":{
			"x":20,
			"y":11.7,
			"z":-1 * 8.3 * 2 - 2,
			"rotateY":0,
			"texture":"arena-banner-artshow.png"
		},
		"dealers-chatham":{
			"x":10,
			"y":11.7,
			"z":-1 * 8.3 * 4 - 2,
			"rotateY":0,
			"texture":"arena-banner-dealers.png"
		},
		"dealers-stewart":{
			"x":10,
			"y":11.7,
			"z":-1 * 8.3 * 5 - 2,
			"rotateY":0,
			"texture":"arena-banner-dealers.png"
		},
		"dealers-north":{
			"x":26,
			"y":11.7,
			"z":-1 * 8.3 * 4 - 2,
			"rotateY":0,
			"texture":"arena-banner-dealers.png"
		},
		"dealers-south":{
			"x":24,
			"y":11.7,
			"z":-1 * 8.3 * 5 - 2,
			"rotateY":0,
			"texture":"arena-banner-dealers.png"
		},
		"exhibit":{
			"x":24,
			"y":11.7,
			"z":-1 * 8.3 * 3 - 2,
			"rotateY":0,
			"texture":"arena-banner-exhibit.png"
		},
		"siteslection":{
			"x":3,
			"y":11.7,
			"z":-1 * 8.3 * 3 - 2,
			"rotateY":Math.PI / 2,
			"texture":"arena-banner-siteselection.png"
		},
		"displays":{
			"x":28,
			"y":11.7,
			"z":-1 * 4.5 * 2 - 2,
			"rotateY": 0,
			"texture":"arena-banner-displays.png"
		}
	};

	// TODO: Add support for expression strings and move this to the world.json.file as 'data'.
	var signfulllayout = {
        "Chicago2022":{
           "pos": [22, 0, 36.3],
            "rotateY":-1 * Math.PI / 4,
            "texture":"sign-Chicago2022.jpg"
        },
        "DisCon_III":{
           "pos": [27, 0, 36.3],
            "rotateY":-1 * Math.PI / 4,
            "texture":"DisCon_III.jpg"
        },
		"Glasgow":{
           "pos": [33, 0, 36.3],
	        "rotateY":-1 * Math.PI / 4,
	        "texture":"sign-glasgow.png"
	    },
		"credits":{
           "pos": [25, 0, 65.5],
	        "rotateY": 0,
	        "texture":"creditsposter.png"
	    },
	};

	// TODO: Add support for expression strings and move this to the world.json.file as 'data'.
    var signhalflayout = {
       "PropSimonTam":{
           "pos": [19.1, 0, 10],
           "rotateY":1 * Math.PI / 4,
           "texture":"sign-half-Prop_Simon_Tam.png"
       },
       "Orodurin":{
           "pos": [19.1, 0, 20],
           "rotateY":1 * Math.PI / 4,
           "texture":"sign-half-Orodruin.png"
       },
       "Kadath":{
           "pos": [19.1, 0, 30],
           "rotateY":1 * Math.PI / 4,
           "texture":"sign-half-Kadath.png"
       },
       "Genosha":{
           "pos": [19.9, 0, 40],
           "rotateY":1 * Math.PI / 4,
           "texture":"sign-half-Genosha.png"
       },
       "Gallifrey":{
           "pos": [19.9, 0, 50],
           "rotateY":1 * Math.PI / 4,
           "texture":"sign-half-Gallifrey.jpg"
       },
   };
	
	//
	// Placer hooks.
	//
	
	var attachObjectPlacerHooks = function(squidSpace){
		// TODO: Implement Texture/Material support in SquidSpace and 
		//       refactor as many of these as possible into the pack file.

		squidSpace.attachObjectPlacerHook("LightPlacer",
			function(areaName, areaOptions, objectName, placeName, options, data, scene){
		
			squidSpace.logDebug(`LightPlacer called! ${areaName}, ${placeName}.`);

			let gl = new BABYLON.GlowLayer("glow", scene, {});
			gl.intensity = 1.0;

			let lightFrontFill = new BABYLON.PointLight("pointLight",
													squidSpace.makePointVector(25, 20, 0), scene);
			lightFrontFill.diffuse = new BABYLON.Color3(1, 1, 1);
			lightFrontFill.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
			lightFrontFill.range = 90;

			let lightTopFill = new BABYLON.PointLight("pointLight",
													squidSpace.makePointVector(25, 20, 60), scene);
			lightTopFill.diffuse = new BABYLON.Color3(1, 1, 1);
			lightTopFill.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
			lightTopFill.range = 90;
			
			return true;
		});

		squidSpace.attachObjectPlacerHook("BeamPlacer",
			function(areaName, areaOptions, objectName, placeName, options, data, scene) {
			
			squidSpace.logDebug(`BeamPlacer called! ${areaName}, ${placeName}.`);
			let meshes = SQUIDSPACE.getLoadedObject(objectName);
			for (beammesh of meshes){
	            for (var i = 0; i < 8; i++ ) {
	                var bm = beammesh.createInstance("beam1-" + i);
	                bm.position.z = -1 * i * 8.3;
	                bm.checkCollisions = false;
	            }
	        }
			
			return true;
	    });
		
		squidSpace.attachObjectPlacerHook("BannerPlacer",
			function(areaName, areaOptions, objectName, placeName, options, data, scene) {
			
			squidSpace.logDebug(`BannerPlacer called! ${areaName}, ${placeName}.`);

			for (key in bannerlayout) {
				let bannerinfo = bannerlayout[key];
				let mat = new BABYLON.StandardMaterial("mat", scene);
				let bannerTexture = new BABYLON.Texture("./textures/" + bannerinfo.texture, scene);
				bannerTexture.vScale = -1;
				// mat.diffuseColor = BABYLON.Color3(1, 1, 1);
				mat.diffuseTexture = bannerTexture;
				mat.emissiveTexture = bannerTexture;
				mat.alpha = 0.9;
				mat.backFaceCulling = false;
				let meshes = SQUIDSPACE.getLoadedObject(objectName);
				// NOTE: Not using squidSpace.cloneObject() here because we aren't adding
				//       events or actions to these objects.
				for (index = 0; index < meshes.length; index++) {
			        let bn = meshes[index].clone("banner-" + index);
					bn.material = mat;
	                bn.position.x = bannerinfo.x;
	                bn.position.y = bannerinfo.y;
	                bn.position.z = bannerinfo.z;
	                bn.rotation.y = bannerinfo.rotateY;
	                bn.checkCollisions = false;
					bn.isVisible = true;
				}
			}
			
			return true;
		});

		squidSpace.attachObjectPlacerHook("CurtainPlacer",
			function(areaName, areaOptions, objectName, placeName, options, data, scene) {
			
			squidSpace.logDebug(`CurtainPlacer called! ${areaName}, ${placeName}.`);

			// NOTE: if you need to verify meshes exist before using them, the
			//  	 the following example is one way.
			//
			//  if (typeof meshes != "undefined") {
			//     . . . code here
			//  }

			let meshes = SQUIDSPACE.getLoadedObject(objectName);
			for (curtainmesh of meshes) {
				curtainmesh.isVisible = false;

				for (i = 0; i < 7; i++ ) {
					let bm = curtainmesh.createInstance("curtain1-" + i);
					bm.position.x = 0;
					bm.position.y = 0;
					bm.position.z = -1 * i * 10;
					bm.checkCollisions = false;
				}

				for (i = 0; i < 7; i++ ) {
					let bm = curtainmesh.createInstance("curtain2-" + i);
					bm.rotation.y = Math.PI;
					bm.position.x = 39;
					bm.position.y = 0;
					bm.position.z = -1 * i * 10 - 10;
					bm.checkCollisions = false;
				}

				for (i = 0; i < 4; i++ ) {
					let bm = curtainmesh.createInstance("curtain3-" + i);
					bm.rotation.y = -1 * Math.PI / 2;
					bm.position.x = i * 10;
					bm.position.y = 0;
					bm.position.z = -64;
					bm.checkCollisions = false;
				}

				for (i = 1; i < 4; i++ ) {
					let bm = curtainmesh.createInstance("curtain4-" + i);
					bm.rotation.y = Math.PI / 2;
					bm.position.x = (i * 10) + 5.71;
					bm.position.y = 0;
					bm.position.z = -0.25;
					bm.checkCollisions = false;
				}
			}
			
			return true;
		});

		squidSpace.attachObjectPlacerHook("SquidPlacer",
			function(areaName, areaOptions, objectName, placeName, options, data, scene) {

			squidSpace.logDebug(`SquidPlacer called! ${areaName}, ${placeName}.`);
			
			let meshes = SQUIDSPACE.getLoadedObject(objectName);
			for (squidmesh of meshes){
		        for (var i = 0; i < 1; i++ ) {
		            var bm = squidmesh.createInstance("squid1-" + i);
		            bm.position = squidSpace.makePointVector(data.position[0], data.position[1], data.position[2]);
					bm.rotation.y = data.rotation;
		            bm.checkCollisions = false;
		        }
		    }
			
			return true;
		});
	
		squidSpace.attachObjectPlacerHook("SignFullPlacer",
	      	function(areaName, areaOptions, objectName, placeName, options, data, scene) {
			
			squidSpace.logDebug(`SignFullPlacer called! ${areaName}, ${placeName}.`);

			for (key in signfulllayout) {
				let signfullinfo = signfulllayout[key];
				let mat = new BABYLON.StandardMaterial("mat", scene);
				let signfullTexture = new BABYLON.Texture("./textures/" + signfullinfo.texture, scene);
				signfullTexture.vScale = -1;
				// mat.diffuseColor = BABYLON.Color3(1, 1, 1);
				mat.diffuseTexture = signfullTexture;
				mat.emissiveTexture = signfullTexture;
				mat.alpha = 0.9;
				mat.backFaceCulling = false;

				// Using squidSpace.cloneObject() here because we *are* adding events to these objects.
				let cloneMeshes = squidSpace.cloneObject(objectName, key);

				for (index = 0; index < cloneMeshes.length; index++) {
					let bn = cloneMeshes[index];
					if(index == 1) bn.material = mat;
					bn.position = squidSpace.makePointVector(
															signfullinfo.pos[0],
															signfullinfo.pos[1],
															signfullinfo.pos[2]);
					bn.rotation.y = signfullinfo.rotateY;
					bn.checkCollisions = true;
					bn.isVisible = true;
				}
			}
			
			return true;
		});

		squidSpace.attachObjectPlacerHook("SignHalfPlacer",
	    	function(areaName, areaOptions, objectName, placeName, options, data, scene) {
			
			squidSpace.logDebug(`SignHalfPlacer called! ${areaName}, ${placeName}.`);

	        for (key in signhalflayout) {
	            let signhalfinfo = signhalflayout[key];
	            let mat = new BABYLON.StandardMaterial("mat", scene);
	            let signhalfTexture = new BABYLON.Texture("./textures/" + signhalfinfo.texture, scene);
	            signhalfTexture.vScale = -1;
	            // mat.diffuseColor = BABYLON.Color3(1, 1, 1);
	            mat.diffuseTexture = signhalfTexture;
	            mat.emissiveTexture = signhalfTexture;
	            mat.alpha = 0.9;
	            mat.backFaceCulling = false;

				// NOTE: Not using squidSpace.cloneObject() here because we aren't adding
				//       events or actions to these objects.
				let meshes = SQUIDSPACE.getLoadedObject(objectName);
	            for (index = 0; index < meshes.length; index++) {
	                let bn = meshes[index].clone("sign-" + index);
	                if(index == 1) bn.material = mat;
	                bn.position = squidSpace.makePointVector(
															signhalfinfo.pos[0],
															signhalfinfo.pos[1],
															signhalfinfo.pos[2]);
	                bn.rotation.y = signhalfinfo.rotateY;
	                bn.checkCollisions = true;
	                bn.isVisible = true;
	            }
	        }
			
			return true;
	    });
	
		squidSpace.attachObjectPlacerHook("ArtPlacer",
	    	function(areaName, areaOptions, objectName, placeName, options, data, scene) {
	
			squidSpace.logDebug(`ArtPlacer called! ${areaName}, ${placeName}, ${objectName}.`);
		
			// Get target object.
			target = SQUIDSPACE.getLoadedObject(objectName);
			// TODO: Check target and fail with error if not loaded. 
		
			//if (SQUIDDEBUG) {
			//      SQUIDSPACE.logDebug(SQUIDDEBUG.makeDetailedObjectInfoString(target));
			//      SQUIDSPACE.logDebug(SQUIDDEBUG.makeObjectInfoString(target));
			//}
		
			// Get the event data.
			ed = options["moreInfoData"];
		
			// Get the placer data.
			if (!data["textures"]) {
				SQUIDSPACE.logWarn("ArtPlacer - No texture data. Cannot do placement.");
				return false;
			}
			dt = data["textures"];
			po = data["place-on"] != "back";
		
			count = 0;
			for (tx of dt) {
				// Get texture data values.
				txName = tx["texture"];
				size = tx["size"];
				position = tx["position"];
			
				// HACK: Right now we are assuming *ANY* y rotation is 90 degrees.
				// TODO: Come up with a way to match rotations better. This will require
				//       translating each frame based on it's position. 
				tgtRot = target[0].rotation;
				isRot = tgtRot.y != 0;
			
				// Calculate positions.
				posV = target[0].position.clone();
				posV.y = posV.y - position[1] + 2.28 - (size[1] / 2);
				if (isRot) {
					if (po) {
						posV.z = posV.z + position[0] + 0.02 + (size[0] / 2);
						posV.x = posV.x + 0.001;
					}
					else {
						posV.z = posV.z - position[0] + 0.6 + (size[0] / 2);
						posV.x = posV.x - 0.04;
					}
				}
				else {
					if (po) {
						posV.x = posV.x - position[0] - 0.62 + (size[0] / 2);
						posV.z = posV.z + 0.001;
					}
					else {
						posV.x = posV.x + position[0] - 1.18 + (size[0] / 2);
						posV.z = posV.z - 0.04;
					}
				}
			
				// Place on target.
				let nm = areaName + "." + txName + "-" + count++;
				frm = makeArtFrame(nm, txName, size, posV, tgtRot, ed);
			}
		
			return true;
	    });
	
		squidSpace.attachObjectPlacerHook("TablePlacer",
	    	function(areaName, areaOptions, objectName, placeName, options, data, scene) {
		
			squidSpace.logDebug(`TablePlacer called! ${areaName}, ${placeName}, ${objectName}.`);
			
			// Get target object.
			target = SQUIDSPACE.getLoadedObject(objectName);
			// TODO: Check target and fail with error if not loaded. 
			
			//if (SQUIDDEBUG) {
			//      SQUIDSPACE.logDebug(SQUIDDEBUG.makeDetailedObjectInfoString(target));
			//      SQUIDSPACE.logDebug(SQUIDDEBUG.makeObjectInfoString(target));
			//}
			
			// Get the event data.
			ed = options["moreInfoData"];
			
			// Get the placer data.
			if (!data["textures"]) {
				SQUIDSPACE.logWarn("TablePlacer - No texture data. Cannot do placement.");
				return false;
			}
			dt = data["textures"];
			ocs = data["origin-corner"];
			oc = -1;
			if (typeof ocs === 'string' || ocs instanceof String) {
				oc = ['nw', 'ne', 'sw', 'se'].indexOf(ocs.toLowerCase());				
			}
			if (oc < 0) {
				SQUIDSPACE.logWarn(`TablePlacer - Invalid origin-corner: ${data["origin-corner"]}. Defaulting to 'ne'.`);
				oc = 0;
			}

			count = 0;
			for (tx of dt) {
				// Get texture data dsvalues.
				txName = tx["texture"];
				size = tx["size"];
				position = tx["position"];
				
				// HACK: Right now we are assuming *ANY* y rotation is 90 degrees.
				// TODO: Come up with a way to match rotations better. This will require
				//       translating each frame based on it's position. 
				tgtRot = target[0].rotation.clone();
				isRot = tgtRot.y != 0;
				
				// Calculate positions.
				posV = target[0].position.clone();
				posV.y = posV.y + 0.751;		
				tgtRot.x = 1.57;
				switch (oc) {
				case 0: // 'nw'
					tgtRot.y = 0;
					posV.x = posV.x - 0.58 + position[0] - (size[0] / 2);
					posV.z = posV.z + 0.03 - position[1] - (size[1] / 2);
					break;
				case 1: // 'ne'
					tgtRot.y = 1.57;
					posV.z = posV.z + 0.885 - position[0] - (size[0] / 2);
					posV.x = posV.x + 0.03 - position[1] - (size[1] / 2);
					break;
				case 2: // 'sw'
					tgtRot.y = 4.71;
					posV.z = posV.z - 0.58 + position[0] - (size[0] / 2);
					posV.x = posV.x - 0.68 + position[1] + (size[1] / 2);
					break;
				case 3: // 'se'
					tgtRot.y = 3.14;
					posV.x = posV.x + 0.885 - position[0] - (size[0] / 2);
					posV.z = posV.z - 0.68 + position[1] + (size[1] / 2);
					break;
				}
				
				// Place on target.
				let nm = areaName + "." + txName + "-" + count++;
				frm = makeArtFrame(nm, txName, size, posV, tgtRot, ed);
				
				// Is it tilted?
				if (tx["tilted"]) {
					frm.rotation.x = 0.3;
					frm.position.y = frm.position.y + (size[0] / 2);
				}
			}
			
			return true;
	    });
		
		squidSpace.attachObjectPlacerHook("PlinthPlacer",
	    	function(areaName, areaOptions, objectName, placeName, options, data, scene) {
	
			squidSpace.logDebug(`PlinthPlacer called! ${areaName}, ${placeName}, ${objectName}.`);
		
			// Get target object.
			target = SQUIDSPACE.getLoadedObject(objectName);
			// TODO: Check target and fail with error if not loaded. 
		
			//if (SQUIDDEBUG) {
			//      SQUIDSPACE.logDebug(SQUIDDEBUG.makeDetailedObjectInfoString(target));
			//      SQUIDSPACE.logDebug(SQUIDDEBUG.makeObjectInfoString(target));
			//}
		
			// Get the event data.
			ed = options["moreInfoData"];
			//SQUIDSPACE.logDebug(`PlinthPlacer - moreInfoData: ${ed}`);
		
			// Get the placer data.
			objToPlaceName = undefined;
			if (data["object"]) {
				objToPlaceName = data["object"];
			}
			placeRotation = [0, 0, 0];
			if (data["rotation"]) {
				placeRotation = data["rotation"];
			}
			placeScaling = 1;
			if (data["scale"]) {
				placeScaling = data["scale"];
			}
			if (!objToPlaceName) {
				SQUIDSPACE.logWarn("PlinthPlacer - No object to place. Cannot do placement.");
				return false;
			}

			// Get the object to place.
			objToPlace = SQUIDSPACE.cloneObject(objToPlaceName, placeName);
			// TODO: Check target and fail with error if not loaded. 

			// Place on target.
			pos = target[0].position.clone();
			pos.y = pos.y + 1.365;
			rot = new BABYLON.Vector3(placeRotation[0], placeRotation[1], placeRotation[2]);
			scl = new BABYLON.Vector3(placeScaling, placeScaling, placeScaling);
			for (mesh of objToPlace) {
				mesh.scaling = scl;
				mesh.rotation = rot;
				mesh.position = pos;
				mesh.isVisible = true
			}
		
			// Set event data.
	    	if (ed) {
				SQUIDSPACE.attachClickEventToObject(placeName, "onClickShowPopup", ed, scene);
	    	}
			
			return true;
	    });
	
	}
	
	//
	// Prepare Hook.
	//
	
	var attachPrepareHook = function(squidSpace){
		squidSpace.attachPrepareHook(function(scene){
			
			squidSpace.logDebug("Preparing builtins.");
			
			// Add some procedural materials  we'll be using as 'builtins' to the scene.
			// TODO: Add texture and material code to SquidSpace and either move these to 
			//       squidhall.js or to a pack file.
			// TODO: Determine if we want to use ambient or diffuse textures. Currently using
			//       ambient on marble and diffuse on macadam. See:
			// * https://gamedev.stackexchange.com/questions/14334/the-difference-between-diffuse-texture-and-ambient-occlusion-texture
			// * https://www.quora.com/What-is-the-difference-between-Ambient-Diffuse-and-Specular-Light-in-OpenGL-Figures-for-illustration-are-encouraged?share=1
			
		    let matMacadam = new BABYLON.StandardMaterial("macadam", scene);
		    let texMacadam = new BABYLON.RoadProceduralTexture("macadamtext", 2048, scene);
			matMacadam.backFaceCulling = false;
		    matMacadam.diffuseTexture = texMacadam;

			squidSpace.addTextureInstance("macadam", texMacadam);
			squidSpace.addMaterialInstance("macadam", matMacadam);			

		    let matMarble = new BABYLON.StandardMaterial("marble", scene);
		    let texMarble = new BABYLON.MarbleProceduralTexture("marbletext", 512, scene);
		    matMarble.ambientTexture = texMarble;
		    //matMarble.numberOfBricksHeight = 1; // Doesn't seem to do anything?
		    //matMarble.numberOfBricksWidth = 1; // Doesn't seem to do anything?

			squidSpace.addTextureInstance("marble", texMarble);
			squidSpace.addMaterialInstance("marble", matMarble);

		    let matWood = new BABYLON.StandardMaterial("wood", scene);
		    let texWood = new BABYLON.WoodProceduralTexture("woodtext", 1048, scene);
			matWood.ampScale = 256; // TODO: Experiment with this, read docs again.
			matWood.woodColor = new BABYLON.Color3(0.8, 0.8, 0.8);
			matWood.backFaceCulling = false;
		    matWood.diffuseTexture = texWood;

			squidSpace.addTextureInstance("wood", texWood);
			squidSpace.addMaterialInstance("wood", matWood);			
		});
	}
	
	//
	// Build Hook.
	//
	
	var attachBuildHooks = function(squidSpace) {
		squidSpace.attachBuildHook(function(scene) {

			squidSpace.logDebug("Build World Hook.");

			//
			// Events.
			//
			// TODO: Add event support to SquidSpace and specify these in the module file.
			//

			// Show Popup events.
			squidSpace.attachClickEventToObject("Chicago2022", "onClickShowPopup", {
				"title": "Chicago 2022!",
				"text": "Chicago is bidding for the 2022 Worldcon. The theme for the bid is “Take to the Stars”.",
				"link-text": "Chicago 2022 Bid",
				"link": "https://squid.fanac.com/fan-tables/chicago2022/"
			}, scene);
			squidSpace.attachClickEventToObject("DisCon_III", "onClickShowPopup", {
				"title": "DisCon III!",
				"text": "DisCon III, the 79th World Science Fiction Convention in 2021! Nancy Kress – Author Guest of Honor.",
				"link-text": "DisCon III",
				"link": "https://squid.fanac.com/fan-tables/discon3/"
			}, scene);
			squidSpace.attachClickEventToObject("Glasgow", "onClickShowPopup", {
				"title": "Glasgow 2024!",
				"text": "Glasgow in 2024 – A Worldcon for Our Futures. Join us! 8th-12th August 2024.",
				"link-text": "Glasgow 2024",
				"link": "https://squid.fanac.com/fan-tables/glasgow2024/"
			}, scene);
		
			// Put an invisible box around the floor to keep you in.
			origin = SQUIDSPACE.makePointXYZ(32, 50, 35)
			boundsBox = BABYLON.MeshBuilder.CreateBox('_bndsbx_', 
				{width: 70, depth: 70, height: 120, sideOrientation: BABYLON.Mesh.BACKSIDE})
			boundsBox.position = new BABYLON.Vector3(origin[0], origin[1], origin[2])
			boundsBox.checkCollisions = true;
			boundsBox.visibility = 0;
		});
	}
	
	var avatarBase = undefined;
		
	return {
		/** Creates a user avatar with the specified user ID at the specified position with the
		    specified rotation. Position and rotation are BABYLON.Vector3 values.
		 */
		makeAvatar: function(userId, position, rotation, scene) {
			// Lazy load the base object.
			if (!avatarBase) {
				// Create a UV mapping that turns off the material for every face but the front one.
				let faceUV = new Array(6);
				faceUV[0] = new BABYLON.Vector4(0, 0, 0);
				faceUV[2] = new BABYLON.Vector4(0, 0, 0);
				faceUV[3] = new BABYLON.Vector4(0, 0, 0);
				faceUV[4] = new BABYLON.Vector4(0, 0, 0);
				faceUV[5] = new BABYLON.Vector4(0, 0, 0);
			  
				// Make options with the UV.
				let options = {height: 0.36, width: 0.54, depth: 0.025, faceUV: faceUV};
			
				// Make the avatar object.
				let badgeMat = new BABYLON.StandardMaterial("badge", scene);
				let badgeTex = new BABYLON.Texture("/textures/conbadge.png", scene);
				//badgeTex.vScale = -1;
				badgeMat.diffuseTexture = badgeTex;
				badgeMat.emissiveTexture = badgeTex;
				badgeMat.backFaceCulling = false;
				avatarBase = BABYLON.MeshBuilder.CreateBox("avatarBase", options, scene);
				avatarBase.material = badgeMat;
				avatarBase.checkCollisions = false;
			
				// Add googly eyes.
				let whiteMat = new BABYLON.StandardMaterial("white", scene);
				whiteMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
				//whiteMat.ambientColor = new BABYLON.Color3(1, 1, 1);
				whiteMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
				let blackMat = new BABYLON.StandardMaterial("black", scene);
				blackMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
				blackMat.ambientColor = new BABYLON.Color3(0, 0, 0);		
				//blackMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
				let b1 = BABYLON.MeshBuilder.CreateDisc("eye", {radius: 0.055, tessellation: 32}, scene);	
				b1.position = new BABYLON.Vector3(-0.075, 0.14, -0.027);
				b1.material = blackMat;
				let e1 = BABYLON.MeshBuilder.CreateDisc("eye", {radius: 0.05, tessellation: 32}, scene);	
				e1.position = new BABYLON.Vector3(-0.075, 0.14, -0.03);
				e1.material = whiteMat;
				let p1 = BABYLON.MeshBuilder.CreateDisc("eye", {radius: 0.04, tessellation: 32}, scene);	
				p1.position = new BABYLON.Vector3(-0.077, 0.13, -0.04);
				p1.material = blackMat;
				avatarBase.addChild(b1);
				avatarBase.addChild(e1);
				avatarBase.addChild(p1);
				let b2 = BABYLON.MeshBuilder.CreateDisc("eye", {radius: 0.055, tessellation: 32}, scene);	
				b2.position = new BABYLON.Vector3(0.075, 0.14, -0.027);
				b2.material = blackMat;
				let e2 = BABYLON.MeshBuilder.CreateDisc("eye", {radius: 0.05, tessellation: 32}, scene);	
				e2.position = new BABYLON.Vector3(0.075, 0.14, -0.03);
				e2.material = whiteMat;
				let p2 = BABYLON.MeshBuilder.CreateDisc("eye", {radius: 0.04, tessellation: 32}, scene);	
				p2.position = new BABYLON.Vector3(0.073, 0.13, -0.04);
				p2.material = blackMat;
				avatarBase.addChild(b2);
				avatarBase.addChild(e2);
				avatarBase.addChild(p2);		
				avatarBase.position = new BABYLON.Vector3(0, -5, 0);		
			}
			
			// Clone.
			// TODO: Determine if createInstance() will work.
			avatar = avatarBase.clone(userId);
												
			// Set the position and rotation.
			avatar.position = position;
			avatar.rotation = rotation;
			
			// Done.
			return avatar;
		},
		
		wireSquidSpace: function(options, data, squidSpace) {
			attachObjectLoaderHooks(squidSpace);
			attachPrepareHook(squidSpace);
			attachBuildHooks(squidSpace);
			attachObjectPlacerHooks(squidSpace);
		},
		
		makeWorld: function(contentModuleList, beforeBuildFunc, afterBuildFunc) {

			// Set up Babylon.js.
			window.canvas = document.getElementById("renderCanvas"); // Get the canvas element
			window.engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
			window.scene = new BABYLON.Scene(engine);
	
			// Wire in the SquidSpace.js common code.
			SQUIDCOMMON.wireSquidSpace(null, null, SQUIDSPACE);
	
			// Wire in the SquidHall code.
			SquidHall.wireSquidSpace(null, null, SQUIDSPACE);

			// Here's where we do the magic.
			document.addEventListener("DOMContentLoaded", (event) =>{
				try {
					setupDebugBefore();
				} catch(e) {
					// Ignore.
				}
				try {
					beforeBuildFunc(scene);
				} catch(e) {
					// Ignore.
				}
				// Create and activate the world space.
				if (SQUIDSPACE.buildWorld(world, contentModuleList, scene)) {
					try {
						setupDebugAfter();
					} catch(e) {
						// Ignore.
					}
					try {
						afterBuildFunc(scene);
					} catch(e) {
						// Ignore.
					}
					
					// Register a render loop to repeatedly render the world space.
					// NOTE: Use commented out render loop below if you don't want FPS label.
					let currFPS = 0;
					let newFPS = 0;
				    var fpsLabel = document.getElementById("fpsLabel");

					// Add page-specific event handlers. (The events themselves are added when 
					// SQUIDSPACE.buildWorld() is called.)
					SQUIDSPACE.addEventListener("onClickShowPopup", function(sourceObjectName, data){
						showMessagePopup(data);
					});
			
					engine.runRenderLoop(function() {
						scene.render();

						// Update FPS on screen if it has changed.
						newFPS = engine.getFps().toFixed();
						if (currFPS != newFPS) {
							currFPS = newFPS;
						    fpsLabel.innerHTML = `&nbsp;${currFPS} fps&nbsp;`;
						}
					});

					// Alternate render loop without FPS label.
					//engine.runRenderLoop(function() {
					//	scene.render();
					//});

					// Watch for browser/canvas resize events
					window.addEventListener("resize", function() {
						engine.resize();
					});
					
					// Play crowd sound.
					playSound();
					
				}
				else {
					console.log("Failed to load world space.")

					showMessagePopup(
						{
							"title": "Squid Hall 3D Space Failed to Load",
						 	"text": "We apologize! Something happened while loading the 3D simulation space. It's possible your computer or web browser do not support WebGL or other features required to make it work. Please try again with a different browser or computer."
						}
					);
				}
			});
		}
	}
}();