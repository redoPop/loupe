/**
 * loupe - an image magnifier for jQuery
 * (C) 2010 jdbartlett, MIT license
 * http://github.com/jdbartlett/loupe
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
				move, hide = function () { $loupe.hide(); },
				time, destroy, data;

			data = $this.data('loupe');
			if (data != null) {
				if ('destroy' === arg) {
					return data.destroy();
				}
				
				data.enabled = arg;
				return $this.data('loupe', data);
			} else if ('destroy' === arg) {
				// Nothing to destroy yet
				return;
			}

			move = function (e) {
				var os = $small.offset(),
					sW = $small.outerWidth(),
					sH = $small.outerHeight(),
					oW = options.width / 2,
					oH = options.height / 2;

				if (!$this.data('loupe').enabled ||
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
			};

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
			
			destroy = function() {
				$loupe.remove();
				$this.unbind('.loupe').removeData('loupe');
			};

			$this.data('loupe', {destroy: destroy, enabled: true})
				.bind('mouseenter.loupe', move)
				.bind('mouseout.loupe', function () {
					time = setTimeout(hide, 10);
				});
		}) : this;
	};
}(jQuery));
