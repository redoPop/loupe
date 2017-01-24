var assert = require('assert');
var jsdom = require('mocha-jsdom');

jsdom();

describe('Loupe', function () {
  var Loupe;

  before(function () {
    Loupe = require('../loupe');
  });

  describe('instance', function () {
    var loupe;

    beforeEach(function () {
      loupe = new Loupe(document.createElement('img'));
    })

    it('should be an object', function () {
      assert.equal(typeof loupe, 'object');
    });

    it('should have a lens with the "lens" class', function () {
      assert.ok(loupe.lens.className.includes(loupe.classes.lens));
    });

    describe('show()', function () {
      it('should append the "on" class to the lens', function () {
        loupe.show();
        assert.ok(loupe.lens.className.includes(loupe.classes.lens + ' ' + loupe.classes.on));
      });

      it('should remove the "off" class from the lens', function () {
        loupe.hide();
        loupe.show();
        assert.ok(!loupe.lens.className.includes(loupe.classes.off));
      });
    });

    describe('hide()', function () {
      it('should append the "off" class to the lens', function () {
        loupe.hide();
        assert.ok(loupe.lens.className.includes(loupe.classes.lens + ' ' + loupe.classes.off));
      });

      it('should remove the "on" class from the lens', function () {
        loupe.show();
        loupe.hide();
        assert.ok(!loupe.lens.className.includes(loupe.classes.on));
      });
    });
  });
});
