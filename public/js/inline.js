
var escape_function = function(scope, elm, attr) {
    elm.bind('keydown', function(e) {
      if (e.keyCode === 27) {
        scope.$apply(attr.onEsc);
      }
    });
  };
// On esc event
app.directive('onEsc', function() {
    return escape_function;
});

/*
app.directive('onBlur', function() {
  return function(scope, elm, attr) {
    elm.bind('blur', function(e) {
        scope.$apply(attr.onEnter);
    });
  };
});
*/
// On enter event
app.directive('onEnter', function() {
  return function(scope, elm, attr) {
    elm.bind('keypress', function(e) {
      if (e.keyCode === 13) {
        if (e.shiftKey !== true) {
          scope.$apply(attr.onEnter);
        }         
      }
    });
  };
});

app.directive('onTab', function() {
  return function(scope, elm, attr) {
    elm.bind('keydown', function(e) {
      if (e.keyCode === 9) {
        scope.$apply(attr.onTab);
      }
    });
  };
});

app.directive('inputReadonly', function($timeout) {
    return get_inline_readonly('=inputReadonly', "text");
});
app.directive('inputReadonlyDate', function($timeout) {
    return get_inline_readonly('=inputReadonlyDate', "date");
});
// Inline edit directive
app.directive('tabFormInputInlineEdit', function($timeout) {
    return get_inline_edit_widget($timeout, "text", "=tabFormInputInlineEdit", 'partials/tab-form-input-inline-edit');
});

app.directive('inputInlineSelectRelaut', function($timeout) {
    return get_inline_select_widget($timeout, "select", '=inputInlineSelectRelaut', 'partials/input-inline-select-pp');
});

app.directive('inputInlineSelect', function($timeout) {
    return get_inline_select_widget($timeout, "select", '=inputInlineSelect', 'partials/input-inline-select');
});

app.directive('inputInlineSelectPp', function($timeout) {
    return get_inline_select_widget($timeout, "select", '=inputInlineSelectPp', 'partials/input-inline-select-pp');
});

app.directive('inputInlineSelectCodigo', function($timeout) {
    return get_inline_select_widget($timeout, "select", '=inputInlineSelectCodigo', 'partials/input-inline-select-codigo');
});

app.directive('inputInlineSelectMenorStatus', function($timeout) {
    return get_inline_select_widget($timeout, "select", '=inputInlineSelectMenorStatus', 'partials/input-inline-select-menor');
});

app.directive('inputInlineNumber', function($timeout) {
    return get_inline_edit_widget($timeout, "number", '=inputInlineNumber', 'partials/input-inline-number');
});

app.directive('inputInlineEdit', function($timeout) {
    return get_inline_edit_widget($timeout, "text", '=inputInlineEdit', 'partials/input-inline-edit');
});

app.directive('inputInlineTime', function($timeout) {
    return get_inline_edit_widget($timeout, "time", '=inputInlineTime', 'partials/input-inline-time');
});

app.directive('inputInlineText', function($timeout) {
    return get_inline_edit_widget($timeout, "textarea", '=inputInlineText', 'partials/input-inline-text');
});

app.directive('inputInlineDate', function($timeout) {
    return get_inline_edit_widget($timeout, "date", '=inputInlineDate', 'partials/input-inline-date');
});

app.directive('inputInlinePassword', function($timeout) {
    return get_inline_edit_widget($timeout, "masked", '=inputInlinePassword', 'partials/input-inline-password');
});

app.directive('inputInlineRadio', function($timeout) {
    return get_inline_edit_widget($timeout, "radio", '=inputInlineRadio', 'partials/input-inline-radio');
});

get_inline_readonly = function(model, type) { 
  
  var template = 'partials/input-readonly';

  if (type == "date") {
    template = 'partials/input-readonly-date'
  }

  return {
    scope: {
      model: model,
    },
    templateUrl: template
   } 
};

get_inline_select_widget = function($timeout, type, model, template) { 

  return {
    scope: {      
      opciones: "=opciones",
      tabindex: "@tabindex",
      model: model,
      handleSave: '&onSave',
      handleCancel: '&onCancel'
    },
    link: function(scope, elm, attr) {      
      var previousValue;

      scope.edit = function() {
        scope.editMode = true;
        previousValue = scope.model;

        $timeout(function() {
          elm.find('select')[0].focus();          
        }, 0, false);
      };
      scope.tab = function() {
        scope.editMode = false;
        if (previousValue != scope.model) {
          scope.handleSave({value: scope.model});
        }
      };
      scope.save = function() {
        scope.editMode = false;        
        scope.handleSave({value: scope.model});
      };
      scope.cancel = function() {
        scope.editMode = false;
        scope.model = previousValue;
        scope.handleCancel({value: scope.model});
      };
      scope.blur = function() {
        scope.editMode = false;
      }
    },
    templateUrl: template
  };
}

get_inline_edit_widget = function($timeout, type, model, template) { 

  return {
    scope: {
      tabindex: "@tabindex",
      model: model,
      handleSave: '&onSave',
      handleCancel: '&onCancel'
    },
    link: function(scope, elm, attr) {
      
      var previousValue;

      scope.edit = function() {
        scope.editMode = true;
        if (type=="date" && !scope.formatted) {
          date = "01/01/1970";
          if (scope.model) {
            date = new Date(scope.model);
          } else {
            date = new Date.now();
          }
          m = date.getMonth() + 1;
          d = date.getDate();
          y = date.getYear();
          scope.model = "" + d + "/"+ m + "/" + y;
          scope.formatted = true;
        }
        previousValue = scope.model;

        $timeout(function() {
          if (type == "textarea") {
            elm.find('textarea')[0].focus();
          } else {
            elm.find('input')[0].select();
          }
        }, 0, false);
      };
      scope.tab = function() {
        scope.editMode = false;
        if (previousValue != scope.model) {
          if (type=="date") {
            console.log(scope.model);
            scope.check_date_format();
          } else if (type == "time") {
            scope.check_time_format();
          }
          scope.handleSave({value: scope.model});
        }
      };
      scope.save = function() {
        scope.editMode = false;
        if (type=="date") {
            scope.check_date_format();
        } else if (type == "time") {
          scope.check_time_format();
        }
        scope.handleSave({value: scope.model});
      };
      scope.cancel = function() {
        scope.editMode = false;
        scope.model = previousValue;
        scope.handleCancel({value: scope.model});
      };
      scope.blur = function() {
        scope.editMode = false;
      };
      scope.check_time_format = function() {
        var time = scope.model;
        var h = time.substring(0,2);
        var m = time.substring(2,4);
        var s = time.substring(4);
        if (parseInt(h) > 59 || parseInt(m) > 59 || parseInt(s) > 59) {
          scope.time_invalid = true;
        } else {
          scope.time_invalid = false;
        }
        var new_model = "" + h + ":" + m + ":" + s
//        var seconds = parseInt(h)*3600 + parseInt(m)*60 + parseInt(s)
        scope.model = new_model;
      }
      scope.check_date_format = function() {
          var date = scope.model;
          d = date.substring(0,2);
          m = date.substring(2,4);
          y = date.substring(4);
          var new_model = "" + d + "/" + m + "/" +y;
          if (/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/.test(new_model)) {
            scope.model = new_model;
            scope.date_invalid = false;

          } else {
            scope.date_invalid = true;
          } 
      };
    },
    templateUrl: template
  };
}
