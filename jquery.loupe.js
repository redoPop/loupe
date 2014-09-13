/**
 * Loupe: a jQuery image magnifier
 * (C) 2010 Joe Bartlett, MIT license
 * http://redoPop.com/loupe
 */
(function ($) {
	$.fn.loupe = function (arg) {
		var options = $.extend({
			loupe: 'loupe',
			width: 200,
			height: 150
		}, arg || {});

		return this.length ? this.each(function () {
			var $this = $(this), $big, $loupe,
				$small = $this.is('img') ? $this : $this.find('img:first'),
				isTouched,
				isUntouched,
				time;

			if ($this.data('loupe') != null) {
				return $this.data('loupe', arg);
			}

			function onTouchStart() {
				isTouched = true;
			}

			function onPointerDown(event) {
				if (event.pointerType === 'touch') {
					onTouchStart();
				}
			}

			function hide() {
				isTouched = false;
				isUntouched = false;
				$loupe.hide();
			}

			function move(e) {
				var os = $small.offset(),
					sW = $small.outerWidth(),
					sH = $small.outerHeight(),
					oW = options.width / 2,
					oH = options.height / 2;

				// Ignore the first movement event -- it could be
				// a simulated mouse event! (Thanks, Android!)
				if (!isUntouched) {
					isUntouched = true;
					return;
				}

				if (
					isTouched ||
					!$this.data('loupe') ||
					e.pageX > sW + os.left + 10 || e.pageX < os.left - 10 ||
					e.pageY > sH + os.top + 10 || e.pageY < os.top - 10) {
					return hide();
				}

				time = time ? clearTimeout(time) : 0;

				$loupe.show().css({
					left: e.pageX - oW,
					top: e.pageY - oH
				});
				$big.css({
					left: -(((e.pageX - os.left) / sW) * $big.width() - oW)|0,
					top: -(((e.pageY - os.top) / sH) * $big.height() - oH)|0
				});
			}

			$loupe = $('<div />')
				.addClass(options.loupe)
				.css({
					width: options.width,
					height: options.height,
					position: 'absolute',
					overflow: 'hidden'
				})
				.append($big = $('<img />').attr('src', $this.attr($this.is('img') ? 'src' : 'href')).css('position', 'absolute'))
				.mousemove(move)
				.mouseleave(hide)
				.hide()
				.appendTo('body');

			$this
				// Prevent touch screens from triggering the loupe
				.on('touchstart', onTouchStart)

				// https://gist.github.com/redoPop/9050999cebcd7e50934a
				.on('pointerdown', onPointerDown)
				.on('MSPointerDown', onPointerDown)

				.data('loupe', true)
				.mousemove(move)
				.mouseout(function () {
					time = setTimeout(hide, 10);
				});
		}) : this;
	};
}(jQuery));
