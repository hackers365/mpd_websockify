var fail_count = 0;
var ws;
$(document)
.on('click', '#send', on_write)
.on('keypress', '#send_text', key_write);

connect();
function connect() {
    ws = new Websock();
    ws.on('message', on_read);
    ws.on('close', close);
    ws.on('open', open);

    var r = ws.open('ws://localhost:10001', 'base64');
    console.log(r);
}

function on_read() {
    var len = ws.rQlen();
    if (len > 0) {
        var str = ws.rQshiftStr(len);
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
