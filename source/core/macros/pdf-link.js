/*\
created: 20200924200744715
creator: Me
title: $:/plugins/neuroforest/core/macros/pdf-link.js
type: application/javascript
modified: 20200924201811851
module-type: macro
tags: 
modifier: Me
\*/
(function(){

"use strict";

exports.name = "pdf-link";

exports.params = [];

exports.run = function(pdf, page) {
  console.log("RUNNING PDF-LINK.")
  var pdfTiddler = $tw.wiki.getTiddler(pdf);
  if (pdfTiddler && pdfTiddler.fields["link.pdf"]) {
    var pdfUrl = pdfTiddler.fields["link.pdf"];
    var fullPdfUrl = pdfUrl + "#" + page;
    var pdfLink = "[[Open PDF|" + fullPdfUrl + "]]";
    return pdfLink;
  } else {
    return;
  }
};

})();