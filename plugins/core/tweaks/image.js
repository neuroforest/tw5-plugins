/*\
title: $:/core/modules/widgets/image.js
type: application/javascript
module-type: widget
\*/
(function(){

"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var ImageWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
ImageWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
ImageWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	// Create element
	// Determine what type of image it is
	var tag = "img", src = "",
		tiddler = this.wiki.getTiddler(this.imageSource);
	if(!tiddler) {
		// The source isn't the title of a tiddler, so we'll assume it's a URL
		src = this.getVariable("tv-get-export-image-link",{params: [{name: "src",value: this.imageSource}],defaultValue: this.imageSource});
	} else {
		// Check if it is an image tiddler
		if(this.wiki.isImageTiddler(this.imageSource)) {
			var type = tiddler.fields.type,
				text = tiddler.fields.text,
				_canonical_uri = tiddler.fields._canonical_uri;
			// If the tiddler has body text then it doesn't need to be lazily loaded
			if(text) {
				// Render the appropriate element for the image type
				switch(type) {
					case "application/pdf":
						tag = "embed";
						src = "data:application/pdf;base64," + text;
						break;
					case "image/svg+xml":
						src = "data:image/svg+xml," + encodeURIComponent(text);
						break;
					default:
						src = "data:" + type + ";base64," + text;
						break;
				}
			} else if(_canonical_uri) {
				switch(type) {
					case "application/pdf":
						tag = "embed";
						src = _canonical_uri;
						break;
					case "image/svg+xml":
						src = _canonical_uri;
						break;
					default:
						src = _canonical_uri;
						break;
				}	
			} else {
				// Just trigger loading of the tiddler
				this.wiki.getTiddlerText(this.imageSource);
			}
		}
	}
	// Create the element and assign the attributes
	var domNodeWrapper = this.document.createElement("a");
	domNodeWrapper.setAttribute("href",src);
	domNodeWrapper.setAttribute("target","_blank");
	var domNode = this.document.createElement(tag);
	domNode.setAttribute("src",src);
	if(this.imageClass) {
		domNode.setAttribute("class",this.imageClass);		
	}
	if(this.imageWidth) {
		domNode.setAttribute("width",this.imageWidth);
	}
	if(this.imageHeight) {
		domNode.setAttribute("height",this.imageHeight);
	}
	if(this.imageTooltip) {
		domNode.setAttribute("title",this.imageTooltip);		
	} else {
	    domNode.setAttribute("title", src);
	}
	if(this.imageAlt) {
		domNode.setAttribute("alt",this.imageAlt);		
	}
	// Insert element
	if (this.imageWrap == "false") {
		parent.insertBefore(domNode,nextSibling);
		this.domNodes.push(domNode);
	} else {
		domNodeWrapper.appendChild(domNode);
		parent.insertBefore(domNodeWrapper,nextSibling);
		this.domNodes.push(domNodeWrapper);
	}
};

/*
Compute the internal state of the widget
*/
ImageWidget.prototype.execute = function() {
	// Get our parameters
	this.imageSource = this.getAttribute("source");
	this.imageWidth = this.getAttribute("width");
	this.imageHeight = this.getAttribute("height");
	this.imageClass = this.getAttribute("class");
	this.imageTooltip = this.getAttribute("tooltip");
	this.imageAlt = this.getAttribute("alt");
	this.imageWrap = this.getAttribute("wrap");
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
ImageWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.source || changedAttributes.width || changedAttributes.height || changedAttributes["class"] || changedAttributes.tooltip || changedTiddlers[this.imageSource]) {
		this.refreshSelf();
		return true;
	} else {
		return false;		
	}
};

exports.image = ImageWidget;

})();
