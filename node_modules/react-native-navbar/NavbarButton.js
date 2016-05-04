import React from 'react-native';
const {
  Text,
  TouchableOpacity,
  Component,
  View,
  PropTypes,
} = React;
import styles from './styles';

export default class NavbarButton extends Component {
  render() {
    const { style, tintColor, margin, title, handler } = this.props;

    return (
      <TouchableOpacity onPress={handler}>
        <View style={style}>
          <Text style={[styles.navBarButtonText, { color: tintColor, }, ]}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  static propTypes = {
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    tintColor: PropTypes.string,
    title: PropTypes.string,
    handler: PropTypes.func,
  };

  static defaultProps = {
    style: {},
    title: '',
    tintColor: '#0076FF',
    onPress: () => ({}),
  };
}
