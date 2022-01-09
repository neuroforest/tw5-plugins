/*\
created: 20200408180008365
creator: Me
tags: 
title: $:/plugins/neuroforest/core/utils/wikiUtils.js
modified: 20200408180357776
modifier: Me
module-type: wikimethod
type: application/javascript
\*/
(function() {

"use strict";
  
exports.nfRename = function(from, to) {
    var tiddler = $tw.wiki.getTiddler(from);
    if (! tiddler) {
        console.log(`Tiddler '${from}' does not exist.`)
    } else if ($tw.wiki.getTiddler(to)) {
        console.log(`Target tiddler '${to}' already exists.`)
    } else if (! to) {
        console.log(`No target tiddler given.`)
    } else {
        var backlinks = $tw.wiki.filterTiddlers(`[[${from}]backlinks[]]`);

        // Rename tiddler
        $tw.wiki.renameTiddler(from, to);

        // Rename backlinks
        for (var i = 0; i < backlinks.length; i++) {
            var backlinkTiddler = $tw.wiki.getTiddler(backlinks[i]);
            if (! backlinkTiddler) {
                continue;
            }
            var text = backlinkTiddler.fields.text;
            var linkRaw = `[[${from}]]`
            var linkCustom = `|${from}]]`
            var linkRawNew = `[[${to}]]`
            var linkCustomNew = `|${to}]]`
            var newText = text.split(linkRaw).join(linkRawNew);
            newText = newText.split(linkCustom).join(linkCustomNew);
            $tw.wiki.addTiddler(new $tw.Tiddler(backlinkTiddler.fields, {text: newText}))
        }

        // Handling primaries.
        var primaryTitles = $tw.wiki.filterTiddlers("[has[neuro.primary]]");
        $tw.utils.each(primaryTitles, function(title) {
            var primaryTiddler = $tw.wiki.getTiddler(title);
            var primary = primaryTiddler.fields["neuro.primary"];
            if (primary === from) {
                var newTiddler = new $tw.Tiddler(primaryTiddler.fields, {"neuro.primary": to});
                $tw.wiki.addTiddler(newTiddler);
            }
        })
    }
};

exports.nfRecode = function (from, to) {
    var filter = `[prefix[.${from}]]`
    var tiddlerTitles = $tw.wiki.filterTiddlers(filter);

    $tw.utils.each(tiddlerTitles, function (title) {
        var newTitle = title.replace(from, to);
        $tw.wiki.nfRename(title, newTitle);
        // TODO: handle encoding
    })
    
};

exports.nfAddFields = function(filter, newFields) {
    var tiddlerTitles = $tw.wiki.filterTiddlers(filter);

    if (tiddlerTitles == false) {
        console.log(`Filter "${filter}" selected 0 tiddlers.`);
    }

    $tw.utils.each(tiddlerTitles, function(title) {
        var tiddler = $tw.wiki.getTiddler(title);
        $tw.wiki.addTiddler(new $tw.Tiddler(tiddler, newFields));
    })
};

exports.nfDeleteFields = function(filter, fieldsToRemove) {
    var tiddlerTitles = $tw.wiki.filterTiddlers(filter);

    if (tiddlerTitles == false) {
        console.log(`Filter "${filter}" selected 0 tiddlers.`);
    }

    $tw.utils.each(tiddlerTitles, function(title) {
        var tiddler = $tw.wiki.getTiddler(title);
        
        var currentFields = Object.keys(tiddler.fields);

        var newFields = {};
        currentFields.forEach(function(fieldName) {
            if (fieldsToRemove.indexOf(fieldName) !== -1) {
                return;
            } else {
                newFields[fieldName] = tiddler.fields[fieldName];
            }
        })
        
        $tw.wiki.addTiddler(new $tw.Tiddler(newFields));
    })
};

exports.nfDisplayTiddlers = function(filter, mode="add") {
    var tiddlerTitles = $tw.wiki.filterTiddlers(filter);

    var story = new $tw.Story();

    if (mode === "clear") {
        var newFields = {
            "list": ""
        }
        $tw.wiki.nfAddFields("[title[$:/StoryList]]", newFields);
    }
    tiddlerTitles.forEach(function(title) {
        story.addToStory(title);
    })
};

exports.nfReplace = function(text, newText, filter="[all[tiddlers]] -[prefix[$:/]]") {
    // TODO: if backslash is present it fails
    var tiddlerTitles = $tw.wiki.filterTiddlers(filter);

    $tw.utils.each(tiddlerTitles, function(title) {
        var tiddler = $tw.wiki.getTiddler(title);
        var tiddlerText = tiddler.fields.text;
    
        if (!tiddlerText) return;

        if (tiddlerText.includes(text)) {
            console.log(title);
            var newTiddlerText = tiddlerText.split(text).join(newText);
            var fields = {
                "text": newTiddlerText
            }
            $tw.wiki.addTiddler(new $tw.Tiddler(tiddler.fields, fields));
        }

    })
};

exports.nfRenameTiddlers = function(filter, fromText, toText) {
    var tiddlerTitles = $tw.wiki.filterTiddlers(filter);

    $tw.utils.each(tiddlerTitles, function(title) {
        if (title.includes(fromText)) {
            var newTitle = title.replace(fromText, toText);
            $tw.wiki.nfRename(title, newTitle);
        }
    })
};

exports.nfDeleteTiddlers = function(filter) {
    var tiddlerTitles = $tw.wiki.filterTiddlers(filter);

    $tw.utils.each(tiddlerTitles, function(title) {
        $tw.wiki.deleteTiddler(title);
        }
    )
};

exports.nfMerge = function(tiddlerTitles) {
    // Check the input
    if (! Array.isArray(tiddlerTitles)) {
        console.error("ERROR: the argument is not an Array");
        return;
    }

    var tiddlers = new Array();
    var tiddlers = tiddlerTitles.map(function(tiddlerTitle) {
        var tiddler = $tw.wiki.getTiddler(tiddlerTitle);
        return tiddler;
    })
    var tiddlerFields = {}

    tiddlers.forEach(function(tiddlerNew) {
        Object.assign(tiddlerFields, tiddlerNew.fields);
    })

    var targetTitle = tiddlerFields.title;

    tiddlers.forEach(function(tiddlerNew) {
        $tw.wiki.relinkTiddler(tiddlerNew.fields.title, targetTitle);
        $tw.wiki.deleteTiddler(tiddlerNew.fields.title);
    })

    $tw.wiki.addTiddler(new $tw.Tiddler(tiddlerFields));
}

})();