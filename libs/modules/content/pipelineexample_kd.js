var pipelineexample_kd = (function(){

   return {
      textures: {
         "kathryn-duval-1": {
               "options": {
               },
               "data": {
                  "file-name": "kathryn-duval-1.png",
                  "dir": "textures/content/"
               }
         },
         "kathryn-duval-2": {
               "options": {
               },
               "data": {
                  "file-name": "kathryn-duval-2.png",
                  "dir": "textures/content/"
               }
         },
         "kathryn-duval-3": {
               "options": {
               },
               "data": {
                  "file-name": "kathryn-duval-3.png",
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
                  "data": [
                     {
                        "data": {
                           "textures": [
                              {
                                 "texture": "kathryn-duval-1",
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "position": [
                                    0,
                                    0
                                 ]
                              },
                              {
                                 "texture": "kathryn-duval-2",
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "position": [
                                    0.45,
                                    0.5
                                 ]
                              },
                              {
                                 "texture": "kathryn-duval-3",
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "position": [
                                    0,
                                    1
                                 ]
                              }
                           ],
                           "place-on": "front"
                        },
                        "options": {
                           "placer": "ArtPlacer",
                           "moreInfoData": {
                              "title": "Kathryn Duval",
                              "text": "Kathryn is located in Hilo Hawaii. She’s interested in alternate realities of nature.",
                              "link-text": "Kathryn Duval's Page",
                              "link": "https://squid.fanac.com/kathryn-duval/"
                           }
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
                                 "size": [
                                    0.3,
                                    0.4
                                 ],
                                 "position": [
                                    0.4,
                                    0
                                 ]
                              },
                              {
                                 "tilted": true,
                                 "texture": "kathryn-duval-3",
                                 "size": [
                                    0.3,
                                    0.225
                                 ],
                                 "position": [
                                    0.9,
                                    0.3
                                 ]
                              },
                              {
                                 "texture": "kathryn-duval-1",
                                 "size": [
                                    0.3,
                                    0.225
                                 ],
                                 "position": [
                                    1.3,
                                    0.15
                                 ]
                              }
                           ],
                           "objects": [
                              {
                                 "scale": 0.1,
                                 "rotation": [
                                    0,
                                    0,
                                    0
                                 ],
                                 "object": "plinth",
                                 "size": [
                                    0.2,
                                    0.2
                                 ],
                                 "position": [
                                    1.4,
                                    0.5
                                 ]
                              }
                           ],
                           "origin-corner": "nw"
                        },
                        "options": {
                           "placer": "TablePlacer",
                           "moreInfoData": {
                              "title": "Table Test 3",
                              "text": "This is just a test popup."
                           }
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