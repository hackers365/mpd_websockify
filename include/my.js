
var __MY_MPD = {
    fail_count: 0,
    my_buf: '',
    __MY_MPD.ws: nil,
    ws: '',

    send_cmd: function () {
        var $this = $(this),
            cmd = $this.attr('cmd');
        cmd_queue.push(cmd);
        __MY_MPD.ws.send_string(cmd + "\n");
    },
    connect: function() {
        __MY_MPD.ws = new Websock();
        __MY_MPD.ws.on('message', on_read);
        __MY_MPD.ws.on('close', close);
        __MY_MPD.ws.on('open', open);

        var r = __MY_MPD.ws.open('__MY_MPD.ws://localhost:10001', 'base64');
        console.log(r);
    },

    clear_log: function() {
        $('#view').val('');
    }

    on_read: function() {
        var len = __MY_MPD.ws.rQlen();
        if (len > 0) {
            var str = __MY_MPD.ws.rQshiftStr(len);
            $('#view').val(str + '\n' + $('#view').val());
        }
    }

    key_write: function(e) {
        if (typeof(e) == 'object' && e.keyCode == 13) {
            __MY_MPD.on_write();
        }
    },

    process_result: function() {

    },
    on_write: function() {
        var str = $('#send_text').val() + "\n";
        __MY_MPD.ws.send_string(str);
        $('#send_text').val('');
    },

    open: function() {

    },

    fail_connect: function() {
        $('#info').text('try to connect count ' + __MY_MPD.fail_count);
        return function() {
            __MY_MPD.connect();
        }
    },
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
