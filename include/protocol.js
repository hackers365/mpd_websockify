var __protocol = {
    OUT_FIRST_FLAG: '$',
    OUT_SECOND_FLAG: 'M',
    OUT_THIRD_FLAG: '<',
    INPUT_FIRST_FLAG: '$',
    INPUT_SECOND_FLAG: 'M',
    INPUT_THIRD_FLAG: '>',
    FIRST_FLAG_OFFSET: 0,
    SECOND_FLAG_OFFSET: 1,
    THIRD_FLAG_OFFSET: 2,
    EXTRA_DATA_LEN: 6,
    TYPE_OFFSET: 4,
    DATA_LENGTH_OFFSET: 3,
    CRC_DATA_OFFSET: 3,
    DATA_OFFSET: 5,
    buf: [],
    count: 0,
    get_buf: {},

    get_msg_buf: function(type, data, is_buf) {
        if (__protocol.get_buf[type] && type <= __CODE.MSP_WP) {
            return __protocol.get_buf[type];
        }
        var buffer = new ArrayBuffer(262);
        __protocol.init(buffer);
        var total_len = __protocol.assembly(type, buffer, data);
        var d = Array.apply([], new Uint8Array(buffer, __protocol.FIRST_FLAG_OFFSET, total_len));
        if (type <= __CODE.MSP_WP) {
            __protocol.get_buf[type] = d;
        }
        return d;
    },

    init: function(buffer) {
        var d = new DataView(buffer, 0);
        d.setUint8(__protocol.FIRST_FLAG_OFFSET, __protocol.OUT_FIRST_FLAG.charCodeAt(0));
        d.setUint8(__protocol.SECOND_FLAG_OFFSET, __protocol.OUT_SECOND_FLAG.charCodeAt(0));
        d.setUint8(__protocol.THIRD_FLAG_OFFSET, __protocol.OUT_THIRD_FLAG.charCodeAt(0));
    },

    assembly: function(type, buffer, data) {
        var d = new DataView(buffer, 0);
        var data_v = new Uint8Array(buffer, __protocol.DATA_OFFSET);
        d.setUint8(__protocol.DATA_LENGTH_OFFSET, data.byteLength);
        d.setUint8(__protocol.TYPE_OFFSET, type);

        __protocol.assembly_data_by_type(type, buffer, data);

        var checksum = __protocol.crc(Array.apply([], new Uint8Array(buffer, __protocol.CRC_DATA_OFFSET, __protocol.DATA_OFFSET - __protocol.CRC_DATA_OFFSET + data.byteLength))),
            total_len = __protocol.EXTRA_DATA_LEN + data.byteLength;
        d.setUint8(__protocol.DATA_OFFSET + data.byteLength, checksum);
        return total_len;
    },

    assembly_data_by_type: function(type, buffer, data) {
        var b8 = new Uint8Array(buffer, __protocol.DATA_OFFSET, data.byteLength);
        var db8 = new Uint8Array(data.buffer);
        b8.set(db8);
    },

    crc: function(data) {
        var checksum = 0;
        for (var i=0;i<data.length;i++) {
            checksum ^= data[i];
        }
        return checksum;
    },

    //init flag
    process_init_flag: function() {
        for (var i=0;i < (__protocol.buf.length - 2);i++) {
            if (__protocol.INPUT_FIRST_FLAG.charCodeAt(0) == __protocol.buf[i] && __protocol.INPUT_SECOND_FLAG.charCodeAt(0) == __protocol.buf[i+1]
                    && __protocol.INPUT_THIRD_FLAG.charCodeAt(0) == __protocol.buf[i+2]) {
                __protocol.buf = __protocol.buf.slice(i);
                return true;
            }
        }
        return false;
    },

    //full msg
    process_each_msg: function(data) {
        var checksum = __protocol.crc(data.slice(__protocol.CRC_DATA_OFFSET, data.length - 1)),
            data_len = data[__protocol.DATA_LENGTH_OFFSET],
            code = data[__protocol.TYPE_OFFSET],
            recv_checksum = data[data_len + __protocol.DATA_OFFSET],
            type_offset = data[__protocol.TYPE_OFFSET];
        if (recv_checksum == checksum && __CODE2CB[type_offset]) {
            __CODE2CB[type_offset](data.slice(__protocol.DATA_OFFSET, __protocol.DATA_OFFSET + data_len));
        }
    },

    process_recv: function() {
        var data_len = 0,
            total_len = 0,
            code = 0;
        while(__protocol.buf.length) {
            if (__protocol.process_init_flag()) {
                if (__protocol.buf.length >= 4) {

                    data_len = __protocol.buf[__protocol.DATA_LENGTH_OFFSET];
                    total_len = __protocol.EXTRA_DATA_LEN + data_len;
                    if (__protocol.buf.length >= total_len) {
                        __protocol.process_each_msg(__protocol.buf.slice(0, __protocol.EXTRA_DATA_LEN + data_len));
                        __protocol.buf = __protocol.buf.slice(__protocol.EXTRA_DATA_LEN + data_len);
                    } else {
                        break;
                    }
                    break;
                } else {
                    //not end
                    break;
                }
            } else {
                __protocol.buf = [];
                break;
            }
        }
    }
}


