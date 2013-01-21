var utils = (function() {
  var concat = Array.prototype.concat
    , slice = Array.prototype.slice;

  return {
    // common utilities
    // ----------------

    isString: function(obj) {
      return typeof obj === 'string';
    }

  , isNumber: function(obj) {
      return typeof obj === 'number';
    }

  , isFunction: function(obj) {
      return $.isFunction(obj);
    }

  , isArray: function(obj) {
      return $.isArray(obj);
    }

  , each: function() {
      return $.each.apply($, arguments);
    }

  , map: function() {
      return $.map.apply($, arguments);
    }

  , bind: function() {
      return $.proxy.apply($, arguments);
    }

  , merge: function(array) {
      return concat.apply([], array);
    }

  , mixin: function() {
      return $.extend.apply($, arguments);
    }

    // stroke helpers
    // --------------

  , getKeyEvent: function(type, key) {
      var event = $.Event(type);

      if (type === 'keypress') {
        event.which =
        event.keyCode =
        event.charCode = utils.isString(key) ? key.charCodeAt(0) : key;
      }

      else if (type === 'keydown' || type === 'keyup') {
        event.charCode = 0;
        event.which = event.charCode = utils.isString(key) ?
          key.toUpperCase().charCodeAt(0) : key;
      }

      else if (type === 'textInput') {
        if (!utils.isString(key)) {
          throw new TypeError('non-string passed for textInput');
        }

        event.data = key;
      }

      return event;
    }

  , getSelection: function($input) {
      var selectionStart = $input[0].selectionStart
        , selectionEnd = $input[0].selectionEnd;

      if (utils.isNumber(selectionStart) && utils.isNumber(selectionEnd)) {
        return { start: selectionStart, end: selectionEnd };
      }

      // TODO: fallback solution for IE
      // http://stackoverflow.com/questions/3053542
    }

  , setSelection: function($input, start, end) {
      var input = $input[0]
        , textRange;

      if (input.setSelectionRange) {
        input.setSelectionRange(start, end);
      }

      // TODO: support carriage returns
      // http://stackoverflow.com/questions/8928660
      else if (input.createTextRange) {
        textRange = input.createTextRange();
        textRange.collapse(true);
        textRange.moveEnd(start);
        textRange.moveStart(end);
        textRange.select();
      }
    }

  , getCursorPos: function($input) {
      var selectionStart = $input[0].selectionStart;

      if (utils.isNumber(selectionStart)) {
       return selectionStart;
      }

      else if (document.selection) {
        $input.focus();

        var range = document.selection.createRange();
        range.moveStart('character', -$input.val().length);

        return range.text.length;
      }
    }

  , setCursorPos: function($input, pos) {
      utils.setSelection($input, pos, pos);
    }
  };
})();
