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
                        "place-name": "kathryn-duval",
                        "data": {
                           "place-on": "front",
                           "textures": [
                              {
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "position": [
                                    0,
                                    0
                                 ],
                                 "texture": "kathryn-duval-1"
                              },
                              {
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "position": [
                                    0.45,
                                    0.5
                                 ],
                                 "texture": "kathryn-duval-2"
                              },
                              {
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "position": [
                                    0,
                                    1
                                 ],
                                 "texture": "kathryn-duval-3"
                              }
                           ]
                        },
                        "options": {
                           "moreInfoData": {
                              "text": "Kathryn is located in Hilo Hawaii. She’s interested in alternate realities of nature.",
                              "link-text": "Kathryn Duval's Page",
                              "title": "Kathryn Duval",
                              "link": "https://squid.fanac.com/kathryn-duval/"
                           },
                           "placer": "ArtPlacer"
                        }
                     }
                  ],
                  "object": "artshow.artpnl-1-ns-1-0"
               },
               {
                  "data": [
                     {
                        "place-name": "table-test-3",
                        "data": {
                           "origin-corner": "nw",
                           "textures": [
                              {
                                 "size": [
                                    0.3,
                                    0.4
                                 ],
                                 "position": [
                                    0.4,
                                    0
                                 ],
                                 "texture": "kathryn-duval-2"
                              },
                              {
                                 "size": [
                                    0.3,
                                    0.225
                                 ],
                                 "position": [
                                    0.9,
                                    0.3
                                 ],
                                 "texture": "kathryn-duval-3",
                                 "tilted": true
                              },
                              {
                                 "size": [
                                    0.3,
                                    0.225
                                 ],
                                 "position": [
                                    1.3,
                                    0.15
                                 ],
                                 "texture": "kathryn-duval-1"
                              }
                           ]
                        },
                        "options": {
                           "moreInfoData": {
                              "text": "This is just a test popup.",
                              "title": "Table Test 3"
                           },
                           "placer": "TablePlacer"
                        }
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