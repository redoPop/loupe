QUnit.test('Loupe instance', function (assert) {
  var loupe = new Loupe(new Image());

  assert.equal(typeof loupe, 'object', 'should be an object');
});
