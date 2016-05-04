'use strict';

var React = require('react-native');
var {
    Component,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} = React;

class Tabs extends Component {
    onSelect(el){
        if (el.props.onSelect) {
            el.props.onSelect(el);
        } else if (this.props.onSelect) {
            this.props.onSelect(el);
        }
    }

    render(){
        const self = this;
        let selected = this.props.selected
        if (!selected){
            React.Children.forEach(this.props.children.filter(c=>c), el=>{
                if (!selected || el.props.initial){
                    selected = el.props.name || el.key;
                }
            });
        }
        return (
            <View style={[styles.tabbarView, this.props.style]}>
                {React.Children.map(this.props.children.filter(c=>c),(el)=>
                    <TouchableOpacity key={el.props.name+"touch"}
                       style={[styles.iconView, this.props.iconStyle, (el.props.name || el.key) == selected ? this.props.selectedIconStyle || el.props.selectedIconStyle || {} : {} ]}
                       onPress={()=>!self.props.locked && self.onSelect(el)}
                       onLongPress={()=>self.props.locked && self.onSelect(el)}>
                         {selected == (el.props.name || el.key) ? React.cloneElement(el, {selected: true, style: [el.props.style, this.props.selectedStyle, el.props.selectedStyle]}) : el}
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}
var styles = StyleSheet.create({
    tabbarView: {
        position:'absolute',
        bottom:0,
        right:0,
        left:0,
        height:50,
        opacity:1,
        backgroundColor:'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconView: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

module.exports = Tabs;
