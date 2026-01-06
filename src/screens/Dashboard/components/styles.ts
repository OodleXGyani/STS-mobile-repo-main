
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Constants } from '../../../constants/constants';


interface Styles {
  container: ViewStyle;
  logo_holder: ViewStyle;
  logo: ImageStyle;
  footer: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary_blue_color,
  },
  logo_holder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 249,
    height: '50%' // height in percentage is allowed as string
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    color: Colors.default_font_color
  },
    dev_border: {
        // borderWidth:1,
        // borderColor: '#FF0000'
    },

    vehicle_list_wrapper: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        overflow: 'hidden'
    },

    vehicle_group: {
        backgroundColor: Colors.tertiary_background_color,
        height: Constants.group_height,
        flexDirection: 'row'
    },
    vehicle_group_alternate: {
        backgroundColor: Colors.tertiary_blue_color_light
    },
    vehicle_group_text_holder: {
        flex: 5
    },
    vehicle_group_text: {
        paddingVertical: 14,
        paddingHorizontal: 10,
        fontSize: 14,
        color: Colors.tertiary_font_color
    },
    vehicle_group_sub_btn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 5
    },
    vehicle_group_sub_text_holder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 5
    },
    vehicle_group_sub_text: {
        fontSize: 12,
        color: Colors.tertiary_font_color
    },
    vehicle_group_btn_accordion_icon: {
        width: 18,
        height: 18
    },
    vehicle_group_sub_text_holder_on: {
        borderColor: Colors.vehicle_status_color_on
    },
    vehicle_group_sub_text_holder_idle: {
        borderColor: Colors.vehicle_status_color_idle
    },
    vehicle_group_sub_text_holder_off: {
        borderColor: Colors.vehicle_status_color_off
    },
    vehicle_group_sub_text_holder_nosignal: {
        borderColor: Colors.vehicle_status_color_nosignal
    },

    vehicle_list: {
        flexDirection: 'row',
        height: Constants.vehicle_item_height,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 5,
        paddingRight: 5,
        borderBottomWidth: 2,
        borderColor: Colors.list_item_separator_color,
        overflow: 'hidden'
    },
    vehicle_list_text: {
        fontSize: 16,
        color: Colors.default_font_color
    },
    vehicle_list_error_text: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors.default_font_color,
        marginVertical: 20
    },
    vehicle_list_column: {},
    vehicle_list_column_1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch'
    },
    vehicle_list_column_2: {
        flex: 4
    },

    vehicle_list_row: {
        flex: 1,
        flexDirection: 'row',
        // flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 6
    },
    vehicle_list_row_1: {
        // marginBottom: 3,
    },
    vehicle_list_row_2: {
        // marginTop: 3,
        alignItems: 'flex-end'
    },

    vehicle_list_driver_name_holder: {
        flex: 2
    },
    vehicle_list_driver_name_text: {
        fontSize: 16,
        color: Colors.default_font_color,
        fontWeight: '500'
    },
    vehicle_list_driver_rating_holder: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    vehicle_list_driver_rating_icon: {
        width: 14,
        height: 14
    },
    vehicle_list_text_holder_status: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        alignSelf: 'stretch'
    },
    vehicle_list_info_holder: {},
    vehicle_list_text_holder_registration: {
        flex: 0.9
    },
    vehicle_list_text_registration: {
        fontSize: 14
    },
    vehicle_list_text_holder_location: {
        flex: 0.9
    },
    vehicle_list_text_location: {
        fontSize: 14
    },
    vehicle_list_status_time_holder: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    vehicle_list_status_time_icon_holder: {
        flex: 0.7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    vehicle_list_status_time_icon: {
        // flex: 1,
        width: 17,
        height: 17
    },
    vehicle_list_text_holder_status_time: {
        flex: 2
    },
    vehicle_list_text_status_time: {
        fontSize: 14,
        textAlign: 'center'
    }
  
});

export default styles;