var { React } = require('../../util');
var { View, Text } = React;

function struct(locals) {

  var stylesheet = locals.stylesheet;
  var fieldsetStyle = stylesheet.fieldset;
  var controlLabelStyle = stylesheet.controlLabel.normal;

  if (locals.hasError) {
    controlLabelStyle = stylesheet.controlLabel.error;
  }

  var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  var error = locals.hasError && locals.error ? <Text style={stylesheet.errorBlock}>{locals.error}</Text> : null;

  var rows = locals.order.map(function (name) {
    return locals.inputs[name];
  });

  return (
    <View style={fieldsetStyle}>
      {label}
      {error}
      {rows}
    </View>
  );
}

module.exports = struct;