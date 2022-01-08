/*\
created: 20200408202907669
creator: Me
tags: 
title: $:/plugins/neuroforest/core/macros/field-value.js
modified: 20200408203334859
modifier: Me
type: application/javascript
module-type: macro

\*/

(function(){

"use strict";

exports.name = "field-value";

exports.params = [];

exports.run = function(title, field) {
    var tiddler, value;
    
    tiddler = $tw.wiki.getTiddler(title);
    if (tiddler) {
        value = tiddler.fields[field];
        if (value) {
            return value;
        }
    }
  	return "";
};

})();