var utils = (function() {
  var concat = Array.prototype.concat
    , slice = Array.prototype.slice;

  return {
    // common utilities
    // ----------------

    isString: function(obj) {
      return typeof obj === 'string';
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

      event.which = event.keyCode = utils.isString(key) ?
        key.charCodeAt(0) : key;

      return event;
    }

  , getCursorPos: function($input) {
      var selectionStart = $input[0].selectionStart;

      if (selectionStart) {
       return selectionStart;
      }

      else if (document.selection) {
        $input.focus();

        var range = document.selection.createRange();
        range.moveStart('character', -valueLength);

        return range.text.length;
      }
    }

  , setCursorPos: function($input, pos) {
      var input = $input[0]
        , textRange;

      if (input.createTextRange) {
        textRange = input.createTextRange();
        textRange.collapse(true);
        textRange.moveEnd(pos);
        textRange.moveStart(pos);
        textRange.select();
      }

      else if (input.setSelectionRange) {
        input.setSelectionRange(pos, pos);
      }
    }
  };
})();
