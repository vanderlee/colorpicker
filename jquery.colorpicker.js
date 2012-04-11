/*jslint devel: true, bitwise: true, regexp: true, browser: true, confusion: true, unparam: true, eqeq: true, white: true, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
/*globals jQuery */

/*
 * ColorPicker v0.6.5
 *
 * Copyright (c) 2011-2012 Martijn W. van der Lee
 * Licensed under the MIT.
 *
 * Full-featured colorpicker for jQueryUI with full theming support.
 * Most images from jPicker by Christopher T. Tillman.
 * Sourcecode created from scratch by Martijn W. van der Lee.
 *
 * @todo Undo/redo memory?
 * @todo Small size variant (128x128)
 * @todo Distance between rgb/hsv/a options
 * @todo Shared swatches; cookies/session/global
 * @todo isRTL? What to RTL, besides button?
 * @todo Implement 'disabled' option
 * @todo Split inputs into rgb/hsv/a parts
 * @todo Modal popup mode
 * @todo Special rendering mode for color_none?
 * @todo closeOnEscape
 * @todo What to do with this.changed?
 */

(function ($) {
	"use strict";

	$.colorpicker = new function() {
		this.regional = [];
		this.regional[''] =	{
			done:			'Done',
			none:			'None',
			revert:			'Color',
			button:			'Color',
			title:			'Pick a color',
			transparent:	'Transparent',
			hueShort:		'H',
			saturationShort:'S',
			valueShort:		'V',
			redShort:		'R',
			greenShort:		'G',
			blueShort:		'B',
			alphaShort:		'A'
		};
	};

	var _container_popup = '<div class="ui-colorpicker ui-colorpicker-dialog ui-dialog ui-widget ui-widget-content ui-corner-all" style="display: none;"></div>',

		_container_inline = '<div class="ui-colorpicker ui-colorpicker-inline ui-dialog ui-widget ui-widget-content ui-corner-all"></div>',

		_parts_lists = {
			'full':		['header', 'map', 'bar', 'hex', 'inputs', 'preview', 'swatches', 'footer'],
			'popup':	['map', 'bar', 'hex', 'inputs', 'preview', 'footer'],
			'inline':	['map', 'bar', 'hex', 'inputs', 'preview']
		},

		_colors = {
			'black': [0x00, 0x00, 0x00],
			'dimgray': [0x69, 0x69, 0x69],
			'gray': [0x80, 0x80, 0x80],
			'darkgray': [0xa9, 0xa9, 0xa9],
			'silver': [0xc0, 0xc0, 0xc0],
			'lightgrey': [0xd3, 0xd3, 0xd3],
			'gainsboro': [0xdc, 0xdc, 0xdc],
			'whitesmoke': [0xf5, 0xf5, 0xf5],
			'white': [0xff, 0xff, 0xff],
			'rosybrown': [0xbc, 0x8f, 0x8f],
			'indianred': [0xcd, 0x5c, 0x5c],
			'brown': [0xa5, 0x2a, 0x2a],
			'firebrick': [0xb2, 0x22, 0x22],
			'lightcoral': [0xf0, 0x80, 0x80],
			'maroon': [0x80, 0x00, 0x00],
			'darkred': [0x8b, 0x00, 0x00],
			'red': [0xff, 0x00, 0x00],
			'snow': [0xff, 0xfa, 0xfa],
			'salmon': [0xfa, 0x80, 0x72],
			'mistyrose': [0xff, 0xe4, 0xe1],
			'tomato': [0xff, 0x63, 0x47],
			'darksalmon': [0xe9, 0x96, 0x7a],
			'orangered': [0xff, 0x45, 0x00],
			'coral': [0xff, 0x7f, 0x50],
			'lightsalmon': [0xff, 0xa0, 0x7a],
			'sienna': [0xa0, 0x52, 0x2d],
			'seashell': [0xff, 0xf5, 0xee],
			'chocolate': [0xd2, 0x69, 0x1e],
			'saddlebrown': [0x8b, 0x45, 0x13],
			'sandybrown': [0xf4, 0xa4, 0x60],
			'peachpuff': [0xff, 0xda, 0xb9],
			'peru': [0xcd, 0x85, 0x3f],
			'linen': [0xfa, 0xf0, 0xe6],
			'darkorange': [0xff, 0x8c, 0x00],
			'bisque': [0xff, 0xe4, 0xc4],
			'burlywood': [0xde, 0xb8, 0x87],
			'tan': [0xd2, 0xb4, 0x8c],
			'antiquewhite': [0xfa, 0xeb, 0xd7],
			'navajowhite': [0xff, 0xde, 0xad],
			'blanchedalmond': [0xff, 0xeb, 0xcd],
			'papayawhip': [0xff, 0xef, 0xd5],
			'orange': [0xff, 0xa5, 0x00],
			'moccasin': [0xff, 0xe4, 0xb5],
			'wheat': [0xf5, 0xde, 0xb3],
			'oldlace': [0xfd, 0xf5, 0xe6],
			'floralwhite': [0xff, 0xfa, 0xf0],
			'goldenrod': [0xda, 0xa5, 0x20],
			'darkgoldenrod': [0xb8, 0x86, 0x0b],
			'cornsilk': [0xff, 0xf8, 0xdc],
			'gold': [0xff, 0xd7, 0x00],
			'palegoldenrod': [0xee, 0xe8, 0xaa],
			'khaki': [0xf0, 0xe6, 0x8c],
			'lemonchiffon': [0xff, 0xfa, 0xcd],
			'darkkhaki': [0xbd, 0xb7, 0x6b],
			'beige': [0xf5, 0xf5, 0xdc],
			'lightgoldenrodyellow': [0xfa, 0xfa, 0xd2],
			'olive': [0x80, 0x80, 0x00],
			'yellow': [0xff, 0xff, 0x00],
			'lightyellow': [0xff, 0xff, 0xe0],
			'ivory': [0xff, 0xff, 0xf0],
			'olivedrab': [0x6b, 0x8e, 0x23],
			'yellowgreen': [0x9a, 0xcd, 0x32],
			'darkolivegreen': [0x55, 0x6b, 0x2f],
			'greenyellow': [0xad, 0xff, 0x2f],
			'lawngreen': [0x7c, 0xfc, 0x00],
			'chartreuse': [0x7f, 0xff, 0x00],
			'darkseagreen': [0x8f, 0xbc, 0x8f],
			'forestgreen': [0x22, 0x8b, 0x22],
			'limegreen': [0x32, 0xcd, 0x32],
			'lightgreen': [0x90, 0xee, 0x90],
			'palegreen': [0x98, 0xfb, 0x98],
			'darkgreen': [0x00, 0x64, 0x00],
			'green': [0x00, 0x80, 0x00],
			'lime': [0x00, 0xff, 0x00],
			'honeydew': [0xf0, 0xff, 0xf0],
			'mediumseagreen': [0x3c, 0xb3, 0x71],
			'seagreen': [0x2e, 0x8b, 0x57],
			'springgreen': [0x00, 0xff, 0x7f],
			'mintcream': [0xf5, 0xff, 0xfa],
			'mediumspringgreen': [0x00, 0xfa, 0x9a],
			'mediumaquamarine': [0x66, 0xcd, 0xaa],
			'aquamarine': [0x7f, 0xff, 0xd4],
			'turquoise': [0x40, 0xe0, 0xd0],
			'lightseagreen': [0x20, 0xb2, 0xaa],
			'mediumturquoise': [0x48, 0xd1, 0xcc],
			'darkslategray': [0x2f, 0x4f, 0x4f],
			'paleturquoise': [0xaf, 0xee, 0xee],
			'teal': [0x00, 0x80, 0x80],
			'darkcyan': [0x00, 0x8b, 0x8b],
			'darkturquoise': [0x00, 0xce, 0xd1],
			'aqua': [0x00, 0xff, 0xff],
			'cyan': [0x00, 0xff, 0xff],
			'lightcyan': [0xe0, 0xff, 0xff],
			'azure': [0xf0, 0xff, 0xff],
			'cadetblue': [0x5f, 0x9e, 0xa0],
			'powderblue': [0xb0, 0xe0, 0xe6],
			'lightblue': [0xad, 0xd8, 0xe6],
			'deepskyblue': [0x00, 0xbf, 0xff],
			'skyblue': [0x87, 0xce, 0xeb],
			'lightskyblue': [0x87, 0xce, 0xfa],
			'steelblue': [0x46, 0x82, 0xb4],
			'aliceblue': [0xf0, 0xf8, 0xff],
			'dodgerblue': [0x1e, 0x90, 0xff],
			'slategray': [0x70, 0x80, 0x90],
			'lightslategray': [0x77, 0x88, 0x99],
			'lightsteelblue': [0xb0, 0xc4, 0xde],
			'cornflowerblue': [0x64, 0x95, 0xed],
			'royalblue': [0x41, 0x69, 0xe1],
			'midnightblue': [0x19, 0x19, 0x70],
			'lavender': [0xe6, 0xe6, 0xfa],
			'navy': [0x00, 0x00, 0x80],
			'darkblue': [0x00, 0x00, 0x8b],
			'mediumblue': [0x00, 0x00, 0xcd],
			'blue': [0x00, 0x00, 0xff],
			'ghostwhite': [0xf8, 0xf8, 0xff],
			'darkslateblue': [0x48, 0x3d, 0x8b],
			'slateblue': [0x6a, 0x5a, 0xcd],
			'mediumslateblue': [0x7b, 0x68, 0xee],
			'mediumpurple': [0x93, 0x70, 0xdb],
			'blueviolet': [0x8a, 0x2b, 0xe2],
			'indigo': [0x4b, 0x00, 0x82],
			'darkorchid': [0x99, 0x32, 0xcc],
			'darkviolet': [0x94, 0x00, 0xd3],
			'mediumorchid': [0xba, 0x55, 0xd3],
			'thistle': [0xd8, 0xbf, 0xd8],
			'plum': [0xdd, 0xa0, 0xdd],
			'violet': [0xee, 0x82, 0xee],
			'purple': [0x80, 0x00, 0x80],
			'darkmagenta': [0x8b, 0x00, 0x8b],
			'magenta': [0xff, 0x00, 0xff],
			'fuchsia': [0xff, 0x00, 0xff],
			'orchid': [0xda, 0x70, 0xd6],
			'mediumvioletred': [0xc7, 0x15, 0x85],
			'deeppink': [0xff, 0x14, 0x93],
			'hotpink': [0xff, 0x69, 0xb4],
			'palevioletred': [0xdb, 0x70, 0x93],
			'lavenderblush': [0xff, 0xf0, 0xf5],
			'crimson': [0xdc, 0x14, 0x3c],
			'pink': [0xff, 0xc0, 0xcb],
			'lightpink': [0xff, 0xb6, 0xc1]
		};

	$.widget("vanderlee.colorpicker", {
		options: {
			alpha:				false,		// Show alpha controls and mode
			altAlpha:			true,		// change opacity of altField as well?
			altField:			'',			// selector for DOM elements which change background color on change.
			altOnChange:		true,		// true to update on each change, false to update only on close.
			altProperties:		'background-color',	// comma separated list of any of 'background-color', 'color', 'border-color', 'outline-color'
			autoOpen:			false,		// Open dialog automatically upon creation
			buttonColorize:		false,
			buttonImage:		'images/ui-colorpicker.png',
			buttonImageOnly:	false,
			buttonText:			null,	// Text on the button and/or title of button image.
			closeOnOutside:		true,		// Close the dialog when clicking outside the dialog (not for inline)
			color:				'#00FF00',	// Initial color (for inline only)
			duration:			'fast',
			hsv:				true,		// Show HSV controls and modes
			regional:			'',
			layout: {
				map:		[0, 0, 1, 3],	// Left, Top, Width, Height (in table cells).
				bar:		[1, 0, 1, 3],
				preview:	[2, 0, 1, 1],
				inputs:		[2, 1, 1, 1],
				hex:		[2, 2, 1, 1],
				swatches:	[3, 0, 1, 3]
			},
			limit:				'',			// Limit color "resolution": '', 'websafe', 'nibble', 'binary'
			mode:				'h',		// Initial editing mode, h, s, v, r, g, b or a
			parts:				'',			// leave empty for automatic selection
			rgb:				true,		// Show RGB controls and modes
			showAnim:			'fadeIn',
			showNoneButton:		false,
			showOn:				'focus',	// 'focus', 'button', 'both'
			showOptions:		{},
			swatches:			null,
			title:				null,
			zIndex:				null,

			onClose:			null,
			onSelect:			null
		},

		_create: function () {
			var self = this;

			self.color_none = false;

			self.opened		= false;
			self.generated	= false;
			self.inline		= false;
			self.changed	= false;

			self.dialog		= null;
			self.button		= null;
			self.image		= null;

			self.mode		= self.options.mode;

			if (self.options.swatches === null) {
				self.options.swatches = _colors;
			}

			if (this.element[0].nodeName.toLowerCase() === 'input') {
				self.options.color = self.element.val();
				self._loadColor();

				$('body').append(_container_popup);
				self.dialog = $('.ui-colorpicker:last');

				// Click outside/inside
				$(document).mousedown(function (event) {
					if (!self.opened || event.target === self.element[0]) {
						return;
					}

					// Check if clicked on any part of dialog
					if ($(event.target).parents('.ui-colorpicker').length > 0) {
						self.element.blur();	// inside window!
						return;
					}

					// Check if clicked on button
					var p,
						parents = $(event.target).parents();
					for (p in parents) {
						if (self.button !== null && parents[p] === self.button[0]) {
							return;
						}
					}

					// no closeOnOutside
					if (!self.options.closeOnOutside) {
						return;
					}

					self.close();
				});

				if (self.options.showOn === 'focus' || self.options.showOn === 'both') {
					self.element.focus(function () {
						self.open();
					});
				}
				if (self.options.showOn === 'button' || self.options.showOn === 'both') {
					if (self.options.buttonImage !== '') {
						var text = self.options.buttonText ? self.options.buttonText : self._getRegional('button');

						self.image = $('<img/>').attr({
							'src':		self.options.buttonImage,
							'alt':		text,
							'title':	text
						});

						self._setImageBackground();
					}

					if (self.options.buttonImageOnly && self.image) {
						self.button = self.image;
					} else {
						self.button = $('<button type="button"></button>').html(self.image || self.options.buttonText).button();
						self.image = self.image ? $('img', self.button).first() : null;
					}
					self.button.insertAfter(self.element).click(function () {
						self[self.opened ? 'close' : 'open']();
					});
				}

				if (self.options.autoOpen) {
					self.open();
				}

				self.element.keydown(function (event) {
					if (event.keyCode === 9) {
						self.close();
					}
				}).keyup(function (event) {
					var rgb = self._parseHex(self.element.val());
					if (rgb) {
						self.color = (rgb === false ? new self.Color() : new self.Color(rgb[0], rgb[1], rgb[2]));
						self._change();
					}
				});
			} else {
				self.inline = true;

				$(this.element).html(_container_inline);
				self.dialog = $('.ui-colorpicker', this.element);

				self._generate();

				self.opened = true;
			}

			return this;
		},

		destroy: function() {
			this.element.unbind();

			if (this.image !== null) {
				this.image.remove();
			}

			if (this.button !== null) {
				this.button.remove();
			}

			if (this.dialog !== null) {
				this.dialog.remove();
			}
		},

		_setOption: function(key, value){
			var self = this;

			switch (key) {
			case "disabled":
				if (value) {
					self.dialog.addClass('ui-colorpicker-disabled');
				} else {
					self.dialog.removeClass('ui-colorpicker-disabled');
				}
				break;
			}

			$.Widget.prototype._setOption.apply(self, arguments);
		},

		_setAltField: function () {
			if (this.options.altOnChange && this.options.altField && this.options.altProperties) {
				var index,
					property,
					properties = this.options.altProperties.split(',');

				for (index in properties) {
					property = $.trim(properties[index]);
					switch (property) {
						case 'color':
						case 'background-color':
						case 'outline-color':
						case 'border-color':
							$(this.options.altField).css(property, this.color_none? '' : this.color.toCSS());
							break;
					}
				}

				if (this.options.altAlpha) {
					$(this.options.altField).css('opacity', this.color_none? '' : this.color.a);
				}
			}
		},

		_loadColor: function () {
			if(!this.color) {
				var rgb = this._parseColor(this.options.color);
				this.color = (rgb === false ? new this.Color() : new this.Color(rgb[0], rgb[1], rgb[2], rgb[3]));
				this.color_none = (rgb === false);
				this.currentColor = $.extend({}, this.color);
			}

			this._setAltField();
		},

		_generate: function () {
			var self = this,
				index,
				part,
				parts_list;

			// Determine the parts to include in this colorpicker
			if (typeof self.options.parts === 'string') {
				if (self.options.parts in _parts_lists) {
					parts_list = _parts_lists[self.options.parts];
				} else {
					// automatic
					parts_list = _parts_lists[self.inline ? 'inline' : 'popup'];
				}
			} else {
				parts_list = self.options.parts;
			}

			// Add any parts to the internal parts list
			self.parts = {};
			for (index in parts_list) {
				part = parts_list[index];
				if (part in self._parts) {
					self.parts[part] = new self._parts[part](self);
				}
			}

			self._loadColor();

			if (!self.generated) {
				var layout_parts = [];

				for (index in self.options.layout) {
					if (index in self.parts) {
						layout_parts.push({
							part: index,
							pos: self.options.layout[index]
						});
					}
				}

				$(self._layoutTable(layout_parts, function(cell, x, y) {
					var classes = [];

					if (x > 0) {
						classes.push('ui-colorpicker-padding-left');
					}

					if (y > 0) {
						classes.push('ui-colorpicker-padding-top');
					}

					return '<td id="ui-colorpicker-' + cell.part + '-container"'
						+ (cell.pos[2] > 1 ? ' colspan="' + cell.pos[2] + '"' : '')
						+ (cell.pos[3] > 1 ? ' rowspan="' + cell.pos[3] + '"' : '')
						+ (classes.length > 0 ? ' class="' + classes.join(' ') + '"' : '')
						+ ' valign="top"></td>';
				})).appendTo(self.dialog).addClass('ui-dialog-content ui-widget-content');

				self._initAllParts();
				self._generateAllParts();
				self.generated = true;
			}
		},

		_layoutTable: function(layout, callback) {
			var layout = layout.sort(function(a, b) {
					if (a.pos[1] == b.pos[1]) {
						return a.pos[0] - b.pos[0];
					}
					return a.pos[1] - b.pos[1];
				}),
				bitmap,
				x,
				y,
				width, height,
				columns, rows,
				index,
				cell,
				html;

			// Determine dimensions of the table
			width = 0;
			height = 0;
			for (index in layout) {
				width = Math.max(width, layout[index].pos[0] + layout[index].pos[2]);
				height = Math.max(height, layout[index].pos[1] + layout[index].pos[3]);
			}

			// Initialize bitmap
			bitmap = [];
			for (x = 0; x < width; ++x) {
				bitmap.push(new Array(height));
			}

			// Mark rows and columns which have layout assigned
			rows	= new Array(height);
			columns = new Array(width);
			for (index in layout) {
				// mark columns
				for (x = 0; x < layout[index].pos[2]; x += 1) {
					columns[layout[index].pos[0] + x] = true;
				}
				for (y = 0; y < layout[index].pos[3]; y += 1) {
					rows[layout[index].pos[1] + y] = true;
				}
			}

			// Generate the table
			html = '';
			cell = layout[index = 0];
			for (y = 0; y < height; ++y) {
				html += '<tr>';
				for (x = 0; x < width;) {
					if (cell !== undefined && x == cell.pos[0] && y == cell.pos[1]) {
						// Create a "real" cell
						var w,
							h;

						html += callback(cell, x, y);

						for (h = 0; h < cell.pos[3]; h +=1) {
							for (w = 0; w < cell.pos[2]; w +=1) {
								bitmap[x + w][y + h] = true;
							}
						}

						x += cell.pos[2];
						cell = layout[++index];
					} else {
						// Fill in the gaps
						var colspan = 0;
						var walked = false;

						while (x < width && bitmap[x][y] === undefined && (cell === undefined || y < cell.pos[1] || (y == cell.pos[1] && x < cell.pos[0]))) {
							if (columns[x] === true) {
								colspan += 1;
							}
							walked = true;
							x += 1;
						}

						if (colspan > 0) {
							html += '<td colspan="'+colspan+'"></td>';
						} else if (!walked) {
							x += 1;
						}
					}
				}
				html += '</tr>';
			}

			return '<table cellspacing="0" cellpadding="0" border="0"><tbody>' + html + '</tbody></table>';
		},

		_effectGeneric: function (show, slide, fade, callback) {
			var self = this;

			if ($.effects && $.effects[self.options.showAnim]) {
				self.dialog[show](self.options.showAnim, self.options.showOptions, self.options.duration, callback);
			} else {
				self.dialog[(self.options.showAnim === 'slideDown' ?
								slide
							:	(self.options.showAnim === 'fadeIn' ?
									fade
								:	show))]((self.options.showAnim ? self.options.duration : null), callback);
				if (!self.options.showAnim || !self.options.duration) {
					callback();
				}
			}
		},

		_effectShow: function (callback) {
			this._effectGeneric('show', 'slideDown', 'fadeIn', callback);
		},

		_effectHide: function (callback) {
			this._effectGeneric('hide', 'slideUp', 'fadeOut', callback);
		},

		open: function () {
			if (!this.opened) {
				if (this.options.zIndex) {
					this.dialog.css('z-index', this.options.zIndex);
				}

				this._generate();

				this._change();		//@todo side-effects

				var offset = this.element.offset(),
					x = offset.left,
					y = offset.top + this.element.outerHeight();
				x -= Math.max(0, (x + this.dialog.width()) - $(window).width() + 20);
				y -= Math.max(0, (y + this.dialog.height()) - $(window).height() + 20);
				this.dialog.css({'left': x, 'top': y});

				this._effectShow();
				this.opened = true;

				var self = this;
				// Without waiting for domready the width of the map is 0 and we
				// wind up with the cursor stuck in the upper left corner
				$(function() {
					$.each(self.parts, function (index, part) {
						part.repaint();
					});
				});
			}
		},

		_setImageBackground: function() {
			if (this.image && this.options.buttonColorize) {
				this.image.css('background-color', this.color_none? '' : this.color.toCSS());
			}
		},

		close: function () {
			var self = this;

			// update colors
			//this.element.val(self.color_none ? '' : this.color.toHex());
			//this._setImageBackground();
			//this._setAltField();

			this.currentColor	= $.extend({}, this.color);
			this.changed		= false;

			// tear down the interface
			this._effectHide(function () {
				if (self.options.zIndex) {
					self.dialog.css('z-index', '');
				}

				self.dialog.empty();
				self.generated	= false;

				self.opened		= false;
				self._callback(self.options.onClose);
			});
		},

		setColor: function(c) {
			var rgb = this._parseColor(c);
			if (rgb !== false) {
				this.color = new this.Color(rgb[0], rgb[1], rgb[2], rgb[3]);
				this.color_none = false;
				this.currentColor = $.extend({}, this.color);
				this._change();
			}
		},

		_callback: function (f) {
			var self = this;

			if (f instanceof Function) {
				if (self.color_none) {
					f('', {
						r: 0,
						g: 0,
						b: 0,
						a: 0
					}, self);
				} else {
					f(self.color.toCSS(), {
						r: self.color.r,
						g: self.color.g,
						b: self.color.b,
						a: self.color.a
					}, self);
				}
			}
		},

		_generateAllParts: function () {
			$.each(this.parts, function (index, part) {
				part.generate();
			});
		},

		_initAllParts: function () {
			$.each(this.parts, function (index, part) {
				part.init();
			});
		},

		_limit: function() {
			switch (this.options.limit) {
			case 'websafe':
				this.color.limit(6);
				break;

			case 'nibble':
				this.color.limit(16);
				break;

			case 'binary':
				this.color.limit(2);
				break;
			}
		},

		_change: function (no_color) {
			this.color_none = no_color === true;

			this.changed = true;

			this._limit();

			// update colors
			if (!this.inline) {
				if (this.color_none) {
					this.element.val('');
				} else if(!this.color.equals(this._parseHex(this.element.val()))) {
					this.element.val(this.color.toHex());
				}

				this._setImageBackground();
				this._setAltField();
			}

			if (this.opened) {
				$.each(this.parts, function (index, part) {
					part.repaint();
				});
			}

			// callback
			this._callback(this.options.onSelect);
		},

		_intToHex: function (dec) {
			var result = Math.round(dec).toString(16);
			if (result.length === 1) {
				result = ('0' + result);
			}
			return result.toLowerCase();
		},

		// This will be deprecated by jQueryUI 1.9 widget
		_hoverable: function (e) {
			e.hover(function () {
				e.addClass("ui-state-hover");
			}, function () {
				e.removeClass("ui-state-hover");
			});
		},

		// This will be deprecated by jQueryUI 1.9 widget
		_focusable: function (e) {
			e.focus(function () {
				e.addClass("ui-state-focus");
			}).blur(function () {
				e.removeClass("ui-state-focus");
			});
		},

		_getRegional: function(name) {
			return $.colorpicker.regional[this.options.regional][name] !== undefined ?
				$.colorpicker.regional[this.options.regional][name] : $.colorpicker.regional[''][name];
		},

		_parts: {
			header: function (inst) {
				var self = this,
					e = null,
					_html;

				_html = function () {
					var title = inst.options.title ? inst.options.title :  inst._getRegional('title');

					return '<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">'
						+ '<span class="ui-dialog-title">' + title + '</span>'
						+ '<a href="#" class="ui-dialog-titlebar-close ui-corner-all" role="button">'
						+ '<span class="ui-icon ui-icon-closethick">close</span></a></div>';
				};

				this.init = function () {
					e = $(_html()).prependTo(inst.dialog);
					var close = $('.ui-dialog-titlebar-close', e);
					inst._hoverable(close);
					inst._focusable(close);

					close.click( function() {
						inst.close()
					});
				};

				this.repaint = function () {
				};

				this.generate = function () {
					this.repaint();
				};
			},

			map: function (inst) {
				var self	= this,
					e		= null,
					_mousedown, _mouseup, _mousemove, _html;

				_mousedown = function (event) {
					if (!inst.opened) {
						return;
					}

					var div		= $('#ui-colorpicker-map-layer-pointer', e),
						offset	= div.offset(),
						width	= div.width(),
						height	= div.height(),
						x		= event.pageX - offset.left,
						y		= event.pageY - offset.top;

					if (x >= 0 && x < width && y >= 0 && y < height) {
						event.stopImmediatePropagation();
						event.preventDefault();
						$(document).unbind('mousedown', _mousedown);
						$(document).bind('mouseup', _mouseup);
						$(document).bind('mousemove', _mousemove);
						_mousemove(event);
					}
				};

				_mouseup = function (event) {
					event.stopImmediatePropagation();
					event.preventDefault();
					$(document).unbind('mouseup', _mouseup);
					$(document).unbind('mousemove', _mousemove);
					$(document).bind('mousedown', _mousedown);
				};

				_mousemove = function (event) {
					event.stopImmediatePropagation();
					event.preventDefault();

					if (event.pageX === self.x && event.pageY === self.y) {
						return;
					}
					self.x = event.pageX;
					self.y = event.pageY;

					var div = $('#ui-colorpicker-map-layer-pointer', e),
						offset = div.offset(),
						width = div.width(),
						height = div.height(),
						x = event.pageX - offset.left,
						y = event.pageY - offset.top;

					x = Math.max(0, Math.min(x / width, 1));
					y = Math.max(0, Math.min(y / height, 1));

					// interpret values
					switch (inst.mode) {
					case 'h':
						inst.color.s = x;
						inst.color.v = 1 - y;
						inst.color.updateRGB();
						break;

					case 's':
					case 'a':
						inst.color.h = x;
						inst.color.v = 1 - y;
						inst.color.updateRGB();
						break;

					case 'v':
						inst.color.h = x;
						inst.color.s = 1 - y;
						inst.color.updateRGB();
						break;

					case 'r':
						inst.color.b = x;
						inst.color.g = 1 - y;
						inst.color.updateHSV();
						break;

					case 'g':
						inst.color.b = x;
						inst.color.r = 1 - y;
						inst.color.updateHSV();
						break;

					case 'b':
						inst.color.r = x;
						inst.color.g = 1 - y;
						inst.color.updateHSV();
						break;
					}

					inst._change();
				};

				_html = function () {
					var html = '<div id="ui-colorpicker-map" class="ui-colorpicker-border">'
							+ '<span id="ui-colorpicker-map-layer-1">&nbsp;</span>'
							+ '<span id="ui-colorpicker-map-layer-2">&nbsp;</span>'
							+ (inst.options.alpha ? '<span id="ui-colorpicker-map-layer-alpha">&nbsp;</span>' : '')
							+ '<span id="ui-colorpicker-map-layer-pointer"><span id="ui-colorpicker-map-pointer"></span></span></div>';
					return html;
				};

				this.generate = function () {
					switch (inst.mode) {
					case 'h':
						$('#ui-colorpicker-map-layer-1', e).css({'background-position': '0 0', 'opacity': ''}).show();
						$('#ui-colorcasepicker-map-layer-2', e).hide();
						break;

					case 's':
					case 'a':
						$('#ui-colorpicker-map-layer-1', e).css({'background-position': '0 -260px', 'opacity': ''}).show();
						$('#ui-colorpicker-map-layer-2', e).css({'background-position': '0 -520px', 'opacity': ''}).show();
						break;

					case 'v':
						$(e).css('background-color', 'black');
						$('#ui-colorpicker-map-layer-1', e).css({'background-position': '0 -780px', 'opacity': ''}).show();
						$('#ui-colorpicker-map-layer-2', e).hide();
						break;

					case 'r':
						$('#ui-colorpicker-map-layer-1', e).css({'background-position': '0 -1040px', 'opacity': ''}).show();
						$('#ui-colorpicker-map-layer-2', e).css({'background-position': '0 -1300px', 'opacity': ''}).show();
						break;

					case 'g':
						$('#ui-colorpicker-map-layer-1', e).css({'background-position': '0 -1560px', 'opacity': ''}).show();
						$('#ui-colorpicker-map-layer-2', e).css({'background-position': '0 -1820px', 'opacity': ''}).show();
						break;

					case 'b':
						$('#ui-colorpicker-map-layer-1', e).css({'background-position': '0 -2080px', 'opacity': ''}).show();
						$('#ui-colorpicker-map-layer-2', e).css({'background-position': '0 -2340px', 'opacity': ''}).show();
						break;
					}
					self.repaint();
				};

				this.repaint = function () {
					var div = $('#ui-colorpicker-map-layer-pointer', e),
						x = 0,
						y = 0;

					switch (inst.mode) {
					case 'h':
						x = inst.color.s * div.width();
						y = (1 - inst.color.v) * div.width();
						$(e).css('background-color', inst.color.normClone().toCSS());
						break;

					case 's':
					case 'a':
						x = inst.color.h * div.width();
						y = (1 - inst.color.v) * div.width();
						$('#ui-colorpicker-map-layer-2', e).css('opacity', 1 - inst.color.s);
						break;

					case 'v':
						x = inst.color.h * div.width();
						y = (1 - inst.color.s) * div.width();
						$('#ui-colorpicker-map-layer-1', e).css('opacity', inst.color.v);
						break;

					case 'r':
						x = inst.color.b * div.width();
						y = (1 - inst.color.g) * div.width();
						$('#ui-colorpicker-map-layer-2', e).css('opacity', inst.color.r);
						break;

					case 'g':
						x = inst.color.b * div.width();
						y = (1 - inst.color.r) * div.width();
						$('#ui-colorpicker-map-layer-2', e).css('opacity', inst.color.g);
						break;

					case 'b':
						x = inst.color.r * div.width();
						y = (1 - inst.color.g) * div.width();
						$('#ui-colorpicker-map-layer-2', e).css('opacity', inst.color.b);
						break;
					}

					if (inst.options.alpha) {
						$('#ui-colorpicker-map-layer-alpha', e).css('opacity', 1 - inst.color.a);
					}

					$('#ui-colorpicker-map-pointer', e).css({
						'left': x - 7,
						'top': y - 7
					});
				};

				this.init = function () {
					e = $(_html()).appendTo($('#ui-colorpicker-map-container', inst.dialog));

					e.bind('mousedown', _mousedown);
				};
			},

			bar: function (inst) {
				var self		= this,
					e			= null,
					_mousedown, _mouseup, _mousemove, _html;

				_mousedown = function (event) {
					if (!inst.opened) {
						return;
					}

					var div		= $('#ui-colorpicker-bar-layer-pointer', e),
						offset	= div.offset(),
						width	= div.width(),
						height	= div.height(),
						x		= event.pageX - offset.left,
						y		= event.pageY - offset.top;

					if (x >= 0 && x < width && y >= 0 && y < height) {
						event.stopImmediatePropagation();
						event.preventDefault();
						$(document).unbind('mousedown', _mousedown);
						$(document).bind('mouseup', _mouseup);
						$(document).bind('mousemove', _mousemove);
						_mousemove(event);
					}
				};

				_mouseup = function (event) {
					event.stopImmediatePropagation();
					event.preventDefault();
					$(document).unbind('mouseup', _mouseup);
					$(document).unbind('mousemove', _mousemove);
					$(document).bind('mousedown', _mousedown);
				};

				_mousemove = function (event) {
					event.stopImmediatePropagation();
					event.preventDefault();

					if (event.pageY === self.y) {
						return;
					}
					self.y = event.pageY;

					var div = $('#ui-colorpicker-bar-layer-pointer', e),
						offset  = div.offset(),
						height  = div.height(),
						y = event.pageY - offset.top;

					y = Math.max(0, Math.min(y / height, 1));

					// interpret values
					switch (inst.mode) {
					case 'h':
						inst.color.h = 1 - y;
						inst.color.updateRGB();
						break;

					case 's':
						inst.color.s = 1 - y;
						inst.color.updateRGB();
						break;

					case 'v':
						inst.color.v = 1 - y;
						inst.color.updateRGB();
						break;

					case 'r':
						inst.color.r = 1 - y;
						inst.color.updateHSV();
						break;

					case 'g':
						inst.color.g = 1 - y;
						inst.color.updateHSV();
						break;

					case 'b':
						inst.color.b = 1 - y;
						inst.color.updateHSV();
						break;

					case 'a':
						inst.color.a = 1 - y;
						break;
					}

					inst._change();
				};

				_html = function () {
					var html = '<div id="ui-colorpicker-bar" class="ui-colorpicker-border">'
							+ '<span id="ui-colorpicker-bar-layer-1">&nbsp;</span>'
							+ '<span id="ui-colorpicker-bar-layer-2">&nbsp;</span>'
							+ '<span id="ui-colorpicker-bar-layer-3">&nbsp;</span>'
							+ '<span id="ui-colorpicker-bar-layer-4">&nbsp;</span>';

					if (inst.options.alpha) {
						html += '<span id="ui-colorpicker-bar-layer-alpha">&nbsp;</span>'
							+ '<span id="ui-colorpicker-bar-layer-alphabar">&nbsp;</span>';
					}

					html += '<span id="ui-colorpicker-bar-layer-pointer"><span id="ui-colorpicker-bar-pointer"></span></span></div>';

					return html;
				};

				this.generate = function () {
					switch (inst.mode) {
					case 'h':
					case 's':
					case 'v':
					case 'r':
					case 'g':
					case 'b':
						$('#ui-colorpicker-bar-layer-alpha', e).show();
						$('#ui-colorpicker-bar-layer-alphabar', e).hide();
						break;

					case 'a':
						$('#ui-colorpicker-bar-layer-alpha', e).hide();
						$('#ui-colorpicker-bar-layer-alphabar', e).show();
						break;
					}

					switch (inst.mode) {
					case 'h':
						$('#ui-colorpicker-bar-layer-1', e).css({'background-position': '0 0', 'opacity': ''}).show();
						$('#ui-colorpicker-bar-layer-2', e).hide();
						$('#ui-colorpicker-bar-layer-3', e).hide();
						$('#ui-colorpicker-bar-layer-4', e).hide();
						break;

					case 's':
						$('#ui-colorpicker-bar-layer-1', e).css({'background-position': '0 -260px', 'opacity': ''}).show();
						$('#ui-colorpicker-bar-layer-2', e).css({'background-position': '0 -520px', 'opacity': ''}).show();
						$('#ui-colorpicker-bar-layer-3', e).hide();
						$('#ui-colorpicker-bar-layer-4', e).hide();
						break;

					case 'v':
						$('#ui-colorpicker-bar-layer-1', e).css({'background-position': '0 -520px', 'opacity': ''}).show();
						$('#ui-colorpicker-bar-layer-2', e).hide();
						$('#ui-colorpicker-bar-layer-3', e).hide();
						$('#ui-colorpicker-bar-layer-4', e).hide();
						break;

					case 'r':
						$('#ui-colorpicker-bar-layer-1', e).css({'background-position': '0 -1560px', 'opacity': ''}).show();
						$('#ui-colorpicker-bar-layer-2', e).css({'background-position': '0 -1300px', 'opacity': ''}).show();
						$('#ui-colorpicker-bar-layer-3', e).css({'background-position': '0 -780px', 'opacity': ''}).show();
						$('#ui-colorpicker-bar-layer-4', e).css({'background-position': '0 -1040px', 'opacity': ''}).show();
						break;

					case 'g':
						$('#ui-colorpicker-bar-layer-1', e).css({'background-position': '0 -2600px', 'opacity': ''}).show();
						$('#ui-colorpicker-bar-layer-2', e).css({'background-position': '0 -2340px', 'opacity': ''}).show();
						$('#ui-colorpicker-bar-layer-3', e).css({'background-position': '0 -1820px', 'opacity': ''}).show();
						$('#ui-colorpicker-bar-layer-4', e).css({'background-position': '0 -2080px', 'opacity': ''}).show();
						break;

					case 'b':
						$('#ui-colorpicker-bar-layer-1', e).css({'background-position': '0 -3640px', 'opacity': ''}).show();
						$('#ui-colorpicker-bar-layer-2', e).css({'background-position': '0 -3380px', 'opacity': ''}).show();
						$('#ui-colorpicker-bar-layer-3', e).css({'background-position': '0 -2860px', 'opacity': ''}).show();
						$('#ui-colorpicker-bar-layer-4', e).css({'background-position': '0 -3120px', 'opacity': ''}).show();
						break;

					case 'a':
						$('#ui-colorpicker-bar-layer-1', e).hide();
						$('#ui-colorpicker-bar-layer-2', e).hide();
						$('#ui-colorpicker-bar-layer-3', e).hide();
						$('#ui-colorpicker-bar-layer-4', e).hide();
						break;
					}
					self.repaint();
				};

				this.repaint = function () {
					var div = $('#ui-colorpicker-bar-layer-pointer', e),
						y = 0;

					switch (inst.mode) {
					case 'h':
						y = (1 - inst.color.h) * div.height();
						break;

					case 's':
						y = (1 - inst.color.s) * div.height();
						$('#ui-colorpicker-bar-layer-2', e).css('opacity', 1 - inst.color.v);
						$(e).css('background-color', inst.color.normClone().toCSS());
						break;

					case 'v':
						y = (1 - inst.color.v) * div.height();
						$(e).css('background-color', inst.color.normClone().toCSS());
						break;

					case 'r':
						y = (1 - inst.color.r) * div.height();
						$('#ui-colorpicker-bar-layer-2', e).css('opacity', Math.max(0, (inst.color.b - inst.color.g)));
						$('#ui-colorpicker-bar-layer-3', e).css('opacity', Math.max(0, (inst.color.g - inst.color.b)));
						$('#ui-colorpicker-bar-layer-4', e).css('opacity', Math.min(inst.color.b, inst.color.g));
						break;

					case 'g':
						y = (1 - inst.color.g) * div.height();
						$('#ui-colorpicker-bar-layer-2', e).css('opacity', Math.max(0, (inst.color.b - inst.color.r)));
						$('#ui-colorpicker-bar-layer-3', e).css('opacity', Math.max(0, (inst.color.r - inst.color.b)));
						$('#ui-colorpicker-bar-layer-4', e).css('opacity', Math.min(inst.color.r, inst.color.b));
						break;

					case 'b':
						y = (1 - inst.color.b) * div.height();
						$('#ui-colorpicker-bar-layer-2', e).css('opacity', Math.max(0, (inst.color.r - inst.color.g)));
						$('#ui-colorpicker-bar-layer-3', e).css('opacity', Math.max(0, (inst.color.g - inst.color.r)));
						$('#ui-colorpicker-bar-layer-4', e).css('opacity', Math.min(inst.color.r, inst.color.g));
						break;

					case 'a':
						y = (1 - inst.color.a) * div.height();
						$(e).css('background-color', inst.color.normClone().toCSS());
						break;
					}

					if (inst.mode !== 'a') {
						$('#ui-colorpicker-bar-layer-alpha', e).css('opacity', 1 - inst.color.a);
					}

					$('#ui-colorpicker-bar-pointer', e).css('top', y - 3);
				};

				this.init = function () {
					e = $(_html()).appendTo($('#ui-colorpicker-bar-container', inst.dialog));

					e.bind('mousedown', _mousedown);
				};
			},

			inputs: function (inst) {
				var self = this,
					e = null,
					_html;

				_html = function () {
					var html = '<div id="ui-colorpicker-inputs">';

					if (inst.options.hsv) {
						html +=	'<div id="ui-colorpicker-h"><input class="ui-colorpicker-mode" type="radio" value="h"/><label>' + inst._getRegional('hueShort') + '</label><input class="ui-colorpicker-number ui-colorpicker-number-hsv" type="number" min="0" max="360" size="10"/><span class="ui-colorpicker-unit">&deg;</span></div>'
							+ '<div id="ui-colorpicker-s"><input class="ui-colorpicker-mode" type="radio" value="s"/><label>' + inst._getRegional('saturationShort') + '</label><input class="ui-colorpicker-number ui-colorpicker-number-hsv" type="number" min="0" max="100" size="10"/><span class="ui-colorpicker-unit">%</span></div>'
							+ '<div id="ui-colorpicker-v"><input class="ui-colorpicker-mode" type="radio" value="v"/><label>' + inst._getRegional('valueShort') + '</label><input class="ui-colorpicker-number ui-colorpicker-number-hsv" type="number" min="0" max="100" size="10"/><span class="ui-colorpicker-unit">%</span></div>';
					}

					if (inst.options.rgb) {
						html += '<div id="ui-colorpicker-r"><input class="ui-colorpicker-mode" type="radio" value="r"/><label>' + inst._getRegional('redShort') + '</label><input class="ui-colorpicker-number ui-colorpicker-number-rgb" type="number" min="0" max="255" size="10"/><span class="ui-colorpicker-unit"></span></div>'
							+ '<div id="ui-colorpicker-g"><input class="ui-colorpicker-mode" type="radio" value="g"/><label>' + inst._getRegional('greenShort') + '</label><input class="ui-colorpicker-number ui-colorpicker-number-rgb" type="number" min="0" max="255" size="10"/><span class="ui-colorpicker-unit"></span></div>'
							+ '<div id="ui-colorpicker-b"><input class="ui-colorpicker-mode" type="radio" value="b"/><label>' + inst._getRegional('blueShort') + '</label><input class="ui-colorpicker-number ui-colorpicker-number-rgb" type="number" min="0" max="255" size="10"/><span class="ui-colorpicker-unit"></span></div>';
					}

					if (inst.options.alpha) {
						html += '<div id="ui-colorpicker-a"><input class="ui-colorpicker-mode" name="mode" type="radio" value="a"/><label>' + inst._getRegional('alphaShort') + '</label><input class="ui-colorpicker-number ui-colorpicker-number-a" type="number" min="0" max="100" size="10"/><span class="ui-colorpicker-unit">%</span></div>';
					}

					return html + '</div>';
				};

				this.init = function () {
					e = $(_html()).appendTo($('#ui-colorpicker-inputs-container', inst.dialog));

					$('.ui-colorpicker-mode', e).click(function () {
						inst.mode = $(this).val();
						inst._generateAllParts();
					});

					$('.ui-colorpicker-number', e).bind('change input keyup', function () {
						inst.color.r = $('#ui-colorpicker-r .ui-colorpicker-number', e).val() / 255;
						inst.color.g = $('#ui-colorpicker-g .ui-colorpicker-number', e).val() / 255;
						inst.color.b = $('#ui-colorpicker-b .ui-colorpicker-number', e).val() / 255;
						inst.color.a = $('#ui-colorpicker-a .ui-colorpicker-number', e).val() / 100;
						inst.color.h = $('#ui-colorpicker-h .ui-colorpicker-number', e).val() / 360;
						inst.color.s = $('#ui-colorpicker-s .ui-colorpicker-number', e).val() / 100;
						inst.color.v = $('#ui-colorpicker-v .ui-colorpicker-number', e).val() / 100;

						if ($(this).hasClass('ui-colorpicker-number-hsv')) {
							inst.color.updateRGB();
						} else if ($(this).hasClass('ui-colorpicker-number-rgb')) {
							inst.color.updateHSV();
						}

						inst._change();
					});
				};

				this.repaint = function () {
					var c = $.extend(inst.color);
					c.h *= 360;
					c.s *= 100;
					c.v *= 100;
					c.r *= 255;
					c.g *= 255;
					c.b *= 255;
					c.a *= 100;

					$.each(c, function (index, value) {
						var v = Math.round(value);
						if (!$('#ui-colorpicker-' + index + ' .ui-colorpicker-number', e).is(':focus')
								&& $('#ui-colorpicker-' + index + ' .ui-colorpicker-number', e).val() !== v) {
							$('#ui-colorpicker-' + index + ' .ui-colorpicker-number', e).val(v);
						}
					});
				};

				this.generate = function () {
					$('.ui-colorpicker-mode', e).each(function () {
						$(this).attr('checked', $(this).val() === inst.mode);
					});
					this.repaint();
				};
			},

			preview: function (inst) {
				var self = this,
					e = null,
					_html;

				_html = function () {
					return '<div id="ui-colorpicker-preview">'
						+ '<span class="ui-colorpicker-border">'
						+ '<div id="ui-colorpicker-preview-initial"><div id="ui-colorpicker-preview-initial-alpha"></div></div>'
						+ '<div id="ui-colorpicker-preview-current"><div id="ui-colorpicker-preview-current-alpha"></div></div>'
						+ '</span>'
						+ '</div>';
				};

				this.init = function () {
					e = $(_html()).appendTo($('#ui-colorpicker-preview-container', inst.dialog));

					$('#ui-colorpicker-preview-initial', e).click(function () {
						inst.color = $.extend({}, inst.currentColor);
						inst._change();
					});

				};

				this.repaint = function () {
					$('#ui-colorpicker-preview-initial', e).css('background-color', inst.currentColor.toCSS()).attr('title', inst.currentColor.toHex());
					$('#ui-colorpicker-preview-initial-alpha', e).css('opacity', 1 - inst.currentColor.a);
					$('#ui-colorpicker-preview-current', e).css('background-color', inst.color.toCSS()).attr('title', inst.color.toHex());
					$('#ui-colorpicker-preview-current-alpha', e).css('opacity', 1 - inst.color.a);
				};

				this.generate = function () {
					if (inst.options.alpha) {
						$('#ui-colorpicker-preview-initial-alpha, #ui-colorpicker-preview-current-alpha', e).show();
					} else {
						$('#ui-colorpicker-preview-initial-alpha, #ui-colorpicker-preview-current-alpha', e).hide();
					}

					this.repaint();
				};
			},

			hex: function (inst) {
				var self = this,
					e = null,
					_html;

				_html = function () {
					var html = '';

					if (inst.options.alpha) {
						html += '<input id="ui-colorpicker-hex-alpha" maxlength="2" size="2"/>';
					}

					html += '<input id="ui-colorpicker-hex-input" maxlength="6" size="6"/>';

					return '<div id="ui-colorpicker-hex"><label for="ui-colorpicker-hex-input">#: </label>' + html + '</div>';
				};

				this.init = function () {
					e = $(_html()).appendTo($('#ui-colorpicker-hex-container', inst.dialog));

					$('#ui-colorpicker-hex-input', e).bind('change keyup', function () {
						var rgb = inst._parseHex($(this).val());
						inst.color.r = rgb[0];
						inst.color.g = rgb[1];
						inst.color.b = rgb[2];
						inst.color.updateHSV();
						inst._change();
					});

					$('#ui-colorpicker-hex-alpha', e).bind('change keyup', function () {
						inst.color.a = parseInt($('#ui-colorpicker-hex-alpha', e).val(), 16);
						inst._change();
					});
				};

				this.repaint = function () {
					if (!$('#ui-colorpicker-hex-input', e).is(':focus')) {
						$('#ui-colorpicker-hex-input', e).val(inst.color.toHex(true));
					}

					if (!$('#ui-colorpicker-hex-alpha', e).is(':focus')) {
						$('#ui-colorpicker-hex-alpha', e).val(inst._intToHex(inst.color.a * 255));
					}
				};

				this.generate = function () {
					this.repaint();
				};
			},

			swatches: function (inst) {
				var self = this,
					e = null,
					_html;

				_html = function () {
					var html = '';

					$.each(inst.options.swatches, function (name, color) {
						var hex = inst._intToHex(color[0]) + inst._intToHex(color[1]) + inst._intToHex(color[2]);
						html += '<div class="ui-colorpicker-swatch" style="background-color: #' + hex + '" title="' + name + '"></div>';
					});

					return '<div id="ui-colorpicker-swatches" class="ui-colorpicker-border">' + html + '</div>';
				};

				this.init = function () {
					e = $(_html()).appendTo($('#ui-colorpicker-swatches-container', inst.dialog));

					$('.ui-colorpicker-swatch', e).click(function () {
						var rgb		= inst._parseColor($(this).css('background-color'));
						inst.color	= (rgb === false ? new inst.Color() : new inst.Color(rgb[0], rgb[1], rgb[2], rgb[3]));
						inst._change();
					});
				};

				this.repaint = function () {
					// Not affected by changing color;
				};

				this.generate = function () {
					// Not affected by changing color;
				};
			},

			footer: function (inst) {
				var self = this,
					e = null,
					_html,
					_none_button_text;

				_html = function () {
					return '<div class="ui-dialog-buttonpane ui-widget-content">'
						+ (inst.options.alpha ? '<button class="ui-colorpicker-transparent">' + inst._getRegional('transparent') + '</button>' : '')
						+ (inst.inline ? '' : '<div class="ui-dialog-buttonset">'
							+ (inst.options.showNoneButton ? '<button class="ui-colorpicker-none">' + inst._getRegional('none') + '</button>' : '')
							+ '<button class="ui-colorpicker-close">' + inst._getRegional('done') + '</button>'
							+ '</div>')
						+ '</div>';
				};

				_none_button_text = function (e) {
					$('.ui-colorpicker-none .ui-button-text', e).text(inst._getRegional(inst.color_none ? 'revert' : 'none'));
				};

				this.init = function () {
					e = $(_html()).appendTo(inst.dialog);

					$('.ui-colorpicker-close', e).button().click(function () {
						inst.close();
					});

					$('.ui-colorpicker-none', e).button().click(function () {
						inst._change(!inst.color_none);
						_none_button_text(e);
					});
					_none_button_text(e);

					if (inst.options.alpha) {
						$('.ui-colorpicker-transparent', e).button().click(function () {
							inst.color.a = 0;
							inst._change();
						});
					}
				};

				this.repaint = function () {};

				this.generate = function () {};
			}
		},

		_parseHex: function (color) {
			var name = $.trim(color).toLowerCase(),
				c,
				m;

			if (_colors[name]) {
				c = _colors[name];
				return [c[0] / 255, c[1] / 255, c[2] / 255];
			}

			// {#}rrggbb
			m = /^#?([a-fA-F0-9]{0,6})/.exec(color);
			if (m) {
				c = parseInt(m[1], 16);
				return [((c >> 16) & 0xFF) / 255,
						((c >>  8) & 0xFF) / 255,
						(c & 0xFF) / 255];
			}
		},

		_parseColor: function (color) {
			var m;

			// rgba(r,g,b,a)
			m = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/.exec(color);
			if (m) {
				return [
					m[1] / 255,
					m[2] / 255,
					m[3] / 255,
					parseFloat(m[4])
				];
			}

			// rgba(r%,g%,b%,a%)
			m = /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/.exec(color);
			if (m) {
				return [
					m[1] / 100,
					m[2] / 100,
					m[3] / 100,
					m[4] / 100
				];
			}

			// #rrggbb
			m = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color);
			if (m) {
				return [
					parseInt(m[1], 16) / 255,
					parseInt(m[2], 16) / 255,
					parseInt(m[3], 16) / 255
				];
			}

			// #rgb
			m = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color);
			if (m) {
				return [
					parseInt(m[1] + m[1], 16) / 255,
					parseInt(m[2] + m[2], 16) / 255,
					parseInt(m[3] + m[3], 16) / 255
				];
			}

			return this._parseHex(color);
		},

		Color: function () {
			var a, args = arguments;

			this.updateRGB = function () {
				this.h = Math.max(0, Math.min(this.h, 1));
				this.s = Math.max(0, Math.min(this.s, 1));
				this.v = Math.max(0, Math.min(this.v, 1));

				if (this.s === 0) {
					this.r = this.g = this.b = this.v;
				} else {
					var var_h = this.h === 1 ? 0 : this.h * 6,
						var_i = Math.floor(var_h),
						var_1 = this.v * (1 - this.s),
						var_2 = this.v * (1 - this.s * (var_h - var_i)),
						var_3 = this.v * (1 - this.s * (1 - (var_h - var_i)));

					if (var_i === 0) {
						this.r = this.v;
						this.g = var_3;
						this.b = var_1;
					} else if (var_i === 1) {
						this.r = var_2;
						this.g = this.v;
						this.b = var_1;
					} else if (var_i === 2) {
						this.r = var_1;
						this.g = this.v;
						this.b = var_3;
					} else if (var_i === 3) {
						this.r = var_1;
						this.g = var_2;
						this.b = this.v;
					} else if (var_i === 4) {
						this.r = var_3;
						this.g = var_1;
						this.b = this.v;
					} else {
						this.r = this.v;
						this.g = var_1;
						this.b = var_2;
					}
				}
				return this;
			};

			this.updateHSV = function () {
				var minVal, maxVal, delta, del_R, del_G, del_B;
				this.r = Math.max(0, Math.min(this.r, 1));
				this.g = Math.max(0, Math.min(this.g, 1));
				this.b = Math.max(0, Math.min(this.b, 1));

				minVal = Math.min(this.r, this.g, this.b);
				maxVal = Math.max(this.r, this.g, this.b);
				delta = maxVal - minVal;

				this.v = maxVal;

				if (delta === 0) {
					this.h = 0;
					this.s = 0;
				} else {
					this.s = delta / maxVal;
					del_R = (((maxVal - this.r) / 6) + (delta / 2)) / delta;
					del_G = (((maxVal - this.g) / 6) + (delta / 2)) / delta;
					del_B = (((maxVal - this.b) / 6) + (delta / 2)) / delta;

					if (this.r === maxVal) {
						this.h = del_B - del_G;
					} else if (this.g === maxVal) {
						this.h = (1 / 3) + del_R - del_B;
					} else if (this.b === maxVal) {
						this.h = (2 / 3) + del_G - del_R;
					}

					if (this.h < 0) {
						this.h += 1;
					} else if (this.h > 1) {
						this.h -= 1;
					}
				}
				return this;
			};

			this._hexify = function (number) {
			   // return Math.round(number).toString(16);
				var digits = '0123456789abcdef',
					lsd = number % 16,
					msd = (number - lsd) / 16,
					hexified = digits.charAt(msd) + digits.charAt(lsd);
				return hexified;
			};

			this.toHex = function () {
				return this._hexify(this.r * 255) + this._hexify(this.g * 255) + this._hexify(this.b * 255);
			};

			this.toCSS = function () {
				return '#' + this.toHex();
			};

			this.toHexAlpha = function () {
				return this._hexify(this.a * 255);
			};

			this.normClone = function () {
				return $.extend({}, this, {s: 1, v: 1}).updateRGB();
			};

			this.equals = function (rgb) {
				return rgb[0] === this.r
					&& rgb[1] === this.g
					&& rgb[2] === this.b;
			};

			this.limit = function (steps) {
				steps -= 1;
				this.r = Math.round(this.r * steps) / steps;
				this.g = Math.round(this.g * steps) / steps;
				this.b = Math.round(this.b * steps) / steps;
				this.updateHSV();
			};

			for (a = 0; a < args.length; a += 1) {
				args[a] = Math.max(0, Math.min(args[a], 1));
			}

			this.no_color = false;

			this.r = args[0] || 0;
			this.g = args[1] || 0;
			this.b = args[2] || 0;
			this.a = args[3] === 0 ? 0 : arg[3] || 1;
			this.h = args[4] || 0;
			this.s = args[5] || 0;
			this.v = args[6] || 0;
			this.updateHSV();
		}
	});

}(jQuery));
