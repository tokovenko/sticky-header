###Usage:

```javascript

var nav = document.getElementById('nav')
// make '.nav' stick to the top
var item = new StickyHeader(nav);

// make '.nav' stick to top 100px
var item = new StickyHeader(bar, {
	offsetTop: 100
});

// make '.nav' stick to top 100px and events
var item = new StickyHeader(bar);
item.on('on-top', function(sticky) {
	console.log('now fixed..')
});
item.on('on-origin', function(sticky) {
	console.log('now on origin place..')
});

```

###Example:

See https://tokovenko.github.io/sticky-header/
