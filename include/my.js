var ws = new Websock();
ws.on('message', on_read);
ws.on('close', close);
ws.on('open', open);

ws.open('ws://localhost:10001', 'base64');

$(document)
.on('click', '#send', on_write);
console.log(ws);

function on_read() {
    var len = ws.rQlen();
    if (len > 0) {
        var str = ws.rQshiftStr(len);
        $('#view').val($('#view').val() + '\n' + str);
    }
}

function on_write() {
    var str = $('#send_text').val() + "\n";
    console.log(str);
    ws.send(str);
}

function open() {

}

function close() {

}
