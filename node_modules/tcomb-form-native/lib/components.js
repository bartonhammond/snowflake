'use strict';

var t = require('tcomb-validation');
var { React, humanize, merge, getTypeInfo, getOptionsOfEnum } = require('./util');

var SOURCE = 'tcomb-form-native';
var nooptions = Object.freeze({});
var noop = function () {};
var Nil = t.Nil;

function getComponent(type, options) {
  if (options.factory) {
    return options.factory;
  }
  var name = t.getTypeName(type);
  switch (type.meta.kind) {
    case 'irreducible' :
      return (
        type === t.Boolean ? Checkbox :
        type === t.Date ?  DatePicker :
                          Textbox
      );
    case 'struct' :
      return Struct;
    case 'enums' :
      return Select;
    case 'maybe' :
    case 'subtype' :
      return getComponent(type.meta.type, options);
    default :
      t.fail(`[${SOURCE}] unsupported type ${name}`);
  }
}

function sortByText(a, b) {
  return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
}

function getComparator(order) {
  return {
    asc: sortByText,
    desc: (a, b) => -sortByText(a, b)
  }[order];
}

class Component extends React.Component {

  constructor(props) {
    super(props);
    this.typeInfo = getTypeInfo(props.type);
    this.state = {
      hasError: false,
      value: this.getTransformer().format(props.value)
    };
  }

  getTransformer() {
    return this.props.options.transformer || this.constructor.transformer;
  }

  shouldComponentUpdate(nextProps, nextState) {
    var should = (
      nextState.value !== this.state.value ||
      nextState.hasError !== this.state.hasError ||
      nextProps.options !== this.props.options ||
      nextProps.type !== this.props.type
    );
    return should;
  }

  componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = getTypeInfo(props.type);
    }
    this.setState({value: this.getTransformer().format(props.value)});
  }

  onChange(value) {
    this.setState({value}, () => this.props.onChange(value, this.props.ctx.path));
  }

  getValidationOptions() {
    return {
      path: this.props.ctx.path,
      context: t.mixin(t.mixin({}, this.props.context || this.props.ctx.context), { options: this.props.options })
    };
  }

  getValue() {
    return this.getTransformer().parse(this.state.value);
  }

  isValueNully() {
    return Nil.is(this.getValue());
  }

  removeErrors() {
    this.setState({hasError: false});
  }

  validate() {
    var result = t.validate(this.getValue(), this.props.type, this.getValidationOptions());
    this.setState({hasError: !result.isValid()});
    return result;
  }

  getAuto() {
    return this.props.options.auto || this.props.ctx.auto;
  }

  getI18n() {
    return this.props.options.i18n || this.props.ctx.i18n;
  }

  getDefaultLabel() {
    var ctx = this.props.ctx;
    if (ctx.label) {
      return ctx.label + (this.typeInfo.isMaybe ? this.getI18n().optional : this.getI18n().required);
    }
  }

  getLabel() {
    var ctx = this.props.ctx;
    var legend = this.props.options.legend;
    var label = this.props.options.label;
    label = label || legend;
    if (Nil.is(label) && this.getAuto() === 'labels') {
      label = this.getDefaultLabel();
    }
    return label;
  }

  getError() {
    if (this.hasError()) {
      var error = this.props.options.error || this.typeInfo.getValidationErrorMessage;
      if (t.Function.is(error)) {
        var validationOptions = this.getValidationOptions();
        return error(this.getValue(), validationOptions.path, validationOptions.context);
      }
      return error;
    }
  }

  hasError() {
    return this.props.options.hasError || this.state.hasError;
  }

  getConfig() {
    return merge(this.props.ctx.config, this.props.options.config);
  }

  getStylesheet() {
    return this.props.options.stylesheet || this.props.ctx.stylesheet;
  }

  getLocals() {
    return {
      path: this.props.ctx.path,
      error: this.getError(),
      hasError: this.hasError(),
      label: this.getLabel(),
      onChange: this.onChange.bind(this),
      config: this.getConfig(),
      value: this.state.value,
      stylesheet: this.getStylesheet()
    };
  }

  render() {
    var locals = this.getLocals();
    // getTemplate is the only required implementation when extending Component
    t.assert(t.Function.is(this.getTemplate), `[${SOURCE}] missing getTemplate method of component ${this.constructor.name}`);
    var template = this.getTemplate();
    return template(locals);
  }

}

