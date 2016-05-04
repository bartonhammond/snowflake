var { React } = require('../../util');
var { View, Text, PickerIOS } = React;

function select(locals) {

  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var selectStyle = stylesheet.select.normal;
  var helpBlockStyle = stylesheet.helpBlock.normal;
  var errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    selectStyle = stylesheet.select.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

  var options = locals.options.map(({value, text}) => <PickerIOS.Item key={value} value={value} label={text} />);

  return (
    <View style={formGroupStyle}>
      {label}
      <PickerIOS
        ref="input"
        style={selectStyle}
        selectedValue={locals.value}
        onValueChange={locals.onChange}
      >
        {options}
      </PickerIOS>
      {help}
      {error}
    </View>
  );
}

module.exports = select;