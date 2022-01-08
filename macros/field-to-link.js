/*\
created: 20200408163858079
creator: Me
title: $:/plugins/neuroforest/core/macros/field-to-link.js
type: application/javascript
module-type: macro
modified: 20200408193055453
modifier: Me
\*/

(function(){

"use strict";

exports.name = "field-to-link";

exports.params = [];

/*
Run the macro
*/
exports.run = function(title, field) {
    var tiddler, fieldString, fieldTiddler, displayName, link;
    
    tiddler = $tw.wiki.getTiddler(title);
    fieldString = tiddler.getFieldString(field);
    fieldTiddler = $tw.wiki.getTiddler(fieldString);
    if (fieldTiddler && fieldTiddler.fields.name) {
        displayName = fieldTiddler.getName();
        link = "[[" + displayName + "|" + fieldString + "]]";
    } else {
        link = "[[" + fieldString + "]]";
    }
    return link;
};

})();