Component.transformer = {
  format: value => Nil.is(value) ? null : value,
  parse: value => value
};

function toNull(value) {
  return (t.String.is(value) && value.trim() === '') || Nil.is(value) ? null : value;
}

function parseNumber(value) {
  var n = parseFloat(value);
  var isNumeric = (value - n + 1) >= 0;
  return isNumeric ? n : toNull(value);
}

class Textbox extends Component {

  getTransformer() {
    var options = this.props.options;
    return options.transformer ? options.transformer :
      this.typeInfo.innerType === t.Number ? Textbox.numberTransformer :
      Textbox.transformer;
  }

  getTemplate() {
    return this.props.options.template || this.props.ctx.templates.textbox;
  }

  getPlaceholder() {
    var placeholder = this.props.options.placeholder;
    if (Nil.is(placeholder) && this.getAuto() === 'placeholders') {
      placeholder = this.getDefaultLabel();
    }
    return placeholder;
  }

  getLocals() {
    var locals = super.getLocals();
    locals.placeholder = this.getPlaceholder();

    [
      'help',
      'autoCapitalize',
      'autoCorrect',
      'autoFocus',
      'bufferDelay',
      'clearButtonMode',
      'editable',
      'enablesReturnKeyAutomatically',
      'keyboardType',
      'multiline',
      'onBlur',
      'onEndEditing',
      'onFocus',
      'onSubmitEditing',
      'password',
      'placeholderTextColor',
      'returnKeyType',
      'selectTextOnFocus',
      'secureTextEntry',
      'selectionState',
      'maxLength',
      'numberOfLines',
      'textAlign',
      'textAlignVertical',
      'underlineColorAndroid'
    ].forEach((name) => locals[name] = this.props.options[name]);

    return locals;
  }

}

Textbox.transformer = {
  format: value => Nil.is(value) ? null : value,
  parse: toNull
};

Textbox.numberTransformer = {
  format: value => Nil.is(value) ? null : String(value),
  parse: parseNumber
};

class Checkbox extends Component {

  getTemplate() {
    return this.props.options.template || this.props.ctx.templates.checkbox;
  }

  getLocals() {
    var locals = super.getLocals();
    // checkboxes must always have a label
    locals.label = locals.label || this.getDefaultLabel();

    [
      'help',
      'disabled',
      'onTintColor',
      'thumbTintColor',
      'tintColor'
    ].forEach((name) => locals[name] = this.props.options[name]);

    return locals;
  }

}

Checkbox.transformer = {
  format: value => Nil.is(value) ? false : value,
  parse: value => value
};

class Select extends Component {

  getTransformer() {
    var options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return Select.transformer(this.getNullOption());
  }

  getTemplate() {
    return this.props.options.template || this.props.ctx.templates.select;
  }

  getNullOption() {
    return this.props.options.nullOption || {value: '', text: '-'};
  }

  getEnum() {
    return this.typeInfo.innerType;
  }

  getOptions() {
    var options = this.props.options;
    var items = options.options ? options.options.slice() : getOptionsOfEnum(this.getEnum());
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    var nullOption = this.getNullOption();
    if (options.nullOption !== false) {
      items.unshift(nullOption);
    }
    return items;
  }

  getLocals() {
    var locals = super.getLocals();
    locals.options = this.getOptions();

    [
      'help'
    ].forEach((name) => locals[name] = this.props.options[name]);

    return locals;
  }

}

Select.transformer = (nullOption) => {
  return {
    format: value => Nil.is(value) && nullOption ? nullOption.value : String(value),
    parse: value => nullOption && nullOption.value === value ? null : value
  };
};

class DatePicker extends Component {

  getTemplate() {
    return this.props.options.template || this.props.ctx.templates.datepicker;
  }

  getLocals() {
    var locals = super.getLocals();

    [
      'help',
      'maximumDate',
      'minimumDate',
      'minuteInterval',
      'mode',
      'timeZoneOffsetInMinutes'
    ].forEach((name) => locals[name] = this.props.options[name]);

    return locals;
  }

}

DatePicker.transformer = {
  format: value => Nil.is(value) ? new Date() : value,
  parse: value => value
};

class Struct extends Component {

  isValueNully() {
    return Object.keys(this.refs).every((ref) => this.refs[ref].isValueNully());
  }

  removeErrors() {
    this.setState({hasError: false});
    Object.keys(this.refs).forEach((ref) => this.refs[ref].removeErrors());
  }

