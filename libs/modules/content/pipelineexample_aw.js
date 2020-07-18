var pipelineexample_aw = (function(){

   return {
      textures: {
         "Ai-Weiwei-1": {
               "options": {
                  "loader": "default",
                  "doc": "Since we are using the default loader and no other options, we don't actually need the options section at all."
               },
               "data": {
                  "file-name": "ai-weiwei-1.png",
                  "dir": "textures/content/"
               }
         },
         "Ai-Weiwei-2": {
               "options": {
               },
               "data": {
                  "file-name": "ai-weiwei-2.png",
                  "dir": "textures/content/"
               }
         },
         "Ai-Weiwei-3": {
               "options": {
               },
               "data": {
                  "file-name": "ai-weiwei-3.png",
                  "dir": "textures/content/"
               }
         },},
      materials: {},
      objects: {
      },
      layouts: {
         
         "artshow": {
            "options": {
               "doc": "No options, use defaults from furniture.model.json. (You can leave this options section out.)"
            },
            "objectPlacements": [
               {
                  "object": "artshow.artpnl-1-ew-1-0",
                  "data": [
                     {
                        "data": {
                           "textures": [
                              {
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "texture": "Ai-Weiwei-1",
                                 "position": [
                                    0,
                                    0
                                 ],
                                 "doc": "Size is WxH."
                              },
                              {
                                 "size": [
                                    0.6,
                                    0.8
                                 ],
                                 "texture": "Ai-Weiwei-2",
                                 "position": [
                                    0.5,
                                    0.6
                                 ],
                                 "doc": "Size and position must fit with panel size of X=0.6 and Y=1."
                              },
                              {
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "texture": "Ai-Weiwei-3",
                                 "position": [
                                    0.2,
                                    1.5
                                 ],
                                 "doc": "Size should reflect proportions of original image."
                              }
                           ],
                           "place-on": "front",
                           "doc": "The place-on value lets you specify 'front' or 'back' of the panel."
                        },
                        "options": {
                           "moreInfoData": {
                              "link-text": "Ai Weiwei's Page",
                              "link": "https://squid.fanac.com/art-show/ai-weiwei/",
                              "title": "Ai Weiwei",
                              "text": "Ai Weiwei is a Chinese contemporary artist, active in sculpture, installation, architecture, curating, photography, film, and social, political and cultural. These photos are from an exhibit held of his work on Alcatraz island in the former prison buildings in 2015."
                           },
                           "doc": "The 'ArtPlacer' uses the data below to size and position the art.",
                           "placer": "ArtPlacer"
                        },
                        "doc": "The place-name is used as the base name for placed objects located on artshow.artpnl-1-ew-1-1.",
                        "place-name": "ai-weiwei"
                     }
                  ],
                  "doc": "The panel 'artshow.artpnl-1-ew-1-0' is from the layouts in the furniture.model.json file."
               },
               {
                  "object": "GoHArtExhibitTables.GoHArtExhibitTable-0",
                  "data": [
                     {
                        "data": {
                           "origin-corner": "se",
                           "textures": [
                              {
                                 "size": [
                                    0.3,
                                    0.225
                                 ],
                                 "texture": "Ai-Weiwei-1",
                                 "position": [
                                    0,
                                    0
                                 ],
                                 "doc": "Size is WxH."
                              },
                              {
                                 "size": [
                                    0.3,
                                    0.4
                                 ],
                                 "tilted": true,
                                 "texture": "Ai-Weiwei-2",
                                 "position": [
                                    0.4,
                                    0
                                 ],
                                 "doc": "Size and position must fit with table size of X=0.9 and Y=0.375."
                              },
                              {
                                 "size": [
                                    0.3,
                                    0.225
                                 ],
                                 "texture": "Ai-Weiwei-3",
                                 "position": [
                                    0.9,
                                    0.3
                                 ],
                                 "doc": "Size should reflect proportions of original image."
                              }
                           ],
                           "doc": "The origin-corner value lets you specify what corner of the table is the origin point for X/Y co-ordinates, values are 'nw', 'ne', 'sw', and 'se'. Note that the user spawns in the NW corner of Squid Hall facing SE."
                        },
                        "options": {
                           "moreInfoData": {
                              "text": "This is just a test popup.",
                              "title": "Table Test 1"
                           },
                           "doc": "The 'TablePlacer' uses the data below to size and position the art.",
                           "placer": "TablePlacer"
                        },
                        "doc": "The place-name is used as the base name for placed objects located on GoHArtExhibitTables.GoHArtExhibitTable-0.",
                        "place-name": "table-test-1"
                     }
                  ],
                  "doc": "The table 'GoHArtExhibitTables.GoHArtExhibitTable-0' is from the layouts in the furniture.model.json file."
               },
               {
                  "object": "artshow.ArtShowDesk-2",
                  "data": [
                     {
                        "data": {
                           "origin-corner": "sw",
                           "textures": [
                              {
                                 "size": [
                                    0.3,
                                    0.225
                                 ],
                                 "tilted": true,
                                 "texture": "Ai-Weiwei-1",
                                 "position": [
                                    0,
                                    0
                                 ]
                              },
                              {
                                 "size": [
                                    0.3,
                                    0.4
                                 ],
                                 "texture": "Ai-Weiwei-2",
                                 "position": [
                                    0.4,
                                    0
                                 ]
                              },
                              {
                                 "size": [
                                    0.3,
                                    0.225
                                 ],
                                 "texture": "Ai-Weiwei-3",
                                 "position": [
                                    0.9,
                                    0.3
                                 ]
                              }
                           ]
                        },
                        "options": {
                           "moreInfoData": {
                              "text": "This is just a test popup.",
                              "title": "Table Test 1"
                           },
                           "placer": "TablePlacer"
                        },
                        "place-name": "table-test-2"
                     }
                  ]
               },
            ]
         },
      }
   };
})();
SQUIDSPACE.addAutoloadModule(pipelineexample_aw);