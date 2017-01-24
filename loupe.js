/**
Loupe 2.0.1
https://github.com/redoPop/loupe
*/

(function (root) {
  'use strict';

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
    return event[_offset + axis] === undefined ?
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
      var _this = this;

      // If the browser doesn't support pointer-events,
      // halt loupe's initialization!
      if (!canPoint) {
        return;
      }

      // Create local versions of unshared objects
      _this._ = {};
      _this.range = _this.range.slice(0);

      _this.el = el;

      _this.render();
      _this.listen();
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
      var _this = this;

      _this.lens = document.createElement('div');
      _this.lens.className += ' ' + _this.classes.lens;
      document.body.appendChild(_this.lens);
    },

    /**
    Returns URL to use as a magnified image.
    Finds the closest parent link from `el` and returns the value
    of its `href` attribute, else returns the `src` attribute of
    `el` itself.
    @param {HTMLImageElement} el Source or root image element
    */
    image: function (imageEl) {
      var _this = this;

      if (_this._.l === imageEl) {
        return _this._.s;
      }

      _this._.l = imageEl;

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

      _this._.s = newS;

      return newS;
    },

    /**
    Refresh the loupe position and focus.
    Also used as a mousemove handler.
    @param {MouseEvent} [event] - mousemove event.
    */
    refresh: function () {
      var _this = this;
      var style = _this.lens.style;
      var event = arguments[0] || _this._.e;

      if (event && event.target) {
        style.backgroundImage = 'url("' + _this.image(event.target) + '")';
      }

      // Ignore the very first this.move call: it could be a
      // simulated pointer event!
      if (_this._.e) {
        var elComputedStyle = getComputedStyle(event.target);
        var loComputedStyle = getComputedStyle(_this.lens);

        _this.show();

        // Change the loupe position
        style.transform = style.webkitTransform = 'translate(' +
          event.pageX + 'px,' + event.pageY + 'px)';

        // Adjust zoom level and background size
        _this.lens.style.backgroundSize =
          intify(elComputedStyle.width) * _this.zoom + 'px ' +
          intify(elComputedStyle.height) * _this.zoom + 'px';

        // Change the focal point of the loupe image
        _this.lens.style.backgroundPosition =
          (0 - eventOffset(event, 'X') * _this.zoom +
            (intify(loComputedStyle.width) / 2)) + 'px ' +
          (0 - eventOffset(event, 'Y') * _this.zoom +
            (intify(loComputedStyle.height) / 2 | 0)) + 'px';
      }

      _this._.e = event;
    },

    /**
    バルス!
    Removes all created elements and event listeners. After
    calling this method, the loupe object can be destroyed
    or garbage collected, or even re-initialized by calling
    the .init method with a different element.
    */
    destroy: function () {
      var _this = this;
      var elRemoveListener = _this.el.removeEventListener.bind(_this.el);

      // Remove this.lens
      if (_this.lens) {
        _this.lens.parentNode.removeChild(_this.lens);
        _this.lens = null;
      }

      // If this.listen was called when the loupe was set up,
      // remove its event listeners during destruction.
      if (_this._[_mousemove]) {
        elRemoveListener(_touchstart, _this._[_touchstart]);
        elRemoveListener(_pointerdown, _this._[_pointerdown]);
        elRemoveListener(_mousemove, _this._[_mousemove]);
        elRemoveListener(_mouseout, _this._[_mouseout]);
        elRemoveListener(_wheel, _this._[_wheel]);
      }

      // Clear _ in case the user wants to re-initialize.
      _this._ = {};
    },

    /**
    Sets up event listeners.
    */
    listen: function () {
      var isTouched;
      var _this = this;
      var elAddListener = _this.el.addEventListener.bind(_this.el);

      _this._[_touchstart] = function () {
        isTouched = true;
      };

      // IE 11 uses pointer events instead of touch* events
      _this._[_pointerdown] = function (event) {
        if (event.pointerType === 'touch') {
          isTouched = true;
        }
      };

      _this._[_mousemove] = function (event) {
        if (!isTouched) {
          _this.refresh.call(_this, event);
        }

        isTouched = false;
      };

      _this._[_mouseout] = _this.hide.bind(_this);

      // Add event listners describing normal x, y movement
      elAddListener(_touchstart, _this._[_touchstart]);
      elAddListener(_pointerdown, _this._[_pointerdown]);
      elAddListener(_mousemove, _this._[_mousemove]);
      elAddListener(_mouseout, _this._[_mouseout]);

      // Add event listener describing z (mousewheel) movement
      _this._[_wheel] = _this.wheel.bind(_this);
      elAddListener(_wheel, _this._[_wheel]);
    },

    /**
    Wheel event handler to trigger zooming behavior.
    @param {WheelEvent} event - wheel event.
    */
    wheel: function (event) {
      var _this = this;
      var zoom;

      if (_this.on) {
        zoom = _this.zoom + event.deltaY * 0.1;
        zoom = (
          zoom < _this.range[0] ?
          _this.range[0] :
          (
            zoom > _this.range[1] ?
            _this.range[1] :
            zoom
          )
        );
        _this.zoom = zoom;

        _this.refresh(event);

        event.preventDefault();
      }
    }
  };

  // UMD (based on returnExports.js template)
  // https://github.com/umdjs/umd
  /* globals define, module */
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return Loupe;
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = Loupe;
  } else {
    root.Loupe = Loupe;
  }
}(this));
