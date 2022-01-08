/*\
created: 20210416125700000
creator: Me
title: $:/plugins/neuroforest/core/macros/get-name.js
type: application/javascript
modified: 20210416125700000
module-type: macro
tags: 
modifier: Me
\*/
(function(){

  "use strict";
  
  exports.name = "get-name";
  
  exports.params = [];
  
  exports.run = function(title) {
    var tiddler = $tw.wiki.getTiddler(title);
    tiddler.getName();
  }
  })();
  