describe('Loupe', function () {
  describe('instance', function () {
    var loupe = new Loupe(new Image());

    it('should be an object', function () {
      expect(loupe).toEqual(jasmine.any(Object));
    });
  });
});
