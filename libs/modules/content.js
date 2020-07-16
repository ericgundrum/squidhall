var pipelineexample_aw = (function(){

   return {
      textures: {
         "Ai-Weiwei-1": {
               "options": {
                  "loader": "default",
                  "doc": "Since we are using the default loader and no other options, we don't actually need the options section at all."
               },
               "data": {
                  "dir": "textures/content/",
                  "file-name": "ai-weiwei-1.png"
               }
         },
         "Ai-Weiwei-2": {
               "options": {
               },
               "data": {
                  "dir": "textures/content/",
                  "file-name": "ai-weiwei-2.png"
               }
         },
         "Ai-Weiwei-3": {
               "options": {
               },
               "data": {
                  "dir": "textures/content/",
                  "file-name": "ai-weiwei-3.png"
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
                  "data": [
                     {
                        "data": {
                           "textures": [
                              {
                                 "texture": "Ai-Weiwei-1",
                                 "position": [
                                    0,
                                    0
                                 ],
                                 "doc": "Size is WxH.",
                                 "size": [
                                    0.6,
                                    0.45
                                 ]
                              },
                              {
                                 "texture": "Ai-Weiwei-2",
                                 "position": [
                                    0.5,
                                    0.6
                                 ],
                                 "doc": "Size and position must fit with panel size of X=0.6 and Y=1.",
                                 "size": [
                                    0.6,
                                    0.8
                                 ]
                              },
                              {
                                 "texture": "Ai-Weiwei-3",
                                 "position": [
                                    0.2,
                                    1.5
                                 ],
                                 "doc": "Size should reflect proportions of original image.",
                                 "size": [
                                    0.6,
                                    0.45
                                 ]
                              }
                           ],
                           "place-on": "front",
                           "doc": "The place-on value lets you specify 'front' or 'back' of the panel."
                        },
                        "options": {
                           "moreInfoData": {
                              "text": "Ai Weiwei is a Chinese contemporary artist, active in sculpture, installation, architecture, curating, photography, film, and social, political and cultural. These photos are from an exhibit held of his work on Alcatraz island in the former prison buildings in 2015.",
                              "link-text": "Ai Weiwei's Page",
                              "title": "Ai Weiwei",
                              "link": "https://squid.fanac.com/art-show/ai-weiwei/"
                           },
                           "doc": "The 'ArtPlacer' uses the data below to size and position the art.",
                           "placer": "ArtPlacer"
                        },
                        "doc": "The place-name is used as the base name for placed objects located on artshow.artpnl-1-ew-1-1.",
                        "place-name": "ai-weiwei"
                     }
                  ],
                  "doc": "The panel 'artshow.artpnl-1-ew-1-0' is from the layouts in the furniture.model.json file.",
                  "object": "artshow.artpnl-1-ew-1-0"
               },
               {
                  "data": [
                     {
                        "data": {
                           "textures": [
                              {
                                 "texture": "Ai-Weiwei-1",
                                 "position": [
                                    0,
                                    0
                                 ],
                                 "doc": "Size is WxH.",
                                 "size": [
                                    0.3,
                                    0.225
                                 ]
                              },
                              {
                                 "texture": "Ai-Weiwei-2",
                                 "tilted": true,
                                 "position": [
                                    0.4,
                                    0
                                 ],
                                 "doc": "Size and position must fit with table size of X=0.9 and Y=0.375.",
                                 "size": [
                                    0.3,
                                    0.4
                                 ]
                              },
                              {
                                 "texture": "Ai-Weiwei-3",
                                 "position": [
                                    0.9,
                                    0.3
                                 ],
                                 "doc": "Size should reflect proportions of original image.",
                                 "size": [
                                    0.3,
                                    0.225
                                 ]
                              }
                           ],
                           "doc": "The origin-corner value lets you specify what corner of the table is the origin point for X/Y co-ordinates, values are 'nw', 'ne', 'sw', and 'se'. Note that the user spawns in the NW corner of Squid Hall facing SE.",
                           "origin-corner": "se"
                        },
                        "options": {
                           "moreInfoData": {
                              "title": "Table Test 1",
                              "text": "This is just a test popup."
                           },
                           "doc": "The 'TablePlacer' uses the data below to size and position the art.",
                           "placer": "TablePlacer"
                        },
                        "doc": "The place-name is used as the base name for placed objects located on GoHArtExhibitTables.GoHArtExhibitTable-0.",
                        "place-name": "table-test-1"
                     }
                  ],
                  "doc": "The table 'GoHArtExhibitTables.GoHArtExhibitTable-0' is from the layouts in the furniture.model.json file.",
                  "object": "GoHArtExhibitTables.GoHArtExhibitTable-0"
               },
               {
                  "data": [
                     {
                        "data": {
                           "textures": [
                              {
                                 "texture": "Ai-Weiwei-1",
                                 "tilted": true,
                                 "position": [
                                    0,
                                    0
                                 ],
                                 "size": [
                                    0.3,
                                    0.225
                                 ]
                              },
                              {
                                 "texture": "Ai-Weiwei-2",
                                 "position": [
                                    0.4,
                                    0
                                 ],
                                 "size": [
                                    0.3,
                                    0.4
                                 ]
                              },
                              {
                                 "texture": "Ai-Weiwei-3",
                                 "position": [
                                    0.9,
                                    0.3
                                 ],
                                 "size": [
                                    0.3,
                                    0.225
                                 ]
                              }
                           ],
                           "origin-corner": "sw"
                        },
                        "options": {
                           "moreInfoData": {
                              "title": "Table Test 1",
                              "text": "This is just a test popup."
                           },
                           "placer": "TablePlacer"
                        },
                        "place-name": "table-test-2"
                     }
                  ],
                  "object": "artshow.ArtShowDesk-2"
               },
            ]
         },
      }
   };
})();
SQUIDSPACE.addAutoloadModule(pipelineexample_aw);

