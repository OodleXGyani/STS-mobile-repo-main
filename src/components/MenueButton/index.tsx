import React from 'react';
import { StyleSheet, TouchableOpacity, GestureResponderEvent, Image } from 'react-native';
import Icons from '../../common/icons';




// Define props type
interface MenuButtonProps {
    on_press: (event: GestureResponderEvent) => void;
}

// Generic Custom Menu Button Component
const MenuButton: React.FC<MenuButtonProps> = ({ on_press }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            style={[Styles.btn, Styles.dev_border]}
            onPress={on_press}
        >
            <Image
                resizeMode="contain"
                style={[Styles.icon, Styles.dev_border]}
                source={Icons.menu_solid_white}
            />
        </TouchableOpacity>
    );
};

const Styles = StyleSheet.create({
    dev_border: {
        // borderWidth: 1,
        // borderColor: '#FF0000'
    },
    btn: {
        padding: 10
    },
    icon: {
        width: 20,
        height: 20
    }
});
export default MenuButton;
