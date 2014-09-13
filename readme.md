# Loupe

Loupe is a lightweight, hackable [pointer-based](#touch-screen-support) image magnifier for [modern browsers](#browser-compatibility).

## Browser compatibility

Loupe is designed with progressive enhancement in mind, and will simply not show up in environments that don't support it. It's been tested and works in the following clients:

* MSIE 11+ (will _not_ work in IE 8, 9, or 10)
* Desktop Safari 7 (minus the scrollwheel zoom feature)
* Firefox 28
* Chrome 36

### Touch screen support

Image magnifiers can be nice for input types that produce mouse pointers (e.g., mice, trackpads) but are an awful and unnecessary UI for image zooming on touch screens, and loupe purposely avoids activating itself on touch screens. This has been device tested on iOS and Android, and if you discover a touch screen context in which loupe causes interference please file an issue!
