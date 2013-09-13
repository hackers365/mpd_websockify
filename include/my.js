var fail_count = 0;

var ws,
    cmd_queue = {},         //cmd sequence
    buf = [];
$(document)
.on('click', '#send', on_write);

connect();

//setInterval("on_write()", 1000);
setInterval("get_status()", 1000);
function send_cmd() {
    var $this = $(this),
        cmd = $this.attr('cmd');
    ws.send_string(cmd + "\n");
}

function connect() {
    ws = new Websock();
    ws.on('message', on_read);
    ws.on('close', close);
    ws.on('open', open);

    var r = ws.open('ws://192.168.14.170:12001', 'binary');
    console.log(r);
}

function clear_log() {
    $('#view').val('');
}

function on_read() {
    var len = ws.rQlen();
    if (len > 0) {
        __protocol.buf = buf.concat(ws.rQshiftBytes());
        __protocol.process_recv();
        //$('#view').val($('#view').val() + '\n' + String.fromCharCode(chr));
    }
}

function key_write(e) {
    if (typeof(e) == 'object' && e.keyCode == 13) {
        on_write();
    }
}

function on_write() {
    /*var d = __CODE2CB[__CODE.MSP_IDENT]();
    var buffer = __protocol.get_msg_buf(__CODE.MSP_IDENT, d);
    ws.send(buffer);*/
    get_status();


}

function get_status() {
    send_status([__CODE.MSP_IDENT, __CODE.MSP_RC, __CODE.MSP_MOTOR]);
}

function send_status(d) {
    console.log(d);
    for(var i = 0;i<d.length;d++) {
        ws.send(__protocol.get_msg_buf(d[i], __CODE2CB[d[i]]));
    }
}

function open() {

}

function fail_connect() {
    $('#info').text('try to connect count ' + fail_count);
    return function() {
        connect();
    }
}
function close() {
    if (fail_count > 5) {
        $('#info').text('fail connect');
        return;
    }
    setTimeout(connect, 5000 * fail_count);
    fail_count++;
}
