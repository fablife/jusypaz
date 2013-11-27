
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
      };
      scope.tab = function() {
      };
      scope.save = function() {
      };
      scope.cancel = function() {
      };
      scope.blur = function() {
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
      };
      scope.tab = function() {
      };
      scope.save = function() {
      };
      scope.cancel = function() {
      };
      scope.blur = function() {
      }
    },
    templateUrl: template
  };
}