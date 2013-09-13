var __CODE = {
    MSP_IDENT           :100,
    MSP_STATUS          :101,
    MSP_RAW_IMU         :102,
    MSP_SERVO           :103,
    MSP_MOTOR           :104,
    MSP_RC              :105,
    MSP_RAW_GPS         :106,
    MSP_COMP_GPS        :107,
    MSP_ATTITUDE        :108,
    MSP_ALTITUDE        :109,
    MSP_BAT             :110,
    MSP_RC_TUNING       :111,
    MSP_PID             :112,
    MSP_BOX             :113,
    MSP_MISC            :114,
    MSP_MOTOR_PINS      :115,
    MSP_BOXNAMES        :116,
    MSP_PIDNAMES        :117,
    MSP_WP              :118,
    MSP_SET_RAW_RC      :200,
    MSP_SET_RAW_GPS     :201,
    MSP_SET_PID         :202,
    MSP_SET_BOX         :203,
    MSP_SET_RC_TUNING   :204,
    MSP_ACC_CALIBRATION :205,
    MSP_MAG_CALIBRATION :206,
    MSP_SET_MISC        :207,
    MSP_RESET_CONF      :208,
    MSP_WP_SET          :209,
    MSP_EEPROM_WRITE    :250,
    MSP_DEBUG           :254
}
var __type_cb = {
    MSP_IDENT: function(data) {
        if (data) {
            //send or recv
            $('#version').text(data[0]);
            $('#multitype').text(data[1]);
        } else {
            return new Uint8Array(0);
        }
    },
    MSP_STATUS: function(data) {
        if (data) {
            //send or recv

        } else {
            return new Uint8Array(0);
        }
    },
    MSP_RAW_IMU: function(data) {},
    MSP_SERVO: function(data) {},
    MSP_MOTOR: function(data) {
        if (data) {
            $('#mi1').text((data[1] << 8) | data[0]);
            $('#mi2').text((data[3] << 8) | data[2]);
            $('#mi3').text((data[5] << 8) | data[4]);
            $('#mi4').text((data[7] << 8) | data[6]);
        } else {
            return new Uint8Array(0);
        }
    },
    MSP_RC: function(data) {
        if (data) {
            $('#rc1').text((data[1] << 8) | data[0]);
            $('#rc2').text((data[3] << 8) | data[2]);
            $('#rc3').text((data[5] << 8) | data[4]);
            $('#rc4').text((data[7] << 8) | data[6]);
        } else {
            return new Uint8Array(0);
        }
    },
    MSP_RAW_GPS: function(data) {},
    MSP_COMP_GPS: function(data) {},
    MSP_ATTITUDE: function(data) {},
    MSP_ALTITUDE: function(data) {},
    MSP_BAT: function(data) {}
}


var __CODE2CB = {
    100: __type_cb.MSP_IDENT,
    101: __type_cb.MSP_STATUS,
    102: __type_cb.MSP_RAW_IMU,
    103: __type_cb.MSP_SERVO,
    104: __type_cb.MSP_MOTOR,
    105: __type_cb.MSP_RC,
    106: __type_cb.MSP_RAW_GPS,
    107: __type_cb.MSP_COMP_GPS,
    108: __type_cb.MSP_ATTITUDE,
    109: __type_cb.MSP_ALTITUDE,
    110: __type_cb.MSP_BAT,
    111: __type_cb.MSP_RC_TUNING,
    112: __type_cb.MSP_PID,
    113: __type_cb.MSP_BOX,
    114: __type_cb.MSP_MISC,
    115: __type_cb.MSP_MOTOR_PINS,
    116: __type_cb.MSP_BOXNAMES,
    117: __type_cb.MSP_PIDNAMES,
    118: __type_cb.MSP_WP
}




