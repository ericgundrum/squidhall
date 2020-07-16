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
                  "object": "artshow.artpnl-1-ns-1-0",
                  "data": [
                     {
                        "data": {
                           "place-on": "front",
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
                           ]
                        },
                        "options": {
                           "placer": "ArtPlacer",
                           "moreInfoData": {
                              "text": "Kathryn is located in Hilo Hawaii. She’s interested in alternate realities of nature.",
                              "title": "Kathryn Duval",
                              "link-text": "Kathryn Duval's Page",
                              "link": "https://squid.fanac.com/kathryn-duval/"
                           }
                        },
                        "place-name": "kathryn-duval"
                     }
                  ]
               },
               {
                  "object": "artshow.ArtShowDesk-1-0",
                  "data": [
                     {
                        "data": {
                           "origin-corner": "nw",
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
                                 "position": [
                                    0.9,
                                    0.3
                                 ],
                                 "tilted": true,
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
                           ]
                        },
                        "options": {
                           "placer": "TablePlacer",
                           "moreInfoData": {
                              "text": "This is just a test popup.",
                              "title": "Table Test 3"
                           }
                        },
                        "place-name": "table-test-3"
                     }
                  ]
               },
            ]
         },
      }
   };
})();
SQUIDSPACE.addAutoloadModule(pipelineexample_kd);