  getValue() {
    var value = {};
    for (var ref in this.refs) {
      value[ref] = this.refs[ref].getValue();
    }
    return this.getTransformer().parse(value);
  }

  validate() {

    var value = {};
    var errors = [];
    var hasError = false;
    var result;

    if (this.typeInfo.isMaybe && this.isValueNully()) {
      this.removeErrors();
      return new t.ValidationResult({errors: [], value: null});
    }

    for (var ref in this.refs) {
      if (this.refs.hasOwnProperty(ref)) {
        result = this.refs[ref].validate();
        errors = errors.concat(result.errors);
        value[ref] = result.value;
      }
    }

    if (errors.length === 0) {
      var InnerType = this.typeInfo.innerType;
      value = new InnerType(value);
      if (this.typeInfo.isSubtype && errors.length === 0) {
        result = t.validate(value, this.props.type, this.getValidationOptions());
        hasError = !result.isValid();
        errors = errors.concat(result.errors);
      }
    }

    this.setState({hasError: hasError});
    return new t.ValidationResult({errors, value});
  }

  onChange(fieldName, fieldValue, path) {
    var value = t.mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.setState({value}, () => {
      this.props.onChange(value, path);
    });
  }

  getTemplates() {
    return merge(this.props.ctx.templates, this.props.options.templates);
  }

  getTemplate() {
    return this.props.options.template || this.getTemplates().struct;
  }

  getStylesheet() {
    return this.props.options.stylesheet || this.props.ctx.stylesheet;
  }

  getTypeProps() {
    return this.typeInfo.innerType.meta.props;
  }

  getOrder() {
    return this.props.options.order || Object.keys(this.getTypeProps());
  }

  getInputs() {
    var { ctx, options } = this.props;
    var props = this.getTypeProps();
    var auto = this.getAuto();
    var i18n =  this.getI18n();
    var config = this.getConfig();
    var value = this.state.value || {};
    var templates = this.getTemplates();
    var stylesheet = this.getStylesheet();
    var inputs = {};
    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        var propType = props[prop];
        var propOptions = options.fields && options.fields[prop] ? options.fields[prop] : nooptions;
        inputs[prop] = React.createElement(getComponent(propType, propOptions), {
          key: prop,
          ref: prop,
          type: propType,
          options: propOptions,
          value: value[prop],
          onChange: this.onChange.bind(this, prop),
          ctx: {
            context: ctx.context,
            auto,
            config,
            label: humanize(prop),
            i18n,
            stylesheet,
            templates,
            path: this.props.ctx.path.concat(prop)
          }
        });
      }
    }
    return inputs;
  }

  getLocals() {
    var templates = this.getTemplates();
    var locals = super.getLocals();
    locals.order = this.getOrder();
    locals.inputs = this.getInputs();
    locals.template = templates.struct;
    return locals;
  }

}

class Form extends React.Component {

  validate() {
    return this.refs.input.validate();
  }

  getValue() {
    var result = this.validate();
    return result.isValid() ? result.value : null;
  }

  getComponent(path) {
    path = t.String.is(path) ? path.split('.') : path;
    return path.reduce((input, name) => input.refs[name], this.refs.input);
  }

  render() {

    var type = this.props.type;
    var options = this.props.options || nooptions;
    var stylesheet = Form.stylesheet;
    var templates = Form.templates;
    var i18n = Form.i18n;

    t.assert(t.isType(type), `[${SOURCE}] missing required prop type`);
    t.assert(t.Object.is(options), `[${SOURCE}] prop options must be an object`);
    t.assert(t.Object.is(stylesheet), `[${SOURCE}] missing stylesheet config`);
    t.assert(t.Object.is(templates), `[${SOURCE}] missing templates config`);
    t.assert(t.Object.is(i18n), `[${SOURCE}] missing i18n config`);

    var Component = getComponent(type, options);

    return React.createElement(Component, {
      ref: 'input',
      type: type,
      options: options,
      value: this.props.value,
      onChange: this.props.onChange || noop,
      ctx: {
        context: this.props.context,
        auto: 'labels',
        stylesheet,
        templates,
        i18n,
        path: []
      }
    });
  }

}

module.exports = {
  getComponent,
  Component,
  Textbox,
  Checkbox,
  Select,
  DatePicker,
  Struct,
  Form
};
