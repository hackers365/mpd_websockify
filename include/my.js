var fail_count = 0;

var ws,
    cmd_queue = {},         //cmd sequence
    buf = [];
$(document)
.on('click', '#send', on_write);

connect();

//setInterval("on_write()", 1000);
setInterval("get_status()", 100);
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
    /*var d = __CODE2CB[__CODE.MSP_IDENT]();
    var buffer = __protocol.get_msg_buf(__CODE.MSP_IDENT, d);
    ws.send(buffer);*/
    get_status();


}

function get_status() {
    send_status([__CODE.MSP_IDENT, __CODE.MSP_RC,__CODE.MSP_STATUS,__CODE.MSP_RAW_IMU, __CODE.MSP_MOTOR]);
    //send_status([__CODE.MSP_RAW_IMU]);
}

function send_status(d) {
    var a;
    for(var i = 0;i<d.length;i++) {
        a = __protocol.get_msg_buf(d[i], __CODE2CB[d[i]]());
        //console.log(a);
        ws.send(a);
    }
}

function close() {
    ;
}



//setInterval(function(){updateChart()}, updateInterval);
