/*\
created: 20200408175527956
creator: Me
title: $:/plugins/neuroforest/core/macros/field-name-tiddler.js
type: application/javascript
modified: 20200502220621151
module-type: macro
tags: 
modifier: Me
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "field-name-tiddler";

exports.params = [];

exports.run = function(field) {
  var tiddlerMatch;
  $tw.wiki.each(function(tiddler, title) {
    var fieldName = tiddler.fields["field-name"];
   
    if (fieldName === field) {
      tiddlerMatch = tiddler;
    }
  });
  if (tiddlerMatch) {
    var link = $tw.utils.getLink(tiddlerMatch);
    return link;
  } else {
    window.alert("Not found:" + field);
    return "";
  }
};

})();