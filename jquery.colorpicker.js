/*jslint devel: true, bitwise: true, regexp: true, browser: true, confusion: true, unparam: true, eqeq: true, white: true, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
/*globals jQuery */

/*
 * ColorPicker
 *
 * Copyright (c) 2011-2012 Martijn W. van der Lee
 * Licensed under the MIT.
 *
 * Full-featured colorpicker for jQueryUI with full theming support.
 * Most images from jPicker by Christopher T. Tillman.
 * Sourcecode created from scratch by Martijn W. van der Lee.
 */

(function ($) {
	"use strict";

	$.colorpicker = new function() {
		this.regional = [];
		this.regional[''] =	{
			ok:				'OK',
			cancel:			'Cancel',
			none:			'None',
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

	var _colorpicker_index = 0,

		_container_popup = '<div class="ui-colorpicker ui-colorpicker-dialog ui-dialog ui-widget ui-widget-content ui-corner-all" style="display: none;"></div>',

		_container_inline = '<div class="ui-colorpicker ui-colorpicker-inline ui-dialog ui-widget ui-widget-content ui-corner-all"></div>',

		_parts_lists = {
			'full':		['header', 'map', 'bar', 'hex', 'hsv', 'rgb', 'alpha', 'preview', 'swatches', 'footer'],
			'popup':	['map', 'bar', 'hex', 'hsv', 'rgb', 'alpha', 'preview', 'footer'],
			'inline':	['map', 'bar', 'hex', 'hsv', 'rgb', 'alpha', 'preview']
		},

		_intToHex = function (dec) {
			var result = Math.round(dec).toString(16);
			if (result.length === 1) {
				result = ('0' + result);
			}
			return result.toLowerCase();
		},

		_formats = {
			'HEX':		function(color) {
							return _formatColor('#rxgxbx', color);
						}
		,	'HEX3':		function(color) {
							var rgb = color.getRGB();
							var r = Math.round(rgb.r * 16);
							var g = Math.round(rgb.g * 16);
							var b = Math.round(rgb.b * 16);
							return '#'+r.toString(16)+g.toString(16)+b.toString(16);
						}
		,	'RGBA':		function(color) {
							return _formatColor(color.getA() >= 1
									? 'rgb(rd,gd,bd)'
									: 'rgba(rd,gd,bd,af)', color);
						}
		,	'RGBA%':	function(color) {
							return _formatColor(color.getA() >= 1
									? 'rgb(rp%,gp%,bp%)'
									: 'rgba(rp%,gp%,bp%,af)', color);
						}
		,	'HSLA':		function(color) {
							return _formatColor(color.getA() >= 1
									? 'hsl(hd,sd,vd)'
									: 'hsla(hd,sd,vd,af)', color);
						}
		,	'HSLA%':	function(color) {
							return _formatColor(color.getA() >= 1
									? 'hsl(hp%,sp%,vp%)'
									: 'hsla(hp%,sp%,vp%,af)', color);
						}
		,	'NAME':		function(color) {
							return _closestName(color);
						}
		},

		_formatColor = function (format, color) {
			var that = this;

			var types = {
				'x':	function(v) {return _intToHex(v * 255);}
			,	'd':	function(v) {return Math.round(v * 255);}
			,	'f':	function(v) {return v;}
			,	'p':	function(v) {return v * 100;}
			};

			if (_formats[format]) {
				return _formats[format](color);
			}

			var channels = color.getChannels();

			return format.replace(/\\?[rgbhsva][xdfp]/g, function(m) {
				if (m.match(/^\\/)) {
					return m.slice(1);
				}
				return types[m[1]](channels[m[0]]);
			});
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
		},

		_closestName = function(color) {
			var rgb			= color.getRGB();
			var color_a		= [ rgb.r * 255, rgb.g * 255, rgb.b * 255 ];

			var distance	= null;
			var name		= '';

			$.each(_colors, function(n, color_b) {
				var d	= Math.pow(Math.abs(color_a[0] - color_b[0]), 2)
						+ Math.pow(Math.abs(color_a[1] - color_b[1]), 2)
						+ Math.pow(Math.abs(color_a[2] - color_b[2]), 2);
				if (d < distance || distance === null) {
					name = n;
					if (d == 0) {
						return false;	// can't get much closer than 0
					}
					distance = d;
				}
			});

			return name;
		},

        _parseHex = function (color) {
            var name = $.trim(color).toLowerCase(),
                c,
                m;

            if (_colors[name]) {
                c = _colors[name];
                return [c[0] / 255, c[1] / 255, c[2] / 255];
            }

            // {#}rrggbb
            m = /^#?([a-fA-F0-9]{1,6})/.exec(color);
            if (m) {
                c = parseInt(m[1], 16);
                return [((c >> 16) & 0xFF) / 255,
                        ((c >>  8) & 0xFF) / 255,
                        (c & 0xFF) / 255];
            }

            return false;
        },

        _parseColor = function (color) {
            var m;

            if (color == '') {
                return false;
            }

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

            return _parseHex(color);
        },

		_layoutTable = function(layout, callback) {
			var bitmap,
				x,
				y,
				width, height,
				columns, rows,
				index,
				cell,
				html;

			layout.sort(function(a, b) {
					if (a.pos[1] == b.pos[1]) {
						return a.pos[0] - b.pos[0];
					}
					return a.pos[1] - b.pos[1];
				});

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

        _parts = {
            header: function (inst) {
                var that = this,
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
            },

            map: function (inst) {
                var that	= this,
                    e		= null,
					mousemove_timeout = null,
                    _mousedown, _mouseup, _mousemove, _html;

                _mousedown = function (event) {
                    if (!inst.opened) {
                        return;
                    }

                    var div		= $('.ui-colorpicker-map-layer-pointer', e),
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

                    if (event.pageX === that.x && event.pageY === that.y) {
                        return;
                    }
                    that.x = event.pageX;
                    that.y = event.pageY;

                    var div = $('.ui-colorpicker-map-layer-pointer', e),
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
						inst.color.setHSV(null, x, 1 - y);
                        break;

                    case 's':
                    case 'a':
						inst.color.setHSV(x, null, 1 - y);
                        break;

                    case 'v':
						inst.color.setHSV(x, 1 - y, null);
                        break;

                    case 'r':
						inst.color.setRGB(null, 1 - y, x);
                        break;

                    case 'g':
						inst.color.setRGB(1 - y, null, x);
                        break;

                    case 'b':
						inst.color.setRGB(x, 1 - y, null);
                        break;
                    }

                    inst._change();
                };

                _html = function () {
                    var html = '<div class="ui-colorpicker-map" class="ui-colorpicker-border">'
                            + '<span class="ui-colorpicker-map-layer-1">&nbsp;</span>'
                            + '<span class="ui-colorpicker-map-layer-2">&nbsp;</span>'
                            + (inst.options.alpha ? '<span class="ui-colorpicker-map-layer-alpha">&nbsp;</span>' : '')
                            + '<span class="ui-colorpicker-map-layer-pointer"><span class="ui-colorpicker-map-pointer"></span></span></div>';
                    return html;
                };

                this.generate = function () {
                    switch (inst.mode) {
                    case 'h':
                        $('.ui-colorpicker-map-layer-1', e).css({'background-position': '0 0', 'opacity': ''}).show();
                        $('.ui-colorpicker-map-layer-2', e).hide();
                        break;

                    case 's':
                    case 'a':
                        $('.ui-colorpicker-map-layer-1', e).css({'background-position': '0 -260px', 'opacity': ''}).show();
                        $('.ui-colorpicker-map-layer-2', e).css({'background-position': '0 -520px', 'opacity': ''}).show();
                        break;

                    case 'v':
                        $(e).css('background-color', 'black');
                        $('.ui-colorpicker-map-layer-1', e).css({'background-position': '0 -780px', 'opacity': ''}).show();
                        $('.ui-colorpicker-map-layer-2', e).hide();
                        break;

                    case 'r':
                        $('.ui-colorpicker-map-layer-1', e).css({'background-position': '0 -1040px', 'opacity': ''}).show();
                        $('.ui-colorpicker-map-layer-2', e).css({'background-position': '0 -1300px', 'opacity': ''}).show();
                        break;

                    case 'g':
                        $('.ui-colorpicker-map-layer-1', e).css({'background-position': '0 -1560px', 'opacity': ''}).show();
                        $('.ui-colorpicker-map-layer-2', e).css({'background-position': '0 -1820px', 'opacity': ''}).show();
                        break;

                    case 'b':
                        $('.ui-colorpicker-map-layer-1', e).css({'background-position': '0 -2080px', 'opacity': ''}).show();
                        $('.ui-colorpicker-map-layer-2', e).css({'background-position': '0 -2340px', 'opacity': ''}).show();
                        break;
                    }
                    that.repaint();
                };

                this.repaint = function () {
                    var div = $('.ui-colorpicker-map-layer-pointer', e),
                        x = 0,
                        y = 0;

                    switch (inst.mode) {
                    case 'h':
                        x = inst.color.getHSV().s * div.width();
                        y = (1 - inst.color.getHSV().v) * div.width();
                        $(e).css('background-color', inst.color.copy().normalize().toCSS());
                        break;

                    case 's':
                    case 'a':
                        x = inst.color.getHSV().h * div.width();
                        y = (1 - inst.color.getHSV().v) * div.width();
                        $('.ui-colorpicker-map-layer-2', e).css('opacity', 1 - inst.color.getHSV().s);
                        break;

                    case 'v':
                        x = inst.color.getHSV().h * div.width();
                        y = (1 - inst.color.getHSV().s) * div.width();
                        $('.ui-colorpicker-map-layer-1', e).css('opacity', inst.color.getHSV().v);
                        break;

                    case 'r':
                        x = inst.color.getRGB().b * div.width();
                        y = (1 - inst.color.getRGB().g) * div.width();
                        $('.ui-colorpicker-map-layer-2', e).css('opacity', inst.color.getRGB().r);
                        break;

                    case 'g':
                        x = inst.color.getRGB().b * div.width();
                        y = (1 - inst.color.getRGB().r) * div.width();
                        $('.ui-colorpicker-map-layer-2', e).css('opacity', inst.color.getRGB().g);
                        break;

                    case 'b':
                        x = inst.color.getRGB().r * div.width();
                        y = (1 - inst.color.getRGB().g) * div.width();
                        $('.ui-colorpicker-map-layer-2', e).css('opacity', inst.color.getRGB().b);
                        break;
                    }

                    if (inst.options.alpha) {
                        $('.ui-colorpicker-map-layer-alpha', e).css('opacity', 1 - inst.color.getA());
                    }

                    $('.ui-colorpicker-map-pointer', e).css({
                        'left': x - 7,
                        'top': y - 7
                    });
                };

                this.init = function () {
                    e = $(_html()).appendTo($('.ui-colorpicker-map-container', inst.dialog));

                    e.bind('mousedown', _mousedown);
                };
            },

            bar: function (inst) {
                var that		= this,
                    e			= null,
                    _mousedown, _mouseup, _mousemove, _html;

                _mousedown = function (event) {
                    if (!inst.opened) {
                        return;
                    }

                    var div		= $('.ui-colorpicker-bar-layer-pointer', e),
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

                    if (event.pageY === that.y) {
                        return;
                    }
                    that.y = event.pageY;

                    var div = $('.ui-colorpicker-bar-layer-pointer', e),
                        offset  = div.offset(),
                        height  = div.height(),
                        y = event.pageY - offset.top;

                    y = Math.max(0, Math.min(y / height, 1));

                    // interpret values
                    switch (inst.mode) {
                    case 'h':
                        inst.color.setHSV(1 - y, null, null);
                        break;

                    case 's':
                        inst.color.setHSV(null, 1 - y, null);
                        break;

                    case 'v':
                        inst.color.setHSV(null, null, 1 - y);
                        break;

                    case 'r':
                        inst.color.setRGB(1 - y, null, null);
                        break;

                    case 'g':
                        inst.color.setRGB(null, 1 - y, null);
                        break;

                    case 'b':
                        inst.color.setRGB(null, null, 1 - y);
                        break;

                    case 'a':
                        inst.color.setA(1 - y);
                        break;
                    }

                    inst._change();
                };

                _html = function () {
                    var html = '<div class="ui-colorpicker-bar" class="ui-colorpicker-border">'
                            + '<span class="ui-colorpicker-bar-layer-1">&nbsp;</span>'
                            + '<span class="ui-colorpicker-bar-layer-2">&nbsp;</span>'
                            + '<span class="ui-colorpicker-bar-layer-3">&nbsp;</span>'
                            + '<span class="ui-colorpicker-bar-layer-4">&nbsp;</span>';

                    if (inst.options.alpha) {
                        html += '<span class="ui-colorpicker-bar-layer-alpha">&nbsp;</span>'
                            + '<span class="ui-colorpicker-bar-layer-alphabar">&nbsp;</span>';
                    }

                    html += '<span class="ui-colorpicker-bar-layer-pointer"><span class="ui-colorpicker-bar-pointer"></span></span></div>';

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
                        $('.ui-colorpicker-bar-layer-alpha', e).show();
                        $('.ui-colorpicker-bar-layer-alphabar', e).hide();
                        break;

                    case 'a':
                        $('.ui-colorpicker-bar-layer-alpha', e).hide();
                        $('.ui-colorpicker-bar-layer-alphabar', e).show();
                        break;
                    }

                    switch (inst.mode) {
                    case 'h':
                        $('.ui-colorpicker-bar-layer-1', e).css({'background-position': '0 0', 'opacity': ''}).show();
                        $('.ui-colorpicker-bar-layer-2', e).hide();
                        $('.ui-colorpicker-bar-layer-3', e).hide();
                        $('.ui-colorpicker-bar-layer-4', e).hide();
                        break;

                    case 's':
                        $('.ui-colorpicker-bar-layer-1', e).css({'background-position': '0 -260px', 'opacity': ''}).show();
                        $('.ui-colorpicker-bar-layer-2', e).css({'background-position': '0 -520px', 'opacity': ''}).show();
                        $('.ui-colorpicker-bar-layer-3', e).hide();
                        $('.ui-colorpicker-bar-layer-4', e).hide();
                        break;

                    case 'v':
                        $('.ui-colorpicker-bar-layer-1', e).css({'background-position': '0 -520px', 'opacity': ''}).show();
                        $('.ui-colorpicker-bar-layer-2', e).hide();
                        $('.ui-colorpicker-bar-layer-3', e).hide();
                        $('.ui-colorpicker-bar-layer-4', e).hide();
                        break;

                    case 'r':
                        $('.ui-colorpicker-bar-layer-1', e).css({'background-position': '0 -1560px', 'opacity': ''}).show();
                        $('.ui-colorpicker-bar-layer-2', e).css({'background-position': '0 -1300px', 'opacity': ''}).show();
                        $('.ui-colorpicker-bar-layer-3', e).css({'background-position': '0 -780px', 'opacity': ''}).show();
                        $('.ui-colorpicker-bar-layer-4', e).css({'background-position': '0 -1040px', 'opacity': ''}).show();
                        break;

                    case 'g':
                        $('.ui-colorpicker-bar-layer-1', e).css({'background-position': '0 -2600px', 'opacity': ''}).show();
                        $('.ui-colorpicker-bar-layer-2', e).css({'background-position': '0 -2340px', 'opacity': ''}).show();
                        $('.ui-colorpicker-bar-layer-3', e).css({'background-position': '0 -1820px', 'opacity': ''}).show();
                        $('.ui-colorpicker-bar-layer-4', e).css({'background-position': '0 -2080px', 'opacity': ''}).show();
                        break;

                    case 'b':
                        $('.ui-colorpicker-bar-layer-1', e).css({'background-position': '0 -3640px', 'opacity': ''}).show();
                        $('.ui-colorpicker-bar-layer-2', e).css({'background-position': '0 -3380px', 'opacity': ''}).show();
                        $('.ui-colorpicker-bar-layer-3', e).css({'background-position': '0 -2860px', 'opacity': ''}).show();
                        $('.ui-colorpicker-bar-layer-4', e).css({'background-position': '0 -3120px', 'opacity': ''}).show();
                        break;

                    case 'a':
                        $('.ui-colorpicker-bar-layer-1', e).hide();
                        $('.ui-colorpicker-bar-layer-2', e).hide();
                        $('.ui-colorpicker-bar-layer-3', e).hide();
                        $('.ui-colorpicker-bar-layer-4', e).hide();
                        break;
                    }
                    that.repaint();
                };

                this.repaint = function () {
                    var div = $('.ui-colorpicker-bar-layer-pointer', e),
                        y = 0;

                    switch (inst.mode) {
                    case 'h':
                        y = (1 - inst.color.getHSV().h) * div.height();
                        break;

                    case 's':
                        y = (1 - inst.color.getHSV().s) * div.height();
                        $('.ui-colorpicker-bar-layer-2', e).css('opacity', 1 - inst.color.getHSV().v);
                        $(e).css('background-color', inst.color.copy().normalize().toCSS());
                        break;

                    case 'v':
                        y = (1 - inst.color.getHSV().v) * div.height();
                        $(e).css('background-color', inst.color.copy().normalize().toCSS());
                        break;

                    case 'r':
                        y = (1 - inst.color.getRGB().r) * div.height();
                        $('.ui-colorpicker-bar-layer-2', e).css('opacity', Math.max(0, (inst.color.getRGB().b - inst.color.getRGB().g)));
                        $('.ui-colorpicker-bar-layer-3', e).css('opacity', Math.max(0, (inst.color.getRGB().g - inst.color.getRGB().b)));
                        $('.ui-colorpicker-bar-layer-4', e).css('opacity', Math.min(inst.color.getRGB().b, inst.color.getRGB().g));
                        break;

                    case 'g':
                        y = (1 - inst.color.getRGB().g) * div.height();
                        $('.ui-colorpicker-bar-layer-2', e).css('opacity', Math.max(0, (inst.color.getRGB().b - inst.color.getRGB().r)));
                        $('.ui-colorpicker-bar-layer-3', e).css('opacity', Math.max(0, (inst.color.getRGB().r - inst.color.getRGB().b)));
                        $('.ui-colorpicker-bar-layer-4', e).css('opacity', Math.min(inst.color.getRGB().r, inst.color.getRGB().b));
                        break;

                    case 'b':
                        y = (1 - inst.color.getRGB().b) * div.height();
                        $('.ui-colorpicker-bar-layer-2', e).css('opacity', Math.max(0, (inst.color.getRGB().r - inst.color.getRGB().g)));
                        $('.ui-colorpicker-bar-layer-3', e).css('opacity', Math.max(0, (inst.color.getRGB().g - inst.color.getRGB().r)));
                        $('.ui-colorpicker-bar-layer-4', e).css('opacity', Math.min(inst.color.getRGB().r, inst.color.getRGB().g));
                        break;

                    case 'a':
                        y = (1 - inst.color.getA()) * div.height();
                        $(e).css('background-color', inst.color.copy().normalize().toCSS());
                        break;
                    }

                    if (inst.mode !== 'a') {
                        $('.ui-colorpicker-bar-layer-alpha', e).css('opacity', 1 - inst.color.getA());
                    }

                    $('.ui-colorpicker-bar-pointer', e).css('top', y - 3);
                };

                this.init = function () {
                    e = $(_html()).appendTo($('.ui-colorpicker-bar-container', inst.dialog));

                    e.bind('mousedown', _mousedown);
                };
            },

            preview: function (inst) {
                var that = this,
                    e = null,
                    _html;

                _html = function () {
                    return '<div class="ui-colorpicker-preview">'
                        + '<span class="ui-colorpicker-border">'
                        + '<div class="ui-colorpicker-preview-initial"><div class="ui-colorpicker-preview-initial-alpha"></div></div>'
                        + '<div class="ui-colorpicker-preview-current"><div class="ui-colorpicker-preview-current-alpha"></div></div>'
                        + '</span>'
                        + '</div>';
                };

                this.init = function () {
                    e = $(_html()).appendTo($('.ui-colorpicker-preview-container', inst.dialog));

                    $('.ui-colorpicker-preview-initial', e).click(function () {
                        inst.color = inst.currentColor.copy();
                        inst._change();
                    });

                };

                this.generate = function () {
                    if (inst.options.alpha) {
                        $('.ui-colorpicker-preview-initial-alpha, .ui-colorpicker-preview-current-alpha', e).show();
                    } else {
                        $('.ui-colorpicker-preview-initial-alpha, .ui-colorpicker-preview-current-alpha', e).hide();
                    }

                    this.repaint();
                };

                this.repaint = function () {
                    $('.ui-colorpicker-preview-initial', e).css('background-color', inst.currentColor.toCSS()).attr('title', inst.currentColor.toHex());
                    $('.ui-colorpicker-preview-initial-alpha', e).css('opacity', 1 - inst.currentColor.getA());
                    $('.ui-colorpicker-preview-current', e).css('background-color', inst.color.toCSS()).attr('title', inst.color.toHex());
                    $('.ui-colorpicker-preview-current-alpha', e).css('opacity', 1 - inst.color.getA());
                };
            },

            hsv: function (inst) {
                var that = this,
                    e = null,
                    _html;

                _html = function () {
                    var html = '';

                    if (inst.options.hsv) {
                        html +=	'<div class="ui-colorpicker-h"><input class="ui-colorpicker-mode" type="radio" value="h"/><label>' + inst._getRegional('hueShort') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="360" size="10"/><span class="ui-colorpicker-unit">&deg;</span></div>'
                            + '<div class="ui-colorpicker-s"><input class="ui-colorpicker-mode" type="radio" value="s"/><label>' + inst._getRegional('saturationShort') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="100" size="10"/><span class="ui-colorpicker-unit">%</span></div>'
                            + '<div class="ui-colorpicker-v"><input class="ui-colorpicker-mode" type="radio" value="v"/><label>' + inst._getRegional('valueShort') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="100" size="10"/><span class="ui-colorpicker-unit">%</span></div>';
                    }

                    return '<div class="ui-colorpicker-hsv">' + html + '</div>';
                };

                this.init = function () {
                    e = $(_html()).appendTo($('.ui-colorpicker-hsv-container', inst.dialog));

                    $('.ui-colorpicker-mode', e).click(function () {
                        inst.mode = $(this).val();
                        inst._generateAllParts();
                    });

                    $('.ui-colorpicker-number', e).bind('change input keyup', function () {
                        inst.color.setHSV(
							$('.ui-colorpicker-h .ui-colorpicker-number', e).val() / 360,
							$('.ui-colorpicker-s .ui-colorpicker-number', e).val() / 100,
							$('.ui-colorpicker-v .ui-colorpicker-number', e).val() / 100
						);
                        inst._change();
                    });
                };

                this.repaint = function () {
					var hsv = inst.color.getHSV();
					hsv.h *= 360;
					hsv.s *= 100;
					hsv.v *= 100;

                    $.each(hsv, function (index, value) {
						var input = $('.ui-colorpicker-' + index + ' .ui-colorpicker-number', e);
                        value = Math.round(value);
                        if (!input.is(':focus') && input.val() !== value) {
                            input.val(value);
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

            rgb: function (inst) {
                var that = this,
                    e = null,
                    _html;

                _html = function () {
                    var html = '';

                    if (inst.options.rgb) {
                        html += '<div class="ui-colorpicker-r"><input class="ui-colorpicker-mode" type="radio" value="r"/><label>' + inst._getRegional('redShort') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="255" size="10"/><span class="ui-colorpicker-unit"></span></div>'
                            + '<div class="ui-colorpicker-g"><input class="ui-colorpicker-mode" type="radio" value="g"/><label>' + inst._getRegional('greenShort') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="255" size="10"/><span class="ui-colorpicker-unit"></span></div>'
                            + '<div class="ui-colorpicker-b"><input class="ui-colorpicker-mode" type="radio" value="b"/><label>' + inst._getRegional('blueShort') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="255" size="10"/><span class="ui-colorpicker-unit"></span></div>';
                    }

                    return '<div class="ui-colorpicker-rgb">' + html + '</div>';
                };

                this.init = function () {
                    e = $(_html()).appendTo($('.ui-colorpicker-rgb-container', inst.dialog));

                    $('.ui-colorpicker-mode', e).click(function () {
                        inst.mode = $(this).val();
                        inst._generateAllParts();
                    });

                    $('.ui-colorpicker-number', e).bind('change input keyup', function () {
                        inst.color.setRGB(
							$('.ui-colorpicker-r .ui-colorpicker-number', e).val() / 255,
							$('.ui-colorpicker-g .ui-colorpicker-number', e).val() / 255,
							$('.ui-colorpicker-b .ui-colorpicker-number', e).val() / 255
						);

                        inst._change();
                    });
                };

                this.repaint = function () {
                    $.each(inst.color.getRGB(), function (index, value) {
						var input = $('.ui-colorpicker-' + index + ' .ui-colorpicker-number', e);
                        value = Math.round(value * 255);
                        if (!input.is(':focus') && input.val() !== value) {
                            input.val(value);
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

            alpha: function (inst) {
                var that = this,
                    e = null,
                    _html;

                _html = function () {
                    var html = '';

                    if (inst.options.alpha) {
                        html += '<div class="ui-colorpicker-a"><input class="ui-colorpicker-mode" name="mode" type="radio" value="a"/><label>' + inst._getRegional('alphaShort') + '</label><input class="ui-colorpicker-number" type="number" min="0" max="100" size="10"/><span class="ui-colorpicker-unit">%</span></div>';
                    }

                    return '<div class="ui-colorpicker-alpha">' + html + '</div>';
                };

                this.init = function () {
                    e = $(_html()).appendTo($('.ui-colorpicker-alpha-container', inst.dialog));

                    $('.ui-colorpicker-mode', e).click(function () {
                        inst.mode = $(this).val();
                        inst._generateAllParts();
                    });

                    $('.ui-colorpicker-number', e).bind('change input keyup', function () {
                        inst.color.setA($('.ui-colorpicker-a .ui-colorpicker-number', e).val() / 100);
                        inst._change();
                    });
                };

                this.generate = function () {
                    $('.ui-colorpicker-mode', e).each(function () {
                        $(this).attr('checked', $(this).val() === inst.mode);
                    });
                    this.repaint();
                };

                this.repaint = function () {
					var input = $('.ui-colorpicker-a .ui-colorpicker-number', e);
					var value = Math.round(inst.color.getA() * 100);
					if (!input.is(':focus') && input.val() !== value) {
						input.val(value);
					}
                };
            },

            hex: function (inst) {
                var that = this,
                    e = null,
                    _html;

                _html = function () {
                    var html = '';

                    if (inst.options.alpha) {
                        html += '<input class="ui-colorpicker-hex-alpha" maxlength="2" size="2"/>';
                    }

                    html += '<input class="ui-colorpicker-hex-input" maxlength="6" size="6"/>';

                    return '<div class="ui-colorpicker-hex"><label>#: </label>' + html + '</div>';
                };

                this.init = function () {
                    e = $(_html()).appendTo($('.ui-colorpicker-hex-container', inst.dialog));

                    $('.ui-colorpicker-hex-input', e).bind('change keyup', function () {
                        var rgb = _parseHex($(this).val());
						inst.color.setRGB(rgb[0], rgb[1], rgb[2]);
                        inst._change();
                    });

                    $('.ui-colorpicker-hex-alpha', e).bind('change keyup', function () {
                        inst.color.setA(parseInt($('.ui-colorpicker-hex-alpha', e).val(), 16) / 255);
                        inst._change();
                    });
                };

                this.generate = function () {
                    this.repaint();
                };

                this.repaint = function () {
                    if (!$('.ui-colorpicker-hex-input', e).is(':focus')) {
                        $('.ui-colorpicker-hex-input', e).val(inst.color.toHex(true));
                    }

                    if (!$('.ui-colorpicker-hex-alpha', e).is(':focus')) {
                        $('.ui-colorpicker-hex-alpha', e).val(_intToHex(inst.color.getA() * 255));
                    }
                };
            },

            swatches: function (inst) {
                var that = this,
                    e = null,
                    _html;

                _html = function () {
                    var html = '';

                    $.each(inst.options.swatches, function (name, color) {
                        var hex = _intToHex(color[0]) + _intToHex(color[1]) + _intToHex(color[2]);	// @todo use formatter
                        html += '<div class="ui-colorpicker-swatch" style="background-color: #' + hex + '" title="' + name + '"></div>';
                    });

                    return '<div class="ui-colorpicker-swatches" class="ui-colorpicker-border">' + html + '</div>';
                };

                this.init = function () {
                    e = $(_html()).appendTo($('.ui-colorpicker-swatches-container', inst.dialog));

                    $('.ui-colorpicker-swatch', e).click(function () {
                        var rgb		= _parseColor($(this).css('background-color'));
                        inst.color	= (rgb === false ? new Color() : new Color(rgb[0], rgb[1], rgb[2], rgb[3]));
                        inst._change();
                    });
                };
            },

            footer: function (inst) {
                var that = this,
					e = null,
					id_transparent = 'ui-colorpicker-special-transparent-'+_colorpicker_index,
					id_none = 'ui-colorpicker-special-none-'+_colorpicker_index,
                    _html
					;

                _html = function () {
                    var html = '';

                    if (inst.options.alpha || (!inst.inline && inst.options.showNoneButton)) {
                        html += '<div class="ui-colorpicker-buttonset">';

                        if (inst.options.alpha) {
							html += '<input type="radio" name="ui-colorpicker-special" id="'+id_transparent+'" class="ui-colorpicker-special-transparent"/><label for="'+id_transparent+'">' + inst._getRegional('transparent') + '</label>';
                        }
                        if (!inst.inline && inst.options.showNoneButton) {
                            html += '<input type="radio" name="ui-colorpicker-special" id="'+id_none+'" class="ui-colorpicker-special-none"><label for="'+id_none+'">' + inst._getRegional('none') + '</label>';
                        }
                        html += '</div>';
                    }

                    if (!inst.inline) {
                        html += '<div class="ui-dialog-buttonset">';
                        html += '<button class="ui-colorpicker-cancel">' + inst._getRegional('cancel') + '</button>';
                        html += '<button class="ui-colorpicker-ok">' + inst._getRegional('ok') + '</button>';
                        html += '</div>';
                    }

                    return '<div class="ui-dialog-buttonpane ui-widget-content">' + html + '</div>';
                };

                this.init = function () {
                    e = $(_html()).appendTo(inst.dialog);

                    $('.ui-colorpicker-ok', e).button().click(function () {
                        inst.close();
                    });

                    $('.ui-colorpicker-cancel', e).button().click(function () {
                        inst.color = inst.currentColor.copy();
                        inst._change(inst.color.set);
                        inst.close();
                    });

                    //inst._getRegional('transparent')
                    $('.ui-colorpicker-buttonset', e).buttonset();

                    $('.ui-colorpicker-special-color', e).click(function () {
                        inst._change();
                    });

                    $('#'+id_none, e).click(function () {
                        inst._change(false);
                    });

                    $('#'+id_transparent, e).click(function () {
                        inst.color.setA(0);
                        inst._change();
                    });
                };

                this.repaint = function () {
                    if (!inst.color.set) {
                        $('.ui-colorpicker-special-none', e).attr('checked', true).button( "refresh" );
                    } else if (inst.color.getA() == 0) {
                        $('.ui-colorpicker-special-transparent', e).attr('checked', true).button( "refresh" );
                    } else {
                        $('input', e).attr('checked', false).button( "refresh" );
                    }

                    $('.ui-colorpicker-cancel', e).button(inst.changed ? 'enable' : 'disable');
                };

                this.generate = function () {};
            }
        },

        Color = function () {
			var models = {	rgb:	{r: 0, g: 0, b: 0},
							hsv:	{h: 0, s: 0, v: 0},
							hsl:	{h: 0, s: 0, l: 0},
							lab:	{l: 0, a: 0, b: 0},
							cmyk:	{c: 0, m: 0, y: 0, k: 1}
						},
				a = 1,
				arg,
				args = arguments,
				_clip = function(v) {
					return Math.max(0, Math.min(v, 1));
				},
				_hexify = function (number) {
					var digits = '0123456789abcdef',
						lsd = number % 16,
						msd = (number - lsd) / 16,
						hexified = digits.charAt(msd) + digits.charAt(lsd);
					return hexified;
				},
				_rgb_to_xyz = function(rgb) {
					rgb.r = (rgb.r > 0.04045) ? ((rgb.r + 0.055) / 1.055) ^ 2.4 : rgb.r / 12.92;
					rgb.g = (rgb.g > 0.04045) ? ((rgb.g + 0.055) / 1.055) ^ 2.4 : rgb.g / 12.92;
					rgb.b = (rgb.b > 0.04045) ? ((rgb.b + 0.055) / 1.055) ^ 2.4 : rgb.b / 12.92;

					rgb.r *= 100;
					rgb.g *= 100;
					rgb.b *= 100;

					return {
						x: rgb.r * 0.4124 + rgb.g * 0.3576 + rgb.b * 0.1805,
						y: rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722,
						z: rgb.r * 0.0193 + rgb.g * 0.1192 + rgb.b * 0.9505
					};
				},
				_xyz_to_rgb = function(xyz) {
					xyz.x /= 100;
					xyz.y /= 100;
					xyz.z /= 100;

					var rgb = {
						r: xyz.x *  3.2406 + xyz.y * -1.5372 + xyz.z * -0.4986,
						g: xyz.x * -0.9689 + xyz.y *  1.8758 + xyz.z *  0.0415,
						b: xyz.x *  0.0557 + xyz.y * -0.2040 + xyz.z *  1.0570
					};

					rgb.r = (rgb.r > 0.0031308) ?  1.055 * (rgb.r ^ (1 / 2.4)) - 0.055 : 12.92 * rgb.r;
					rgb.g = (rgb.g > 0.0031308) ?  1.055 * (rgb.g ^ (1 / 2.4)) - 0.055 : 12.92 * rgb.g;
					rgb.b = (rgb.b > 0.0031308) ?  1.055 * (rgb.b ^ (1 / 2.4)) - 0.055 : 12.92 * rgb.b;

					return rgb;
				},
				_rgb_to_hsv = function(rgb) {
					var minVal = Math.min(rgb.r, rgb.g, rgb.b),
						maxVal = Math.max(rgb.r, rgb.g, rgb.b),
						delta = maxVal - minVal,
						del_R, del_G, del_B;

					var hsv = {
						h: 0,
						s: 0,
						v: maxVal
					};

					if (delta === 0) {
						hsv.h = 0;
						hsv.s = 0;
					} else {
						hsv.s = delta / maxVal;

						del_R = (((maxVal - rgb.r) / 6) + (delta / 2)) / delta;
						del_G = (((maxVal - rgb.g) / 6) + (delta / 2)) / delta;
						del_B = (((maxVal - rgb.b) / 6) + (delta / 2)) / delta;

						if (rgb.r === maxVal) {
							hsv.h = del_B - del_G;
						} else if (rgb.g === maxVal) {
							hsv.h = (1 / 3) + del_R - del_B;
						} else if (rgb.b === maxVal) {
							hsv.h = (2 / 3) + del_G - del_R;
						}

						if (hsv.h < 0) {
							hsv.h += 1;
						} else if (hsv.h > 1) {
							hsv.h -= 1;
						}
					}

					return hsv;
				},
				_hsv_to_rgb = function(hsv) {
					var rgb = {
						r: 0,
						g: 0,
						b: 0
					};

					if (hsv.s === 0) {
						rgb.r = rgb.g = rgb.b = hsv.v;
					} else {
						var var_h = hsv.h === 1 ? 0 : hsv.h * 6,
							var_i = Math.floor(var_h),
							var_1 = hsv.v * (1 - hsv.s),
							var_2 = hsv.v * (1 - hsv.s * (var_h - var_i)),
							var_3 = hsv.v * (1 - hsv.s * (1 - (var_h - var_i)));

						if (var_i === 0) {
							rgb.r = hsv.v;
							rgb.g = var_3;
							rgb.b = var_1;
						} else if (var_i === 1) {
							rgb.r = var_2;
							rgb.g = hsv.v;
							rgb.b = var_1;
						} else if (var_i === 2) {
							rgb.r = var_1;
							rgb.g = hsv.v;
							rgb.b = var_3;
						} else if (var_i === 3) {
							rgb.r = var_1;
							rgb.g = var_2;
							rgb.b = hsv.v;
						} else if (var_i === 4) {
							rgb.r = var_3;
							rgb.g = var_1;
							rgb.b = hsv.v;
						} else {
							rgb.r = hsv.v;
							rgb.g = var_1;
							rgb.b = var_2;
						}
					}

					return rgb;
				},
				_rgb_to_hsl = function(rgb) {
					var minVal = Math.min(rgb.r, rgb.g, rgb.b),
						maxVal = Math.max(rgb.r, rgb.g, rgb.b),
						delta = maxVal - minVal,
						del_R, del_G, del_B;

					var hsl = {
						h: 0,
						s: 0,
						l: (maxVal + minVal) / 2
					};

					if (delta === 0) {
						hsl.h = 0;
						hsl.s = 0;
					} else {
						hsl.s = hsl.l < 0.5 ? delta / (maxVal + minVal) : delta / (2 - maxVal - minVal);

						del_R = (((maxVal - rgb.r) / 6) + (delta / 2)) / delta;
						del_G = (((maxVal - rgb.g) / 6) + (delta / 2)) / delta;
						del_B = (((maxVal - rgb.b) / 6) + (delta / 2)) / delta;

						if (rgb.r === maxVal) {
							hsl.h = del_B - del_G;
						} else if (rgb.g === maxVal) {
							hsl.h = (1 / 3) + del_R - del_B;
						} else if (rgb.b === maxVal) {
							hsl.h = (2 / 3) + del_G - del_R;
						}

						if (hsl.h < 0) {
							hsl.h += 1;
						} else if (hsl.h > 1) {
							hsl.h -= 1;
						}
					}

					return hsl;
				},
				_hsl_to_rgb = function(hsl) {
					var hue_to_rgb	= function(v1, v2, vH) {
										if (vH < 0) vH += 1;
										if (vH > 1) vH -= 1;
										if ((6 * vH) < 1) return v1 + (v2 - v1) * 6 * vH;
										if ((2 * vH) < 1) return v2;
										if ((3 * vH) < 2) return v1 + (v2 - v1) * ((2 / 3) - vH) * 6;
										return v1;
									};

					if (hsl.s === 0) {
						return {
							r: hsl.l,
							g: hsl.l,
							b: hsl.l
						};
					}

					var var_2 = (hsl.l < 0.5) ? hsl.l * (1 + hsl.s) : (hsl.l + hsl.s) - (hsl.s * hsl.l),
						var_1 = 2 * hsl.l - var_2;

					return {
						r: hue_to_rgb(var_1, var_2, hsl.h + (1 / 3)),
						g: hue_to_rgb(var_1, var_2, hsl.h),
						b: hue_to_rgb(var_1, var_2, hsl.h - (1 / 3))
					};
				},
				_xyz_to_lab = function(xyz) {
					// CIE-L*ab
					xyz.x /= 95.047;
					xyz.y /= 100;
					xyz.z /= 108.883;

					xyz.x = (xyz.x > 0.008856) ? xyz.x ^ (1/3) : (7.787 * xyz.x) + (16 / 116);
					xyz.y = (xyz.y > 0.008856) ? xyz.y ^ (1/3) : (7.787 * xyz.y) + (16 / 116);
					xyz.z = (xyz.z > 0.008856) ? xyz.z ^ (1/3) : (7.787 * xyz.z) + (16 / 116);

					return {
						l: (116 * xyz.y) - 16,
						a: 500 * (xyz.x - xyz.y),
						b: 200 * (xyz.y - xyz.z)
					}
				},
				_lab_to_xyz = function(lab) {
					var xyz = {
						x: 0,
						y: (lab.l + 16) / 116,
						z: 0
					};

					xyz.x = lab.a / 500 + xyz.y;
					xyz.z = xyz.y - lab.b / 200;

					xyz.x = (xyz.x ^ 3 > 0.008856) ? xyz.x ^ 3 : (xyz.x - 16 / 116) / 7.787;
					xyz.y = (xyz.y ^ 3 > 0.008856) ? xyz.y ^ 3 : (xyz.y - 16 / 116) / 7.787;
					xyz.z = (xyz.z ^ 3 > 0.008856) ? xyz.z ^ 3 : (xyz.z - 16 / 116) / 7.787;

					xyz.x *= 95.047;
					xyz.y *= 100;
					xyz.z *= 108.883;

					return xyz;
				},
				_rgb_to_cmy = function(rgb) {
					return {
						c: 1 - (rgb.r),
						m: 1 - (rgb.g),
						y: 1 - (rgb.b)
					}
				},
				_cmy_to_rgb = function(cmy) {
					return {
						r: 1 - (cmy.c),
						g: 1 - (cmy.m),
						b: 1 - (cmy.y)
					}
				},
				_cmy_to_cmyk = function(cmy) {
					var K = 1;

					if (cmy.c < K )   K = cmy.c;
					if (cmy.m < K )   K = cmy.m;
					if (cmy.y < K )   K = cmy.y;

					if (K == 1) {
						return {
							c: 0,
							m: 0,
							y: 0,
							k: 1
						};
					}

					return {
						c: (cmy.c - K) / (1 - K),
						m: (cmy.m - K) / (1 - K),
						y: (cmy.y - K) / (1 - K),
						k: K
					};
				},
				_cmyk_to_cmy = function(cmyk) {
					return {
						c: cmyk.c * (1 - cmyk.k) + cmyk.k,
						m: cmyk.m * (1 - cmyk.k) + cmyk.k,
						y: cmyk.y * (1 - cmyk.k) + cmyk.k
					};
				};

			this.set = true;

			this.setA = function(_a) {
				if (_a !== null)	a = _clip(_a);
			}

			this.getA = function() {
				return a;
			}

			this.setRGB = function(r, g, b) {
				models = { rgb: this.getRGB() };
				if (r !== null)		models.rgb.r = _clip(r);
				if (g !== null)		models.rgb.g = _clip(g);
				if (b !== null)		models.rgb.b = _clip(b);
			}

			this.setHSV = function(h, s, v) {
				models = { hsv: this.getHSV() };
				if (h !== null)		models.hsv.h = _clip(h);
				if (s !== null)		models.hsv.s = _clip(s);
				if (v !== null)		models.hsv.v = _clip(v);
			}

			this.setHSL = function(h, s, l) {
				models = { hsl: this.getHSL() };
				if (h !== null)		models.hsl.h = _clip(h);
				if (s !== null)		models.hsl.s = _clip(s);
				if (l !== null)		models.hsl.l = _clip(l);
			}

			this.setLAB = function(l, a, b) {
				models = { lab: this.getLAB() };
				if (l !== null)		models.lab.l = _clip(l);
				if (a !== null)		models.lab.a = _clip(a);
				if (b !== null)		models.lab.b = _clip(b);
			}

			this.setCMYK = function(c, m, y, k) {
				models = { cmyk: this.getCMYK() };
				if (c !== null)		models.cmyk.c = _clip(c);
				if (m !== null)		models.cmyk.m = _clip(m);
				if (y !== null)		models.cmyk.y = _clip(y);
				if (k !== null)		models.cmyk.k = _clip(k);
			}

			this.getRGB = function() {
				if (!models.rgb) {
					models.rgb	= models.hsv ?	_hsv_to_rgb(models.hsv)
								: models.hsl ?	_hsl_to_rgb(models.hsl)
								: models.cmyk ?	_cmy_to_rgb(_cmyk_to_cmy(models.cmyk))
								: models.lab ?	_xyz_to_rgb(_lab_to_xyz(models.lab))
								: { r: 0, g: 0, b: 0 };
				}
				return $.extend({}, models.rgb);
			};

			this.getHSV = function() {
				if (!models.hsv) {
					models.hsv	= models.rgb ?	_rgb_to_hsv(models.rgb)
								: models.hsl ?	_rgb_to_hsv(this.getRGB())
								: models.cmyk ?	_rgb_to_hsv(this.getRGB())
								: models.lab ?	_rgb_to_hsv(this.getRGB())
								: { h: 0, s: 0, v: 0 };
				}
				return $.extend({}, models.hsv);
			};

			//@todo getHSL, getLAB, getCMYK

			this.getChannels = function() {
				return {
					r:	this.getRGB().r,
					g:	this.getRGB().g,
					b:	this.getRGB().b,
					a:	this.getA(),
					h:	this.getHSV().h,
					s:	this.getHSV().s,
					v:	this.getHSV().v
				};
			};

			this.equals = function (rgb) {
				var model = this.getRGB();

				return rgb[0] === model.r
					&& rgb[1] === model.g
					&& rgb[2] === model.b;
			};

			this.limit = function (steps) {
				steps -= 1;
				var rgb = this.getRGB();
				this.setRGB(
					Math.round(rgb.r * steps) / steps,
					Math.round(rgb.g * steps) / steps,
					Math.round(rgb.b * steps) / steps
				);
			};

			this.toHex = function () {
				var rgb = this.getRGB();
				return _hexify(rgb.r * 255) + _hexify(rgb.g * 255) + _hexify(rgb.b * 255);
			};

			this.toCSS = function () {
				return '#' + this.toHex();
			};

			this.normalize = function() {
				this.setHSV(null, 1, 1);
				return this;
			};

			this.copy = function () {
				var rgb = this.getRGB();
				var a = this.getA();
				return new Color(rgb.r, rgb.g, rgb.b, a);
			};

			// Construct
			if (args.length > 0) {
				this.setRGB(args[0], args[1], args[2]);
				this.setA(args[3] === 0 ? 0 : args[3] || 1);
			}
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
			buttonText:			null,		// Text on the button and/or title of button image.
			closeOnEscape:		true,		// Close the dialog when the escape key is pressed.
			closeOnOutside:		true,		// Close the dialog when clicking outside the dialog (not for inline)
			color:				'#00FF00',	// Initial color (for inline only)
			colorFormat:		'HEX',		// Format string for output color format
			duration:			'fast',
			hsv:				true,		// Show HSV controls and modes
			regional:			'',
			layout: {
				map:		[0, 0, 1, 5],	// Left, Top, Width, Height (in table cells).
				bar:		[1, 0, 1, 5],
				preview:	[2, 0, 1, 1],
				hsv:		[2, 1, 1, 1],
				rgb:		[2, 2, 1, 1],
				alpha:		[2, 3, 1, 1],
				hex:		[2, 4, 1, 1],
				swatches:	[3, 0, 1, 5]
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

			init:				null,
			close:              null,
			select:             null
		},

		_create: function () {
			var that = this;

			++_colorpicker_index;

			that.widgetEventPrefix = 'color';

			that.opened		= false;
			that.generated	= false;
			that.inline		= false;
			that.changed	= false;

			that.dialog		= null;
			that.button		= null;
			that.image		= null;

			that.mode		= that.options.mode;

			if (that.options.swatches === null) {
				that.options.swatches = _colors;
			}

			if (this.element[0].nodeName.toLowerCase() === 'input') {
				that._setColor(that.element.val());

				this._callback('init');

				$('body').append(_container_popup);
				that.dialog = $('.ui-colorpicker:last');

				// Click outside/inside
				$(document).mousedown(function (event) {
					if (!that.opened || event.target === that.element[0]) {
						return;
					}

					// Check if clicked on any part of dialog
					if ($(event.target).closest('.ui-colorpicker').length > 0) {
						that.element.blur();	// inside window!
						return;
					}

					// Check if clicked on button
					var p,
						parents = $(event.target).parents();
					for (p in parents) {
						if (that.button !== null && parents[p] === that.button[0]) {
							return;
						}
					}

					// no closeOnOutside
					if (!that.options.closeOnOutside) {
						return;
					}

					that.close();
				});

				$(document).keydown(function (event) {
					if (event.keyCode == 27 && that.opened && that.options.closeOnEscape) {
						that.close();
					}
				});

				if (that.options.showOn === 'focus' || that.options.showOn === 'both') {
					that.element.focus(function () {
						that.open();
					});
				}
				if (that.options.showOn === 'button' || that.options.showOn === 'both') {
					if (that.options.buttonImage !== '') {
						var text = that.options.buttonText ? that.options.buttonText : that._getRegional('button');

						that.image = $('<img/>').attr({
							'src':		that.options.buttonImage,
							'alt':		text,
							'title':	text
						});

						that._setImageBackground();
					}

					if (that.options.buttonImageOnly && that.image) {
						that.button = that.image;
					} else {
						that.button = $('<button type="button"></button>').html(that.image || that.options.buttonText).button();
						that.image = that.image ? $('img', that.button).first() : null;
					}
					that.button.insertAfter(that.element).click(function () {
						that[that.opened ? 'close' : 'open']();
					});
				}

				if (that.options.autoOpen) {
					that.open();
				}

				that.element.keydown(function (event) {
					if (event.keyCode === 9) {
						that.close();
					}
				}).keyup(function (event) {
					var rgb = _parseHex(that.element.val());
					if (rgb) {
						that.color = (rgb === false ? new Color() : new Color(rgb[0], rgb[1], rgb[2]));
						that._change();
					}
				});
			} else {
				that.inline = true;

				$(this.element).html(_container_inline);
				that.dialog = $('.ui-colorpicker', this.element);

				that._generate();

				that.opened = true;
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
			var that = this;

			switch (key) {
			case "disabled":
				if (value) {
					that.dialog.addClass('ui-colorpicker-disabled');
				} else {
					that.dialog.removeClass('ui-colorpicker-disabled');
				}
				break;
			}

			$.Widget.prototype._setOption.apply(that, arguments);
		},

		/* setBackground */
		_setImageBackground: function() {
			if (this.image && this.options.buttonColorize) {
				this.image.css('background-color', this.color.set? _formatColor('RGBA', this.color) : '');
			}
		},

		/**
		 * If an alternate field is specified, set it according to the current color.
		 */
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
							$(this.options.altField).css(property, this.color.set? this.color.toCSS() : '');
							break;
					}
				}

				if (this.options.altAlpha) {
					$(this.options.altField).css('opacity', this.color.set? this.color.getA() : '');
				}
			}
		},

		_setColor: function(text) {
			var rgb = _parseColor(text);
			this.color = (rgb === false ? new Color() : new Color(rgb[0], rgb[1], rgb[2], rgb[3]));
			this.currentColor = this.color.copy();

			this._setImageBackground();
			this._setAltField();
		},

		setColor: function(text) {
			this._setColor(text);
			this._change(this.color.set);
		},

		_generate: function () {
			var that = this,
				index,
				part,
				parts_list;

			// Set color based on element?
			that._setColor(that.inline? that.options.color : that.element.val());

			// Determine the parts to include in this colorpicker
			if (typeof that.options.parts === 'string') {
				if (that.options.parts in _parts_lists) {
					parts_list = _parts_lists[that.options.parts];
				} else {
					// automatic
					parts_list = _parts_lists[that.inline ? 'inline' : 'popup'];
				}
			} else {
				parts_list = that.options.parts;
			}

			// Add any parts to the internal parts list
			that.parts = {};
			for (index in parts_list) {
				part = parts_list[index];
				if (part in _parts) {
					that.parts[part] = new _parts[part](that);
				}
			}

			if (!that.generated) {
				var layout_parts = [];

				for (index in that.options.layout) {
					if (index in that.parts) {
						layout_parts.push({
							part: index,
							pos: that.options.layout[index]
						});
					}
				}

				$(_layoutTable(layout_parts, function(cell, x, y) {
					var classes = ['ui-colorpicker-' + cell.part + '-container'];

					if (x > 0) {
						classes.push('ui-colorpicker-padding-left');
					}

					if (y > 0) {
						classes.push('ui-colorpicker-padding-top');
					}

					return '<td  class="' + classes.join(' ') + '"'
						+ (cell.pos[2] > 1 ? ' colspan="' + cell.pos[2] + '"' : '')
						+ (cell.pos[3] > 1 ? ' rowspan="' + cell.pos[3] + '"' : '')
						+ ' valign="top"></td>';
				})).appendTo(that.dialog).addClass('ui-dialog-content ui-widget-content');

				that._initAllParts();
				that._generateAllParts();
				that.generated = true;
			}
		},

		_effectGeneric: function (show, slide, fade, callback) {
			var that = this;

			if ($.effects && $.effects[that.options.showAnim]) {
				that.dialog[show](that.options.showAnim, that.options.showOptions, that.options.duration, callback);
			} else {
				that.dialog[(that.options.showAnim === 'slideDown' ?
								slide
							:	(that.options.showAnim === 'fadeIn' ?
									fade
								:	show))]((that.options.showAnim ? that.options.duration : null), callback);
				if (!that.options.showAnim || !that.options.duration) {
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
			var that = this;

			if (!that.opened) {
				// Automatically find highest z-index.
				$(that.element[0]).parents().each(function() {
					var zIndex = $(this).css('z-index');
					if ((typeof(zIndex) === 'number' || typeof(zIndex) === 'string') && zIndex !== '' && !isNaN(zIndex)) {
						that.dialog.css('z-index', zIndex + 1);
						return false;
					}
				});

				that._generate();

				var offset = that.element.offset(),
					x = offset.left,
					y = offset.top + that.element.outerHeight();
				x -= Math.max(0, (x + that.dialog.width()) - $(window).width() + 20);
				y -= Math.max(0, (y + that.dialog.height()) - $(window).height() + 20);
				that.dialog.css({'left': x, 'top': y});

				that._effectShow();
				that.opened = true;

				// Without waiting for domready the width of the map is 0 and we
				// wind up with the cursor stuck in the upper left corner
				$(function() {
					that._repaintAllParts();
				});
			}
		},

		close: function () {
			var that = this;

			that.currentColor	= that.color.copy();
			that.changed		= false;

			// tear down the interface
			that._effectHide(function () {
				that.dialog.empty();
				that.generated	= false;

				that.opened		= false;
				that._callback('close');
			});
		},

		_callback: function (callback) {
			var that = this;

			if (that.color.set) {
				that._trigger(callback, null, {
					formatted: _formatColor(that.options.colorFormat, that.color),
					r: that.color.getRGB().r,
					g: that.color.getRGB().g,
					b: that.color.getRGB().b,
					a: that.color.getA(),
					h: that.color.getHSV().h,
					s: that.color.getHSV().s,
					v: that.color.getHSV().v
				});
			} else {
				that._trigger(callback, null, {
					formatted: ''
				});
			}
		},

		_initAllParts: function () {
			$.each(this.parts, function (index, part) {
				if (part.init) {
					part.init();
				}
			});
		},

		_generateAllParts: function () {
			$.each(this.parts, function (index, part) {
				if (part.generate) {
					part.generate();
				}
			});
		},

		_repaintAllParts: function () {
			$.each(this.parts, function (index, part) {
				if (part.repaint) {
					part.repaint();
				}
			});
		},

		_change: function (set /* = true */) {
			this.color.set = (set !== false);

			this.changed = true;

			// Limit color palette
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

				case 'name':
					var name = _closestName(this.color);
					this.color.setRGB(_colors[name][0] / 255, _colors[name][1] / 255, _colors[name][2] / 255);
					break
			}

			// update colors
			if (!this.inline) {
				if (!this.color.set) {
					this.element.val('');
				} else if(!this.color.equals(_parseHex(this.element.val()))) {
					this.element.val(this.color.toHex());
				}

				this._setImageBackground();
				this._setAltField();
			}

			if (this.opened) {
				this._repaintAllParts();
			}

			// callback
			this._callback('select');
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
        }
	});

}(jQuery));
