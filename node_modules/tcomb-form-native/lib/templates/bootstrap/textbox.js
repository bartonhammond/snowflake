var { React } = require('../../util');
var { View, Text, TextInput } = React;

function textbox(locals) {

  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var textboxStyle = stylesheet.textbox.normal;
  var helpBlockStyle = stylesheet.helpBlock.normal;
  var errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    textboxStyle = stylesheet.textbox.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  if (locals.editable === false) {
    textboxStyle = stylesheet.textbox.notEditable;
  }

  var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

  return (
    <View style={formGroupStyle}>
      {label}
      <TextInput
        ref="input"
        autoCapitalize={locals.autoCapitalize}
        autoCorrect={locals.autoCorrect}
        autoFocus={locals.autoFocus}
        bufferDelay={locals.bufferDelay}
        clearButtonMode={locals.clearButtonMode}
        editable={locals.editable}
        enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
        keyboardType={locals.keyboardType}
        multiline={locals.multiline}
        onBlur={locals.onBlur}
        onEndEditing={locals.onEndEditing}
        onFocus={locals.onFocus}
        onSubmitEditing={locals.onSubmitEditing}
        password={locals.password}
        placeholderTextColor={locals.placeholderTextColor}
        returnKeyType={locals.returnKeyType}
        selectTextOnFocus={locals.selectTextOnFocus}
        secureTextEntry={locals.secureTextEntry}
        selectionState={locals.selectionState}
        onChangeText={(value) => locals.onChange(value)}
        placeholder={locals.placeholder}
        maxLength={locals.maxLength}
        numberOfLines={locals.numberOfLines}
        textAlign={locals.textAlign}
        textAlignVertical={locals.textAlignVertical}
        underlineColorAndroid={locals.underlineColorAndroid}
        style={textboxStyle}
        value={locals.value}
      />
      {help}
      {error}
    </View>
  );
}

module.exports = textbox;
