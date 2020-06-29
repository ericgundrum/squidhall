var pipelineEx = (function(){

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
         },
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
                  "object": "artshow.artpnl-1-ew-1-1",
                  "data": [
                     {
                        "place-name": "ai-weiwei",
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
                                 "texture": "Ai-Weiwei-1",
                                 "doc": "Size is WxH."
                              },
                              {
                                 "position": [
                                    0.5,
                                    0.7
                                 ],
                                 "size": [
                                    0.6,
                                    0.8
                                 ],
                                 "texture": "Ai-Weiwei-2",
                                 "doc": "Size and position must fit with panel size of X=1.2 and Y=1."
                              },
                              {
                                 "position": [
                                    0.0,
                                    1.5
                                 ],
                                 "size": [
                                    0.6,
                                    0.45
                                 ],
                                 "texture": "Ai-Weiwei-3",
                                 "doc": "Size should reflect proportions of original image."
                              }
                           ],
                           "place-on": "front",
                           "doc": "The place-on value lets you specify 'front' or 'back' of the panel."
                        },
                        "doc": "The place-name is used as the base name for placed objects located on artshow.artpnl-1-ew-1-1.",
                        "options": {
                           "placer": "ArtPlacer",
                           "doc": "The 'ArtPlacer' figures out the best way to arrange the pictures.",
                           "moreInfoData": {
                              "title": "Ai Weiwei",
                              "link-text": "Ai Weiwei's Page",
                              "link": "https://squid.fanac.com/art-show/ai-weiwei/",
                              "text": "Ai Weiwei is a Chinese contemporary artist, active in sculpture, installation, architecture, curating, photography, film, and social, political and cultural. These photos are from an exhibit held of his work on Alcatraz island in the former prison buildings in 2015."
                           }
                        }
                     }
                  ],
                  "doc": "The panel 'artshow.artpnl-1-ew-1-1' is from the layouts in the furniture.model.json file."
               },
               {
                  "object": "artshow.artpnl-1-ns-1-0",
                  "data": [
                     {
                        "place-name": "kathryn-duval",
                        "data": {
                           "textures": [
                              {
                                 "position": [
                                    0.45,
                                    0
                                 ],
                                 "doc": "Position is XxY where 'X' is horizontal and 'Y' is vertical.",
                                 "texture": "kathryn-duval-1",
                                 "size": [
                                    0.6,
                                    0.45
                                 ]
                              },
                              {
                                 "position": [
                                    0.0,
                                    0.5
                                 ],
                                 "doc": "Position starts from upper left, so [0, 0] is the upper left corner.",
                                 "texture": "kathryn-duval-2",
                                 "size": [
                                    0.6,
                                    0.45
                                 ]
                              },
                              {
                                 "position": [
                                    0.45,
                                    1
                                 ],
                                 "texture": "kathryn-duval-3",
                                 "size": [
                                    0.6,
                                    0.45
                                 ]
                              }
                           ],
                           "place-on": "back"
                        },
                        "doc": "The place-name is used as the base name for placed objects located on artshow.artpnl-1-ew-1-2.",
                        "options": {
                           "placer": "ArtPlacer",
                           "moreInfoData": {
                              "title": "Kathryn Duval",
                              "link-text": "Kathryn Duval's Page",
                              "link": "https://squid.fanac.com/kathryn-duval/",
                              "text": "Kathryn is located in Hilo Hawaii. She’s interested in alternate realities of nature."
                           }
                        }
                     }
                  ],
                  "doc": "The panel 'artshow.artpnl-1-ns-1-0' is from the layouts in the furniture.model.json file."
               },
            ]
         },
      }
   };
})();