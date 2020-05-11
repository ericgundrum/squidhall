var world = (function(){

   return {
      arena: function(){
         return {
            "url": "objects/arena.babylon",
            "config": {
               "visible": true,
               "position": {
                  "anchor": "bottom",
                  "coords": [
                     0,
                     2,
                     5
                  ],
                  "rotate": 3.12
               },
               "doc": "Example. We are not currently using config, but eventually every object will."
            }
         };
      },
      beam: function(){
         return {
            "url": "objects/beam.babylon"
         };
      },
      curtain: function(){
         return {
            "url": "objects/curtain.babylon"
         };
      },
      squid: function(){
         return {
            "url": "objects/squid.babylon"
         };
      },
      panel: function(){
         return {
            "url": "objects/panel.babylon"
         };
      },
   };
})();