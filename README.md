# Loupe

Loupe is a lightweight, hackable [pointer-based](#touch-screen-support) image magnifier for [modern browsers](#browser-compatibility).

## Installation

Loupe is available as a Bower package:

```
bower install loupe
```

## Basic use

Add `loupe.js` and some accompanying CSS (modeled on `loupe.css`) to your page.

`Loupe` is a constructor function, and should be called with an element as its only parameter. That element can be a link to a larger version of the image:

```html
<a id="demo-1" href="big.jpg">
  <img src="small.jpg" />
</a>

<script>
  new Loupe(document.getElementById('demo-1'));
</script>
```

…or it can be the image itself, in which case a magnified version of the same image source will be displayed in the loupe:

```html
<img id="demo-2" src="big.jpg" />

<script>
  new Loupe(document.getElementById('demo-2'));
</script>
```

(Obviously you wouldn't actually use inline JS for this! These examples are just to demonstrate loupe construction!)

## Browser compatibility

Loupe is designed with progressive enhancement in mind, and will simply not show up in environments that don't support it. It's been tested and works in the following clients:

* MSIE 11+ (will _not_ work in IE 8, 9, or 10)
* Desktop Safari 7 (minus the scrollwheel zoom feature)
* Firefox 28
* Chrome 36

### Touch screen support

Image magnifiers work well with mice and trackpads, but there are better options for touch screens. Loupe purposely avoids activating itself on touch screens.

## Q&A

#### Wasn't this a jQuery plugin?

It was! The jQuery version is still supported [in 1.x releases](https://github.com/redoPop/loupe/releases), but no new features, API changes, or configuration options will be added to it in this repo.

There are several forks of the jQuery version with new features and customization options, so if that's a thing you're interested in then please do mosey on over to [the list of forks](https://github.com/redoPop/loupe/network) and see if there's an active fork offering what you want.
