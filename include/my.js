var fail_count = 0;

var ws,
    cmd_queue = {},         //cmd sequence
    buf = [],
    get_buf = {},
    pre_d = [];
$(document)
.on('click', '#send', on_write)
.on('click', '#change', on_change)
.on('change', '#change_hz', function(e) {
    var v = parseInt($(this).val());
    console.log(1000000/v);
    var d = __protocol.get_msg_buf(__CODE.MSP_SET_FREQUENCE_TIME, __CODE2CB[__CODE.MSP_SET_FREQUENCE_TIME]([1000000/v]));
    ws.send(d);
});

connect();

//setInterval("on_write()", 1000);
setInterval(get_status, 1000);
//setTimeout("get_status()", 1000);
function send_cmd() {
    on_write();
}

function open() {
}

function connect() {
    ws = new Websock();
    ws.on('message', on_read);
    ws.on('close', close);
    ws.on('open', open);

    var r = ws.open('ws://127.0.0.1:12001', 'binary');
    console.log(r);
}

function on_read() {
    var len = ws.rQlen();
    if (len > 0) {
        __protocol.buf = __protocol.buf.concat(ws.rQshiftBytes());
        __protocol.process_recv();
        //$('#view').val($('#view').val() + '\n' + String.fromCharCode(chr));
    }
}

function on_write() {
    //var s = [__CODE.MSP_RAW_IMU, __CODE.MSP_STATUS, __CODE.MSP_MOTOR, 0]
    var d = __protocol.get_msg_buf(__CODE.MSP_RAW_IMU, __CODE2CB[__CODE.MSP_RAW_IMU]());
    console.log(d);
    ws.send(d);
}

function on_change() {
    var s = [__CODE.MSP_RAW_IMU, __CODE.MSP_STATUS, __CODE.MSP_MOTOR, __CODE.MSP_RC]
    var d = __protocol.get_msg_buf(__CODE.MSP_ADD_UPDATE_STATUS, __CODE2CB[__CODE.MSP_ADD_UPDATE_STATUS](s));
    console.log(d);
    ws.send(d);
}

function get_status() {
    //var d = get_status_data([__CODE.MSP_IDENT, __CODE.MSP_RC,__CODE.MSP_STATUS,__CODE.MSP_RAW_IMU, __CODE.MSP_MOTOR]);
    var d = get_status_data([__CODE.MSP_DEBUG]);
console.log(d);
    ws.send(d);
    //send_status(d);
    //send_status([__CODE.MSP_RAW_IMU]);
}

function get_status_data(d) {
    if (get_buf[d] && pre_d == d) {
        return get_buf[d];
    }

    var a = [],
        data = [];
    for(var i = 0;i<d.length;i++) {
        a = a.concat(__protocol.get_msg_buf(d[i], __CODE2CB[d[i]]()));
    }
    data = a;
    /*for (var s = 0; s < 5; s++) {
        data = data.concat(a);
    }*/
    get_buf[d] = data;

    return data;
}

function close() {
    ;
}



//setInterval(function(){updateChart()}, updateInterval);
