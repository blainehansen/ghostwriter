var utils = (function() {
  var nativeForEach = [].forEach
    , nativeMap = [].map
    , breaker = {};

  return {
    // common utilities
    // ----------------

    isString: function(obj) {
      return typeof obj === 'string';
    }

  , isArray: function(obj) {
      Object.prototype.toString.call(obj) === '[object Array]';
    }

    // stolen from underscore
  , each: function(obj, iterator, context) {
      if (!obj)  { return; }

      // native
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      }

      // non-native array
      else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === breaker) {
            return;
          }
        }
      }

      // non-native object
      else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (iterator.call(context, obj[key], key, obj) === breaker) {
              return;
            }
          }
        }
      }
    }

    // stolen from underscore
  , map: function(obj, iterator, context) {
      var results = [];

      if (!obj) { return results; }

      // native
      if (nativeMap && obj.map === nativeMap) {
        return obj.map(iterator, context);
      }

      // non-native
      utils.each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });

      return results;
    }

  , merge: function(array) {
      return [].concat.apply([], array);
    }

  , mixin: function(target) {
      var args = [].slice.call(arguments, 1), source;

      while (source = args.shift()) {
        for (var k in source) {
          source.hasOwnProperty(k) && (target[k] = source[k]);
        }
      }

      return target;
    }

    // ghostwriter specific utilities
    // ------------------------------

  , isRepeatified: function(obj) {
      return '_repeatified_' in obj;
    }


  , repeatify: function(strokes) {
      var repeatifiedStrokes = {};

      utils.each(strokes, function(val, key) {
        repeatifiedStrokes[key] = function repeat(times) {
          var strokes = [];
          while (times--) { strokes.push(val); }

          return strokes;
        };

        repeatifiedStrokes[key]._repeatified_ = true;
      });

      return repeatifiedStrokes;
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
