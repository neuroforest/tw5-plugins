/*\
title: $:/plugins/neuroforest/core/server/routes/put-action.js
module-type: route
type: application/javascript

PUT /neuro/action/:action
\*/
(function() {

"use strict";

exports.method = "PUT";

exports.path = /^\/neuro\/action\/(.+)$/; //

exports.handler = function(request,response,state) {
  var action = state.params[0];
  if (action === "rename") {
    var oldTitle = state.queryParameters["old"];
    var newTitle = state.queryParameters["new"];
    var status = state.wiki.nfRename(oldTitle, newTitle);
  } else if (action === "merge") {
    var titles = state.queryParameters["titles"];
    var status = state.wiki.nfMerge(titles);
  } else {
    console.error("Action is not supported " + action);
  }

  // Writing response
  if (status === 204) {
    response.writeHead(204, "OK",{
    "Content-Type": "text/plain"
    });
  } else {
    response.writeHead(500, status,{
    "Content-Type": "text/plain"
    });
  }
	response.end();
}

}());
