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
                           "textures": [
                              {
                                 "position": [
                                    0,
                                    0
                                 ],
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "texture": "kathryn-duval-1"
                              },
                              {
                                 "position": [
                                    0.45,
                                    0.5
                                 ],
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "texture": "kathryn-duval-2"
                              },
                              {
                                 "position": [
                                    0,
                                    1
                                 ],
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "texture": "kathryn-duval-3"
                              }
                           ],
                           "place-on": "front"
                        },
                        "options": {
                           "moreInfoData": {
                              "title": "Kathryn Duval",
                              "text": "Kathryn is located in Hilo Hawaii. She’s interested in alternate realities of nature.",
                              "link": "https://squid.fanac.com/kathryn-duval/",
                              "link-text": "Kathryn Duval's Page"
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
                           "textures": [
                              {
                                 "position": [
                                    0.4,
                                    0
                                 ],
                                 "size": [
                                    0.3,
                                    0.4
                                 ],
                                 "texture": "kathryn-duval-2"
                              },
                              {
                                 "position": [
                                    0.9,
                                    0.3
                                 ],
                                 "size": [
                                    0.3,
                                    0.225
                                 ],
                                 "texture": "kathryn-duval-3"
                              },
                              {
                                 "position": [
                                    1.3,
                                    0.15
                                 ],
                                 "size": [
                                    0.3,
                                    0.225
                                 ],
                                 "texture": "kathryn-duval-1"
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