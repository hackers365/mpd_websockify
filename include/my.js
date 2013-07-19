var ws = new Websock();
ws.on('message', on_read);
ws.on('close', close);
ws.on('open', open);

ws.open('ws://localhost:10001', 'base64');

console.log(ws);

function on_read() {
    var len = ws.rQlen();
    if (len > 0) {
        var str = ws.rQshiftStr(len);
        $('#view').append('\n' + str);
    }
}

function on_write() {

}

function open() {

}

function close() {

}
