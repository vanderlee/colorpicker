from pathlib import Path

path = Path('jquery.colorpicker.js')
text = path.read_text(encoding='utf-8')


def replace(old, new, count):
    global text
    actual = text.count(old)
    if actual != count:
        raise SystemExit('Expected %d occurrences, found %d' % (count, actual))
    text = text.replace(old, new)


replace(
    """    _keycode = {
      isPrint: function(keycode) {
""",
    """    _eventPoint = function(event) {
      var original = event.originalEvent || event,
        touch = (original.touches && original.touches[0])
          || (original.changedTouches && original.changedTouches[0]);

      return touch || event;
    },

    _keycode = {
      isPrint: function(keycode) {
""",
    1
)

replace(
    """          var offset = layers.p.offset(),
            x = event.pageX - offset.left,
            y = event.pageY - offset.top;
""",
    """          var point = _eventPoint(event),
            offset = layers.p.offset(),
            x = point.pageX - offset.left,
            y = point.pageY - offset.top;
""",
    2
)

replace(
    """            part.off('mousedown', _mousedown).focus();
            $(document).on('mouseup', _mouseup);
            $(document).on('mousemove', _mousemove);
""",
    """            part.off('mousedown touchstart', _mousedown).focus();
            $(document).on('mouseup touchend touchcancel', _mouseup);
            $(document).on('mousemove touchmove', _mousemove);
""",
    2
)

replace(
    """          $(document).off('mouseup', _mouseup);
          $(document).off('mousemove', _mousemove);
          part.on('mousedown', _mousedown);
""",
    """          $(document).off('mouseup touchend touchcancel', _mouseup);
          $(document).off('mousemove touchmove', _mousemove);
          part.on('mousedown touchstart', _mousedown);
""",
    2
)

replace(
    """          if (event.pageX === that.x && event.pageY === that.y) {
            return;
          }
          that.x = event.pageX;
          that.y = event.pageY;

          var offset = layers.p.offset(),
            x = event.pageX - offset.left,
            y = event.pageY - offset.top;
""",
    """          var point = _eventPoint(event);

          if (point.pageX === that.x && point.pageY === that.y) {
            return;
          }
          that.x = point.pageX;
          that.y = point.pageY;

          var offset = layers.p.offset(),
            x = point.pageX - offset.left,
            y = point.pageY - offset.top;
""",
    1
)

replace(
    """          if (event.pageY === that.y) {
            return;
          }
          that.y = event.pageY;

          var offset  = layers.p.offset(),
            y = event.pageY - offset.top;
""",
    """          var point = _eventPoint(event);

          if (point.pageY === that.y) {
            return;
          }
          that.y = point.pageY;

          var offset  = layers.p.offset(),
            y = point.pageY - offset.top;
""",
    1
)

replace(
    """          part.on('mousedown', _mousedown);
          part.on('keydown', _keydown);
""",
    """          part.on('mousedown touchstart', _mousedown);
          part.on('keydown', _keydown);
""",
    2
)

replace(
    """          part[disable ? 'off' : 'on']('mousedown', _mousedown);
          part[disable ? 'off' : 'on']('keydown', _keydown);
""",
    """          part[disable ? 'off' : 'on']('mousedown touchstart', _mousedown);
          part[disable ? 'off' : 'on']('keydown', _keydown);
""",
    2
)

path.write_text(text, encoding='utf-8')
Path('.github/workflows/apply-touch-drag-fix.yml').unlink()
Path('tools/apply-touch-drag-fix.py').unlink()
