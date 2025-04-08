/*\
title: $:/plugins/neuroforest/core/event/hooks.js
type: application/javascript
module-type: startup
\*/


// Source: https://github.com/felixhayashi/TW5-TiddlyMap
const genUUID = (function() {
  var CHARS = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
  return function () {
    var chars = CHARS, uuid = new Array(36);
    var rnd=0, r;
    for (var i = 0; i < 36; i++) {
      if (i==8 || i==13 ||  i==18 || i==23) {
        uuid[i] = '-';
      } else if (i==14) {
        uuid[i] = '4';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
  }})();


$tw.hooks.addHook("th-saving-tiddler", function(tiddler) {
  if (!tiddler.fields["neuro.id"]) {
    console.log(`neuroforest/core: Adding 'neuro.id' field: ${tiddler.fields.title}`)
    var newTiddler = new $tw.Tiddler(tiddler.fields, {"neuro.id": genUUID()});
  } else {
    var newTiddler = tiddler;
  }
  return newTiddler;
});