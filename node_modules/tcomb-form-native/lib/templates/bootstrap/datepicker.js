var { React } = require('../../util');
var { View, Text, DatePickerIOS } = React;

function datepicker(locals) {

  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var datepickerStyle = stylesheet.datepicker.normal;
  var helpBlockStyle = stylesheet.helpBlock.normal;
  var errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    datepickerStyle = stylesheet.datepicker.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

  return (
    <View style={formGroupStyle}>
      {label}
      <DatePickerIOS
        ref="input"
        maximumDate={locals.maximumDate}
        minimumDate={locals.minimumDate}
        minuteInterval={locals.minuteInterval}
        mode={locals.mode}
        timeZoneOffsetInMinutes={locals.timeZoneOffsetInMinutes}
        style={datepickerStyle}
        onDateChange={(value) => locals.onChange(value)}
        date={locals.value}
      />
      {help}
      {error}
    </View>
  );
}

module.exports = datepicker;