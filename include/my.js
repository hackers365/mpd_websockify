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

        var r = __MY_MPD.ws.open('__MY_MPD.ws://localhost:10001', 'base64');
        console.log(r);
    },

function on_read() {
    var len = ws.rQlen();
    if (len > 0) {
        __protocol.buf = buf.concat(ws.rQshiftBytes());
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
    send_status([__CODE.MSP_IDENT, __CODE.MSP_RC, __CODE.MSP_MOTOR]);
}

function send_status(d) {
    console.log(d);
    for(var i = 0;i<d.length;d++) {
        ws.send(__protocol.get_msg_buf(d[i], __CODE2CB[d[i]]));
    }
}

function close() {
    if (__MY_MPD.fail_count > 5) {
        $('#info').text('fail connect');
        return;
    }
    setTimeout(__MY_MPD.connect, 5000 * __MY_MPD.fail_count);
    __MY_MPD.fail_count++;
}
}

$(document)
.on('click', '#send', __MY_MPD.on_write)
.on('keypress', '#send_text', __MY_MPD.key_write)
.on('click', '#clear_log', __MY_MPD.clear_log)
.on('click', '._cmd', __MY_MPD.send_cmd);


__MY_MPD.connect();
