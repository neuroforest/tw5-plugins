/*\
created: 20200428163822115
creator: Me
title: $:/plugins/neuroforest/core/macros/get-role-link.js
type: application/javascript
modified: 20200924201559229
module-type: macro
tags: 
modifier: Me
\*/
(function(){

"use strict";

exports.name = "get-role-link";
  
exports.params = [];

exports.run = function(title) {
    var tiddler = $tw.wiki.getTiddler(title);
    if (! tiddler) {
        return;
    }
    var role =  tiddler.getRole();
    var link;
    if (role) {
        $tw.wiki.each(function(tiddler, title) {
            var keyword = tiddler.fields["neuro.keyword"];

            if (role === keyword) {
                link = tiddler.getLink();
            }
        });
        return link;
    }
};

})();