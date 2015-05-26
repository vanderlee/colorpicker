module('issues');

test('#94: Clicking black swatch on empty input does not change input', function() {
	expect(4);

	var $input = $('<input type="text" value=""/>').appendTo("#qunit-fixture");
	var jqcp = $input.colorpicker({
		parts: ['swatches']
	});
	
	equal($input.val(), '', 'Starts empty');
	
	jqcp.colorpicker('open');
	equal($input.val(), '', 'Still empty on open');
	
	$('.ui-colorpicker-swatch[title="white"]').click();
	equal($input.val(), 'ffffff', 'Clicking white, input white');
	
	$input.val('');
	$('.ui-colorpicker-swatch[title="black"]').click();
	equal($input.val(), '000000', 'Clicking black, input black (remains empty in issue #94).');
});