/*=============================*/

var pipelineexample_kd = (function(){

   return {
      textures: {
         "kathryn-duval-1": {
               "options": {
               },
               "data": {
                  "dir": "textures/content/",
                  "file-name": "kathryn-duval-1.png"
               }
         },
         "kathryn-duval-2": {
               "options": {
               },
               "data": {
                  "dir": "textures/content/",
                  "file-name": "kathryn-duval-2.png"
               }
         },
         "kathryn-duval-3": {
               "options": {
               },
               "data": {
                  "dir": "textures/content/",
                  "file-name": "kathryn-duval-3.png"
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
                  "data": [
                     {
                        "data": {
                           "textures": [
                              {
                                 "texture": "kathryn-duval-1",
                                 "position": [
                                    0,
                                    0
                                 ],
                                 "size": [
                                    0.6,
                                    0.45
                                 ]
                              },
                              {
                                 "texture": "kathryn-duval-2",
                                 "position": [
                                    0.45,
                                    0.5
                                 ],
                                 "size": [
                                    0.6,
                                    0.45
                                 ]
                              },
                              {
                                 "texture": "kathryn-duval-3",
                                 "position": [
                                    0,
                                    1
                                 ],
                                 "size": [
                                    0.6,
                                    0.45
                                 ]
                              }
                           ],
                           "place-on": "front"
                        },
                        "options": {
                           "moreInfoData": {
                              "text": "Kathryn is located in Hilo Hawaii. She’s interested in alternate realities of nature.",
                              "link-text": "Kathryn Duval's Page",
                              "title": "Kathryn Duval",
                              "link": "https://squid.fanac.com/kathryn-duval/"
                           },
                           "placer": "ArtPlacer"
                        },
                        "place-name": "kathryn-duval"
                     }
                  ],
                  "object": "artshow.artpnl-1-ns-1-0"
               },
               {
                  "data": [
                     {
                        "data": {
                           "textures": [
                              {
                                 "texture": "kathryn-duval-2",
                                 "position": [
                                    0.4,
                                    0
                                 ],
                                 "size": [
                                    0.3,
                                    0.4
                                 ]
                              },
                              {
                                 "texture": "kathryn-duval-3",
                                 "tilted": true,
                                 "position": [
                                    0.9,
                                    0.3
                                 ],
                                 "size": [
                                    0.3,
                                    0.225
                                 ]
                              },
                              {
                                 "texture": "kathryn-duval-1",
                                 "position": [
                                    1.3,
                                    0.15
                                 ],
                                 "size": [
                                    0.3,
                                    0.225
                                 ]
                              }
                           ],
                           "origin-corner": "nw"
                        },
                        "options": {
                           "moreInfoData": {
                              "title": "Table Test 3",
                              "text": "This is just a test popup."
                           },
                           "placer": "TablePlacer"
                        },
                        "place-name": "table-test-3"
                     }
                  ],
                  "object": "artshow.ArtShowDesk-1-0"
               },
            ]
         },
      }
   };
})();
SQUIDSPACE.addAutoloadModule(pipelineexample_kd);

/*=============================*/

