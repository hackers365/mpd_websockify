var fail_count = 0;

var ws,
    cmd_queue = {};         //cmd sequence
$(document)
.on('click', '#send', on_write)
.on('keypress', '#send_text', key_write)
.on('click', '#clear_log', clear_log)
.on('click', '._cmd', send_cmd);


connect();
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

    var r = ws.open('ws://localhost:10001', 'base64');
    console.log(r);
}

function clear_log() {
    $('#view').val('');
}

function on_read() {
    var len = ws.rQlen();
    if (len > 0) {
        var str = ws.rQshiftStr();
        $('#view').val($('#view').val() + '\n' + str);
    }
}

function key_write(e) {
    if (typeof(e) == 'object' && e.keyCode == 13) {
        on_write();
    }
}
function on_write() {
    var str = $('#send_text').val() + "\n";
    ws.send_string(str);
    $('#send_text').val('');
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
