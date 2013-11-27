
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

app.directive('onBlur', function() {
  return function(scope, elm, attr) {
    elm.bind('blur', function(e) {
        //scope.$apply(attr.onBlur);
    });
  };
});

// On enter event
app.directive('onEnter', function() {
  return function(scope, elm, attr) {
    elm.bind('keypress', function(e) {
      if (e.keyCode === 13) {
        scope.$apply(attr.onEnter);
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
// Inline edit directive
// Inline edit directive
app.directive('tabFormInputInlineEdit', function($timeout) {
    return get_inline_edit_widget($timeout, "text", "=tabFormInputInlineEdit", 'partials/tab-form-input-inline-edit');
});

app.directive('inputInlineSelectRelaut', function($timeout) {
    return get_inline_select_widget($timeout, "select", '=inputInlineSelectRelaut', 'partials/input-inline-select-pp');
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

app.directive('inputInlineEdit', function($timeout) {
    return get_inline_edit_widget($timeout, "text", '=inputInlineEdit', 'partials/input-inline-edit');
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
      if (type == "select") {
        attr.$observe('opts',function(){
          scope.options = attr.opts;
          console.log(attr.opts);
        });
      }
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
        previousValue = scope.model;

        $timeout(function() {
          elm.find('input')[0].select();          
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
        if (type == "date") {
          if (/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/.test(scope.model)) {
            scope.date_invalid = false;
          } else {
            scope.date_invalid = true;
          } 
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
      }
    },
    templateUrl: template
  };
}