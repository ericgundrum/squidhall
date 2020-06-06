// NOTE: Strict mode is causing problems I can't track down right now. 
// TODO: Find out why this breaks things and fix.
//'use strict'; 

/**
The SquidHall module provides squidSpace hooks and events, plus other support 
code for the Squid Hall project. 

TODO: Refactor in Squid Hall-Specific code from squidspace.js

TODO: Refactor in as much code from squidhalltest.html as possible
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
	var norot = 0; // Do not rotate.
	var rot = Math.PI / 2; // Rotate 90 degrees.
	
	//
	// Helper Functions.
	//

	var addFloorSection = function(secName, x, z, w, d, material, scene) {
		var floorSection = BABYLON.MeshBuilder.CreatePlane(secName, 
												{width: w, height:d}, scene);
		floorSection.position = new SquidSpace.makeLayoutVector(x, 0.001, z, w, d);
		floorSection.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
	    floorSection.material = material;
		floorSection.material.backFaceCulling = false;
		return floorSection;
	}
	
	//
	// Object Loader Hooks
	//
	
	var attachObjectLoaderHooks = function(squidSpace){
		squidSpace.attachObjectLoaderHook("floorSection",
			function(objName, options, data, scene) {
			
			squidSpace.logDebug(`floorSection Loader called! ${objName}, ${options}, ${data}`);
			
			
	    });
	}
	
	
	//
	// Data for placer hooks.
	//

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
		"autograph":{
			"x":32,
			"y":11.7,
			"z":-1 * 8.3 * 5 - 2,
			"rotateY":-1 * Math.PI/2,
			"texture":"arena-banner-autographing.png"
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
			"texture":"arena-banner-siteseleciton.png"
		},
	};

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


		squidSpace.attachObjectPlacerHook("beamplacer",
			function(areaName, areaOrigin, config, placeName, data, objName, meshes, scene) {
			
			squidSpace.logDebug(`beamplacer called! ${areaName}, ${areaOrigin}, ${config}, ${placeName}, ${data}`);
			for (beammesh of meshes){
	            for (var i = 0; i < 8; i++ ) {
	                var bm = beammesh.createInstance("beam1-" + i);
	                bm.position.z = -1 * i * 8.3;
	                bm.checkCollisions = false;
	            }
	        }
	    });

		squidSpace.attachObjectPlacerHook("bannerplacer",
			function(areaName, areaOrigin, config, placeName, data, objName, meshes, scene) {
			
			squidSpace.logDebug(`bannerplacer called! ${areaName}, ${areaOrigin}, ${config}, ${placeName}, ${data}`);

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
		});

		squidSpace.attachObjectPlacerHook("curtainplacer",
			function(areaName, areaOrigin, config, placeName, data, objName, meshes, scene) {
			
			squidSpace.logDebug(`curtainplacer called! ${areaName}, ${areaOrigin}, ${config}, ${placeName}, ${data}`);

			// NOTE: if you need to verify meshes exist before using them, the
			//  	 the following example is one way.
			//
			//  if (typeof meshes != "undefined") {
			//     . . . code here
			//  }


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
					bm.position.x = 38;
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
			}
		});

		squidSpace.attachObjectPlacerHook("squidplacer",
			function(areaName, areaOrigin, config, placeName, data, objName, meshes, scene) {
			
			squidSpace.logDebug(`squidplacer called! ${areaName}, ${areaOrigin}, ${config}, ${placeName}, ${data}`);
			for (squidmesh of meshes){
		        for (var i = 0; i < 1; i++ ) {
		            var bm = squidmesh.createInstance("squid1-" + i);
		            bm.position = squidSpace.makePointVector(data.position[0], data.position[1], data.position[2]);
		            bm.checkCollisions = false;
		        }
		    }
		});
	
		squidSpace.attachObjectPlacerHook("signfullplacer",
	      	function(areaName, areaOrigin, config, placeName, data, objName, meshes, scene) {
			
			squidSpace.logDebug(`signfullplacer called! ${areaName}, ${areaOrigin}, ${config}, ${placeName}, ${data}`);

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
				let cloneMeshes = squidSpace.cloneObject(objName, key);

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
		});

		squidSpace.attachObjectPlacerHook("signhalfplacer",
	    	function(areaName, areaOrigin, config, placeName, data, objName, meshes, scene) {
			
	        squidSpace.logDebug(`signhalfplacer called! ${areaName}, ${areaOrigin}, ${config}, ${placeName}, ${data}`);

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
	    });
		squidSpace.attachObjectPlacerHook("lightplacer",
			function(areaName, areaOrigin, config, placeName, data, objName, meshes, scene){
			
			squidSpace.logDebug(`lightplacer called! ${areaName}, ${areaOrigin}, ${config}, ${placeName}, ${data}`);

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
	
	var attachBuildHook = function(squidSpace){
		squidSpace.attachBuildHook(function(scene){
			
			squidSpace.logDebug("Building World.");
	
			//
			// Events.
			//
			// TODO: Add event support to SquidSpace layout processing and specify these
			//       in the pack file.
			//
		
		   // Show Popup events.
		   squidSpace.attachClickEventToObject("Chicago2022", "onClickShowPopup",
		   	{
		   		"title": "Chicago 2022!",
		   	 	"text": "Chicago is bidding for the 2022 Worldcon. The theme for the bid is “Take to the Stars”.",
		   		"link-text": "Chicago 2022 Bid",
		   		"link": "https://squid.fanac.com/fan-tables/chicago2022/"
		   	}, scene
		   );
		   squidSpace.attachClickEventToObject("DisCon_III", "onClickShowPopup",
		   	{
		   		"title": "DisCon III!",
		   	 	"text": "DisCon III, the 79th World Science Fiction Convention in 2021! Nancy Kress – Author Guest of Honor.",
		   		"link-text": "DisCon III",
		   		"link": "https://squid.fanac.com/fan-tables/discon3/"
		   	}, scene
		   );
		   squidSpace.attachClickEventToObject("Glasgow", "onClickShowPopup",
		   	{
		   		"title": "Glasgow 2024!",
		   	 	"text": "Glasgow in 2024 – A Worldcon for Our Futures. Join us! 8th-12th August 2024.",
		   		"link-text": "Glasgow 2024",
		   		"link": "https://squid.fanac.com/fan-tables/glasgow2024/"
		   	}, scene
		   );   			
		   
			//
			// Extra object placement.
			//
			//
		
	   		/* TODO: Remove this.
	   		// Place object on object.
	   		// See https://www.babylonjs-playground.com/#0UJYJQ#6
	   		let height = 0;
	   		let teapot = SquidSpace.cloneObject("teapot", "displayteapot");
	   		let plinth = SquidSpace.getLoadedObjectMeshes("plinth11");
	   		// Find max height for plinth.
	   		for (pmesh of plinth) {
	   			let bi = pmesh.getBoundingInfo().boundingBox.vectorsWorld;
	   			let meshHeight = Number(bi[1].y-(bi[0].y));
	   			if (height < meshHeight) height = meshHeight;
	   		}
	   		squidSpace.logDebug(`Plinth height is ${height}.`)
		
	   		for (tmesh of teapot) {
	   			// First scale it (won't be needed after we properly scale the model).
	   			tmesh.scaling = new BABYLON.Vector3(0.2,0.2,0.2);
			
	   			// Now position it.
	   	   	 	tmesh.position.copyFrom(plinth[0].position);
	   	        tmesh.position.y = height;
	   			tmesh.checkCollisions = false;
	   			tmesh.isVisible = true;
	   		}
		
	   		// Add an event to the teapot.
	   		SquidSpace.attachClickEventToObject("displayteapot", "onClickShowPopup",
	   			{
	   				"title": "Utah Teapot",
	   			 	"text": "The Utah teapot, or the Newell teapot, is a 3D test model that has become a standard reference object and an in-joke within the computer graphics community.",
	   				"link-text": "Utah Teapot on Wikipedia",
	   				"link": "https://en.wikipedia.org/wiki/Utah_teapot"
	   			}, scene
	   		);   	

	   		let hugo = SquidSpace.cloneObject("hugo", "displayhugo");
	   		plinth = SquidSpace.getLoadedObjectMeshes("plinth10");
		
	   		for (hmesh of hugo) {
	   			// First scale it (won't be needed after we properly scale the model).
	   			//hmesh.scaling = new BABYLON.Vector3(0.2,0.2,0.2);
			
	   			// Now position it.
	   	   	 	hmesh.position.copyFrom(plinth[0].position);
	   	        hmesh.position.y = height;
	   			hmesh.checkCollisions = false;
	   			hmesh.isVisible = true;
	   		}
		
	   		// Add an event to the hugo.
	   		SquidSpace.attachClickEventToObject("displayhugo", "onClickShowPopup",
	   			{
	   				"title": "Hugo Award Base",
	   			 	"text": "The 2020 Hugo Award base was designed by John Flower.",
	   				"link-text": "Hugo Award Base by John Flower",
	   				"link": "https://conzealand.nz/blog/2020/04/04/kiwi-artists-design-hugo-award-bases"
	   			}, scene
	   		);   	
	   		//*/	
		});
	}
	
	return {
		wireSquidSpace: function(options, data, squidSpace) {
			attachPrepareHook(squidSpace);
			attachBuildHook(squidSpace);
			attachObjectPlacerHooks(squidSpace);
		}
	}
}();