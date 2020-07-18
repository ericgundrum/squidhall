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
                  "object": "artshow.artpnl-1-ns-1-0",
                  "data": [
                     {
                        "data": {
                           "textures": [
                              {
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "texture": "kathryn-duval-1",
                                 "position": [
                                    0,
                                    0
                                 ]
                              },
                              {
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "texture": "kathryn-duval-2",
                                 "position": [
                                    0.45,
                                    0.5
                                 ]
                              },
                              {
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "texture": "kathryn-duval-3",
                                 "position": [
                                    0,
                                    1
                                 ]
                              }
                           ],
                           "place-on": "front"
                        },
                        "options": {
                           "moreInfoData": {
                              "link-text": "Kathryn Duval's Page",
                              "link": "https://squid.fanac.com/kathryn-duval/",
                              "title": "Kathryn Duval",
                              "text": "Kathryn is located in Hilo Hawaii. She’s interested in alternate realities of nature."
                           },
                           "placer": "ArtPlacer"
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
                                 "size": [
                                    0.3,
                                    0.4
                                 ],
                                 "texture": "kathryn-duval-2",
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
                                 "tilted": true,
                                 "texture": "kathryn-duval-3",
                                 "position": [
                                    0.9,
                                    0.3
                                 ]
                              },
                              {
                                 "size": [
                                    0.3,
                                    0.225
                                 ],
                                 "texture": "kathryn-duval-1",
                                 "position": [
                                    1.3,
                                    0.15
                                 ]
                              }
                           ]
                        },
                        "options": {
                           "moreInfoData": {
                              "text": "This is just a test popup.",
                              "title": "Table Test 3"
                           },
                           "placer": "TablePlacer"
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