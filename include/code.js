var __CODE = {
    MSP_IDENT                       :100,
    MSP_STATUS                      :101,
    MSP_RAW_IMU                     :102,
    MSP_SERVO                       :103,
    MSP_MOTOR                       :104,
    MSP_RC                          :105,
    MSP_RAW_GPS                     :106,
    MSP_COMP_GPS                    :107,
    MSP_ATTITUDE                    :108,
    MSP_ALTITUDE                    :109,
    MSP_BAT                         :110,
    MSP_RC_TUNING                   :111,
    MSP_PID                         :112,
    MSP_BOX                         :113,
    MSP_MISC                        :114,
    MSP_MOTOR_PINS                  :115,
    MSP_BOXNAMES                    :116,
    MSP_PIDNAMES                    :117,
    MSP_WP                          :118,
    MSP_SET_RAW_RC                  :200,
    MSP_SET_RAW_GPS                 :201,
    MSP_SET_PID                     :202,
    MSP_SET_BOX                     :203,
    MSP_SET_RC_TUNING               :204,
    MSP_ACC_CALIBRATION             :205,
    MSP_MAG_CALIBRATION             :206,
    MSP_SET_MISC                    :207,
    MSP_RESET_CONF                  :208,
    MSP_WP_SET                      :209,
    MSP_EEPROM_WRITE                :250,
    MSP_DEBUG                       :254,
    MSP_SET_FREQUENCE_TIME          :150,
    MSP_ADD_UPDATE_STATUS           :151
}

var acc_roll = [], //dataPoints.
    acc_roll_backup = [];
var acc_pitch = []; //dataPoints.
var acc_yaw = []; //dataPoints.

var chart = new CanvasJS.Chart("chartContainer",{
    title :{
    text: "Live Data"
    },
    axisX: {
    title: "Axis X Title"
    },
    axisY: {
    title: "value",
    minimum: -1000
    },
    data: [{
    type: "line",
    dataPoints : acc_roll,
        showInLegend: true,
        name: "ACC_roll",
        legendText: "ACC_roll"
    },
    {
        type: 'line',
        dataPoints: acc_pitch,
        showInLegend: true,
        name: "ACC_pitch",
        legendText: "ACC_pitch",
        click: function(e) {
            console.log(e);
        }
    },
    {
        type: 'line',
        dataPoints: acc_yaw,
        showInLegend: true,
        name: "ACC_yaw",
        legendText: "ACC_yaw"
    }]
});

chart.render();


var xVal = acc_roll.length + 1;
var yVal = 100;
var updateInterval = 50;

function updateChart(d) {
    acc_roll.push({x: xVal,y: d[0]});
    acc_pitch.push({x: xVal,y: d[1]});
    acc_yaw.push({x: xVal,y: d[2]});
    if (acc_roll.length > 500 )
    {
        acc_roll.shift();
    }
    if (acc_pitch.length > 500 )
    {
        acc_pitch.shift();
    }
    if (acc_yaw.length > 500 )
    {
        acc_yaw.shift();
    }
    xVal++;
    chart.render();
    // update chart after specified time.
};

var __type_cb = {
    get_val: function(d) {
        return ((d & 0x8000) == 0) ? d : parseInt('-' + (~(d - 1) & 0x7fff));
    },
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
            $('#cycle_time').text((data[1] << 8) | data[0]);
            $('#i2c_error_count').text((data[3] << 8) | data[2]);
        } else {
            return new Uint8Array(0);
        }
    },
    MSP_RAW_IMU: function(data) {
        if (data) {
            var ds = [
                __type_cb.get_val((data[1] << 8) | data[0]),
                __type_cb.get_val((data[3] << 8) | data[2]),
                __type_cb.get_val((data[5] << 8) | data[4]),
                __type_cb.get_val((data[7] << 8) | data[6]),
                __type_cb.get_val((data[9] << 8) | data[8]),
                __type_cb.get_val((data[11] << 8) | data[10]),
                __type_cb.get_val((data[13] << 8) | data[12]),
                __type_cb.get_val((data[15] << 8) | data[14]),
                __type_cb.get_val((data[17] << 8) | data[16]),

            ];
            //console.log(data);
            $('#acc_roll').text(ds[0]);
            $('#acc_pitch').text(ds[1]);
            $('#acc_yaw').text(ds[2]);
            $('#gyro_roll').text(ds[3]);
            $('#gyro_pitch').text(ds[4]);
            $('#gyro_yaw').text(ds[5]);
            $('#mag_roll').text(ds[6]);
            $('#mag_pitch').text(ds[7]);
            $('#mag_yaw').text(ds[8]);
            //updateChart(ds)
        } else {
            return new Uint8Array(0);
        }
    },
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
    MSP_BAT: function(data) {},
    MSP_SET_FREQUENCE_TIME: function(data) {
        if (data.length) {
            return new Uint16Array(data);
        }
    },
    MSP_ADD_UPDATE_STATUS: function(data) {
        if (data.length) {
            return new Uint8Array(data);
        }
    },
    MSP_DEBUG: function(data) {
        if (data) {
            $('#debug1').text((data[1] << 8) | data[0]);
            $('#debug2').text((data[3] << 8) | data[2]);
            $('#debug3').text((data[5] << 8) | data[4]);
            $('#debug4').text((data[7] << 8) | data[6]);
        } else {
            return new Uint8Array(0);
        }
    }
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
    118: __type_cb.MSP_WP,
    150: __type_cb.MSP_SET_FREQUENCE_TIME,
    151: __type_cb.MSP_ADD_UPDATE_STATUS,
    254: __type_cb.MSP_DEBUG
}




