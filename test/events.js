module('events');

test('Empty input value should not set altField background to black', function() {
  expect(4);

  var $input = $('<input type="text" value=""/>').appendTo('#qunit-fixture');
  var $altfield = $('<div></div>').appendTo('#qunit-fixture');

  equal($altfield.css('backgroundColor'), 'rgba(0, 0, 0, 0)', 'Initial state, no color');

  var jqcp = $input.colorpicker({
    altField: $altfield
  });

  equal($altfield.css('backgroundColor'), 'rgba(0, 0, 0, 0)', 'After creation, no color');

  jqcp.colorpicker('open');

  equal($altfield.css('backgroundColor'), 'rgba(0, 0, 0, 0)', 'After open, no color');

  jqcp.colorpicker('close');

  equal($altfield.css('backgroundColor'), 'rgba(0, 0, 0, 0)', 'After close, no color');
});

test('altContrast should keep altField text readable', function() {
  expect(4);

  var $input = $('<input type="text" value="#000000"/>').appendTo('#qunit-fixture');
  var $altfield = $('<div></div>').appendTo('#qunit-fixture');

  var jqcp = $input.colorpicker({
    altContrast: true,
    altField: $altfield
  });

  equal($altfield.css('color'), 'rgb(255, 255, 255)', 'Dark colors use white text');

  jqcp.colorpicker('setColor', '#ffffff');
  equal($altfield.css('color'), 'rgb(0, 0, 0)', 'Light colors use black text');

  jqcp.colorpicker('setColor', '#777777');
  equal($altfield.css('color'), 'rgb(0, 0, 0)', 'The text color with the greater contrast is used');

  jqcp.colorpicker('setColor', '');
  equal($altfield[0].style.color, '', 'No color restores the stylesheet text color');
});

asyncTest('Changing the color in input should trigger a \'change\' event on the input', function() {
  expect(1);

  var $input = $('<input type="text" value=""/>').appendTo('#qunit-fixture');

  $input.change(function() {
    ok(true, 'triggered');
    start();
  });

  var jqcp = $input.colorpicker();

  jqcp.colorpicker('setColor', 'red');
});
