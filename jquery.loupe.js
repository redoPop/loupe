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
				tmove, move, hide = function () { $loupe.hide(); },
				time;

			if ($this.data('loupe') != null) {
				return $this.data('loupe', arg);
			}

			tmove = function(e) {
				var eMouse = null;
				
				if(e !== null && typeof(e.originalEvent.targetTouches)!='undefined' &&
					e.originalEvent.targetTouches.length>0)
				{
					var objTouch = e.originalEvent.targetTouches[e.originalEvent.targetTouches.length-1];
					
					if(objTouch!==null)
					{
						if(typeof(objTouch.pageX)!='undefined' && !isNaN(objTouch.pageX))
						{
							eMouse = 
								{ 
									pageX: objTouch.pageX,
									pageY: objTouch.pageY
								};
						}
						else if(typeof(objTouch.clientX)!='undefined' && !isNaN(objTouch.clientX))
						{
							eMouse = 
								{ 
									pageX: objTouch.clientX,
									pageY: objTouch.clientY
								};
						}
						else if(typeof(objTouch.screenX)!='undefined' && !isNaN(objTouch.screenX))
						{
							eMouse = 
								{ 
									pageX: objTouch.screenX,
									pageY: objTouch.screenY
								};
						}
					}
				}

				if(eMouse!==null)
				{
					e.preventDefault();
					return move(eMouse);
				}
				else
					return hide();
			};

			move = function (e) {
				var os = $small.offset(),
					sW = $small.outerWidth(),
					sH = $small.outerHeight(),
					oW = options.width / 2,
					oH = options.height / 2;

				if (!$this.data('loupe') ||
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
				.on('touchstart touchmove', tmove)
				.hide()
				.appendTo('body');

			$this.data('loupe', true)
				.mouseenter(move)
				.on('touchstart touchenter touchmove', tmove)
				.on('mouseout touchend touchleave touchcancel', function () {
					time = setTimeout(hide, 10);
				});
		}) : this;
	};
}(jQuery));
