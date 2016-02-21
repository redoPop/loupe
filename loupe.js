/**
Loupe 2.0.0
https://github.com/redoPop/loupe
*/

/**
A new loupe instance.
@constructor
@param {HTMLElement}
@example
var loupe = new Loupe(document.getElementById('image'));
*/
function Loupe(el) {
  this.init(el);
}

// Giant IIFE to avoid scope pollution if someone needs to add
// this source script to their project directly! (Tch!)
(function (Loupe) {

  // Adapted from Modernizr's pointerevents feature detect
  var canPoint = document.createElement('x');
  canPoint.style.cssText = 'pointer-events:none';
  canPoint = canPoint.style.pointerEvents === 'none';

  // Keyword variables for tighter minification
  var _offset = 'offset';
  var _mousemove = 'mousemove';
  var _mouseout = 'mouseout';
  var _pointerdown = 'pointerdown';
  var _touchstart = 'touchstart';
  var _wheel = 'wheel';

  // Helper method to normalize event.offset(X|Y)
  function eventOffset(event, axis) {
    return event[_offset + axis] == undefined ?
    event['layer' + axis] - event.target[_offset + (axis === 'X' ? 'Left' : 'Top')] :
    event[_offset + axis];
  }

  // Helper method to safely parse an int
  function intify(number) {
    return parseInt(number, 10);
  }

  // Helper method to add & remove CSS classes
  function setClass(el, add, remove) {
    var string = el.className;

    remove = remove || '';
    el.className =
      (
        string.replace(remove, '') + ' ' +
        add
      )
      .replace(/^\s*([\S\s]*)\b\s*$/, '$1');
  }

  Loupe.prototype = {
    /**
    The properties of the `_` object are likely to change between
    versions of Loupe; do _not_ rely on it!
    @namespace
    @private
    */
    _: {},

    /**
    CSS class names used by the loupe object.
    @namespace
    @static
    */
    classes: {
      /**
      The main magnifying lens.
      @member {string}
      @default
      */
      lens:    'loupe',

      /**
      Applied when the lens is in use and visible.
      @member {string}
      @default
      */
      on:      'loupe--active',

      /**
      Applied when the lens is deactivated after use.
      @member {string}
      @default
      */
      off:     'loupe--inactive'
    },

    /**
    True while the loupe is active.
    @type {boolean}
    @default
    */
    on: false,

    /**
    Zoom level (compared w/source img)
    @type {number}
    @default
    */
    zoom: 2,

    /**
    Minimum and maximum zoom levels!
    @type {Array}
    @default
    */
    range: [1.2, 7],

    /**
    Called by the contructor to initialize the loupe instance.
    @param {HTMLElement}
    */
    init: function (el) {
      var self = this;

      // If the browser doesn't support pointer-events,
      // halt loupe's initialization!
      if (!canPoint) {
        return;
      }

      // Create local versions of unshared objects
      self._ = {};
      self.range = self.range.slice(0);

      self.el = el;

      self.render();
      self.listen();
    },

    /**
    Show the loupe.
    */
    show: function () {
      if (!this.on) {
        setClass(this.lens, this.classes.on, this.classes.off);
        this.on = true;
      }
    },

    /**
    Hide the loupe.
    */
    hide: function () {
      setClass(this.lens, this.classes.off, this.classes.on);
      this.on = false;
    },

    /**
    Renders the loupe element.
    */
    render: function () {
      var self = this;

      self.lens = document.createElement('div');
      self.lens.className += ' ' + self.classes.lens;
      document.body.appendChild(self.lens);
    },

    /**
    Returns URL to use as a magnified image.
    Finds the closest parent link from `el` and returns the value
    of its `href` attribute, else returns the `src` attribute of
    `el` itself.
    @param {HTMLImageElement} el Source or root image element
    */
    image: function (imageEl) {
      var self = this;

      if (self._.l === imageEl) {
        return self._.s;
      }
      self._.l = imageEl;

      var newS;
      var el = imageEl;
      var els = [];

      while (el && !newS) {
        els.unshift(el);
        el = el.parentNode;

        if (el && el.nodeName === 'A') {
          newS = el.href;
        }
      }

      if (!newS) {
        newS = imageEl.src;
      }
      self._.s = newS;

      return newS;
    },

    /**
    Refresh the loupe position and focus.
    Also used as a mousemove handler.
    @param {MouseEvent} [event] - mousemove event.
    */
    refresh: function () {
      var self = this;
      var style = self.lens.style;
      var event = arguments[0] || self._.e;

      if (event && event.target) {
        style.backgroundImage = 'url("' + self.image(event.target) + '")';
      }

      // Ignore the very first this.move call: it could be a
      // simulated pointer event!
      if (self._.e) {
        var elComputedStyle = getComputedStyle(event.target);
        var loComputedStyle = getComputedStyle(self.lens);

        self.show();

        // Change the loupe position
        style.transform = style.webkitTransform = 'translate(' + event.pageX + 'px,' + event.pageY + 'px)';

        // Adjust zoom level and background size
        self.lens.style.backgroundSize =
          intify(elComputedStyle.width) * self.zoom + 'px ' +
          intify(elComputedStyle.height) * self.zoom + 'px';

        // Change the focal point of the loupe image
        self.lens.style.backgroundPosition =
          (0 - eventOffset(event, 'X') * self.zoom + (intify(loComputedStyle.width) / 2)) + 'px ' +
          (0 - eventOffset(event, 'Y') * self.zoom + (intify(loComputedStyle.height) / 2 | 0)) + 'px';
      }

      self._.e = event;
    },

    /**
    バルス!
    Removes all created elements and event listeners. After
    calling this method, the loupe object can be destroyed
    or garbage collected, or even re-initialized by calling
    the .init method with a different element.
    */
    destroy: function () {
      var self = this;
      var elRemoveListener = self.el.removeEventListener.bind(el);

      // Remove this.lens
      if (self.lens) {
        self.lens.parentNode.removeChild(self.lens);
        self.lens = null;
      }

      // If this.liten was called when the loupe was set up,
      // remove its event listeners during destruction.
      if (self._[_mousemove]) {
        elRemoveListener(_touchstart, self._[_touchstart]);
        elRemoveListener(_pointerdown, self._[_pointerdown]);
        elRemoveListener(_mousemove, self._[_mousemove]);
        elRemoveListener(_mouseout, self._[_mouseout]);
        elRemoveListener(_wheel, self._[_wheel]);
      }

      // Clear _ in case the user wants to re-initialize.
      self._ = {};
    },

    /**
    Sets up event listeners.
    */
    listen: function () {
      var isTouched;
      var self = this;
      var elAddListener = self.el.addEventListener.bind(self.el);

      self._[_touchstart] = function () {
        isTouched = true;
      };

      // IE 11 uses pointer events instead of touch* events
      self._[_pointerdown] = function (event) {
        if (event.pointerType === 'touch') {
          isTouched = true;
        }
      };

      self._[_mousemove] = function (event) {
        if (!isTouched) {
          self.refresh.call(self, event);
        }

        isTouched = false;
      };

      self._[_mouseout] = self.hide.bind(self);

      // Add event listners describing normal x, y movement
      elAddListener(_touchstart, self._[_touchstart]);
      elAddListener(_pointerdown, self._[_pointerdown]);
      elAddListener(_mousemove, self._[_mousemove]);
      elAddListener(_mouseout, self._[_mouseout]);

      // Add event listener describing z (mousewheel) movement
      self._[_wheel] = self.wheel.bind(self);
      elAddListener(_wheel, self._[_wheel]);
    },

    /**
    Wheel event handler to trigger zooming behavior.
    @param {WheelEvent} event - wheel event.
    */
    wheel: function (event) {
      var self = this;
      var zoom;

      if (self.on) {
        zoom = self.zoom + event.deltaY * 0.1;
        zoom = (
          zoom < self.range[0] ?
          self.range[0] :
          (
            zoom > self.range[1] ?
            self.range[1] :
            zoom
          )
        );
        self.zoom = zoom;

        self.refresh(event);

        event.preventDefault();
      }
    }
  };

}(Loupe));
