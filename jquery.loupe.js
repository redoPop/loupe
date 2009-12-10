/**
 * loupe - an image magnifier for jQuery
 * http://github.com/jdbartlett/loupe
 */
(function($) {
	$.fn.loupe = function(options) {
		if (!this.length) return this;
		options = $.extend({loupe:'loupe', width:200, height:150}, options || {});

		this.each(function() {
			var $this = $(this), loupe = null, big = null, small = null, time = null,
			hide = function() {loupe.hide()},
			move = function(e) {
				var os = small.offset(), sW = small.width(), sH = small.height(), oW = options.width/2, oH = options.height/2;
				if (e.pageX > sW + os.left + 10 || e.pageX < os.left - 10 ||
					e.pageY > sH + os.top + 10 || e.pageY < os.top - 10) return hide();
				if (time && clearTimeout(time)) time = null;
				loupe.css({left:e.pageX - oW, top:e.pageY - oH});
				big.css({
					left:-(((e.pageX - os.left) / sW) * big.width() - oW)|0,
					top:-(((e.pageY - os.top) / sH) * big.height() - oH)|0
				});
			};

			$this.mouseenter(function(e) {
				if (!small) small = $this.is('img') ? $this : $this.find('img:first');
				loupe = (loupe || (loupe = $('<div></div>').addClass(options.loupe)
					.css({
						width:options.width, height:options.height,
						position:'absolute', overflow:'hidden'
					})
					.append(big = $('<img src="' + $this.attr($this.is('img') ? 'src' : 'href') + '" />').css({position:'absolute'}))
					.mousemove(move).appendTo('body')
				)).show(); move(e);
			}).mouseout(function() {time = setTimeout(hide, 10)});
		});

		return this;
	}
})(jQuery);