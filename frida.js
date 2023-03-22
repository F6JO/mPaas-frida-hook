


function utf8ByteToUnicodeStr(utf8Bytes) {
    var unicodeStr = "";
    for (var pos = 0; pos < utf8Bytes.length;) {
        var flag = utf8Bytes[pos];
        var unicode = 0;
        if ((flag >>> 7) === 0) {
            unicodeStr += String.fromCharCode(utf8Bytes[pos]);
            pos += 1;
        } else if ((flag & 0xFC) === 0xFC) {
            unicode = (utf8Bytes[pos] & 0x3) << 30;
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 24;
            unicode |= (utf8Bytes[pos + 2] & 0x3F) << 18;
            unicode |= (utf8Bytes[pos + 3] & 0x3F) << 12;
            unicode |= (utf8Bytes[pos + 4] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 5] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 6;
        } else if ((flag & 0xF8) === 0xF8) {
            unicode = (utf8Bytes[pos] & 0x7) << 24;
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 18;
            unicode |= (utf8Bytes[pos + 2] & 0x3F) << 12;
            unicode |= (utf8Bytes[pos + 3] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 4] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 5;
        } else if ((flag & 0xF0) === 0xF0) {
            unicode = (utf8Bytes[pos] & 0xF) << 18;
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 12;
            unicode |= (utf8Bytes[pos + 2] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 3] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 4;
        } else if ((flag & 0xE0) === 0xE0) {
            unicode = (utf8Bytes[pos] & 0x1F) << 12;
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 2] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 3;
        } else if ((flag & 0xC0) === 0xC0) { //110
            unicode = (utf8Bytes[pos] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 1] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 2;
        } else {
            unicodeStr += String.fromCharCode(utf8Bytes[pos]);
            pos += 1;
        }
    }
    return unicodeStr;
}


function stringToByte(str) {
    var javaString = Java.use('java.lang.String');
    var bytes = [];
    bytes = javaString.$new(str).getBytes();
    return bytes;
}


function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    uuid = uuid.split("-").join("");
    return uuid;
}

Java.perform(function () {




        // var PBSerializer = Java.use('com.alipay.mobile.common.rpc.protocol.protobuf.PBSerializer');
        // PBSerializer.packet.implementation = function () {
        //     console.log();
        //     console.log("------------------PBSerializer---------------------------------");
        //     var uuidx = uuid();
        //     var OldReqData = utf8ByteToUnicodeStr(this.packet())+ "!!!uuidx:" +uuidx + "!!!";
        //     // console.log(OldReqData)
        //     send({type: 'REQ', data: OldReqData});
        //     var typexx;
        //     var string_to_recv;
        //     recv(function (received_json_object) {
        //         typexx = received_json_object['type'];
        //         string_to_recv = received_json_object['payload'];
        //     }).wait();
        //
        //     if (typexx === 'NEW_REQ') {
        //         console.log(uuidx + ": NewREQ: " + string_to_recv)
        //         console.log("------------------PBSerializer end---------------------------------");
        //         return stringToByte(string_to_recv + "!!!uuidx:" +uuidx + "!!!");
        //     }
        //
        //     console.log("!!!!!!!!!!!!!!!!!!PBSerializer NOT NEW_REQ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
        //     // return stringToByte(OldReqData + "[uuidx:" +uuidx + "]");
        // }

        // var SimpleRpcJsonSerializerV2 = Java.use('com.alipay.mobile.common.rpc.protocol.json.SimpleRpcJsonSerializerV2');
        // SimpleRpcJsonSerializerV2.packet.implementation = function () {
        //     console.log();
        //     console.log("------------------SimpleRpcJsonSerializerV2---------------------------------");
        //     // return this.packet()
        //     var OldReqData = this.packet();
        //     console.log(utf8ByteToUnicodeStr(OldReqData));
        //     console.log("------------------SimpleRpcJsonSerializerV2 end---------------------------------");
        //     return OldReqData;
        // }

        // var SimpleRpcPBSerializer = Java.use('com.alipay.mobile.common.rpc.protocol.protobuf.SimpleRpcPBSerializer');
        // SimpleRpcPBSerializer.packet.implementation = function () {
        //     console.log();
        //     console.log("------------------SimpleRpcPBSerializer---------------------------------");
        //     var uuidx = uuid();
        //     var OldReqData = utf8ByteToUnicodeStr(this.packet())+ "!!!uuidx:" +uuidx + "!!!";
        //     // console.log(OldReqData)
        //     send({type: 'REQ', data: OldReqData});
        //     var typexx;
        //     var string_to_recv;
        //     recv(function (received_json_object) {
        //         typexx = received_json_object['type'];
        //         string_to_recv = received_json_object['payload'];
        //     }).wait();
        //
        //     if (typexx === 'NEW_REQ') {
        //         console.log(uuidx + ": NewREQ: " + string_to_recv)
        //         console.log("------------------SimpleRpcPBSerializer end---------------------------------");
        //         return stringToByte(string_to_recv + "!!!uuidx:" +uuidx + "!!!");
        //     }
        //
        //     console.log("!!!!!!!!!!!!!!!!!!SimpleRpcPBSerializer NOT NEW_REQ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
        //     // return stringToByte(OldReqData + "[uuidx:" +uuidx + "]");
        // }



        // var LoginRpcRequestModel = Java.use('com.mobile.mbank.login.rpc.LoginRpcRequestModel');
        // LoginRpcRequestModel.sendSmsCode = function (a,b,c,d){
        //     console.log("LoginRpcRequestModelLoginRpcRequestModelLoginRpcRequestModel")
        //     console.log(a)
        //     console.log(b)
        //     console.log(c)
        //     console.log(d)
        //     return this.sendSmsCode(a,b,c,d);
        //     // console.log("RpcInvokerRpcInvokerRpcInvoker")
        //
        //
        //     // this.a(a,b,c,d,e);
        // }

        // 绕过root检测 com.mobile.mbank.common.api.service.CheckAppEnvServiceImpl.lambda$showCloseDialog$8(Activity, String) void
        // Java.use('com.mobile.mbank.common.api.service.CheckAppEnvServiceImpl').lambda$showCloseDialog$8.implementation = function (a, b){
        //     console.log(a)
        //     console.log(b)
        //     // // return this.lambda$showCloseDialog$8(a,b);

        // }

        var JsonSerializerV2 = Java.use('com.alipay.mobile.common.rpc.protocol.json.JsonSerializerV2');

        JsonSerializerV2.packet.implementation = function () {
            console.log();
            console.log("------------------JsonSerializerV2---------------------------------");
            var uuidx = uuid();
            var OldReqData = utf8ByteToUnicodeStr(this.packet())+ "!!!uuidx:" +uuidx + "!!!";
            // console.log(OldReqData)
            send({type: 'REQ', data: OldReqData});
            var typexx;
            var string_to_recv;
            recv(function (received_json_object) {
                typexx = received_json_object['type'];
                string_to_recv = received_json_object['payload'];
            }).wait();

            if (typexx === 'NEW_REQ') {
                console.log(uuidx + ": NewREQ: " + string_to_recv)
                console.log("------------------JsonSerializerV2 end---------------------------------");
                return stringToByte(string_to_recv + "!!!uuidx:" +uuidx + "!!!");
            }

            console.log("!!!!!!!!!!!!!!!!!!JsonSerializerV2 NOT NEW_REQ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
            // return stringToByte(OldReqData + "[uuidx:" +uuidx + "]");
        }

        var SignJsonSerializer = Java.use('com.alipay.mobile.common.rpc.protocol.json.SignJsonSerializer');
        SignJsonSerializer.packet.implementation = function () {
            console.log();
            console.log("------------------SignJsonSerializer---------------------------------");
            var uuidx = uuid();
            var OldReqData = utf8ByteToUnicodeStr(this.packet())+ "!!!uuidx:" +uuidx + "!!!";
            send({type: 'REQ', data: OldReqData});
            var typexx;
            var string_to_recv;
            recv(function (received_json_object) {
                typexx = received_json_object['type'];
                string_to_recv = received_json_object['payload'];
            }).wait();

            if (typexx === 'NEW_REQ') {
                console.log(uuidx + ": NewREQ: " + string_to_recv)
                console.log("------------------SignJsonSerializer end---------------------------------");
                return stringToByte(string_to_recv + "!!!uuidx:" +uuidx + "!!!");
            }

            console.log("!!!!!!!!!!!!!!!!!!SignJsonSerializer NOT NEW_REQ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
            // return stringToByte(OldReqData + "[uuidx:" +uuidx + "]");
        }

        var HttpCaller = Java.use('com.alipay.mobile.common.rpc.transport.http.HttpCaller');
        HttpCaller.b.overload('com.alipay.mobile.common.transport.http.HttpUrlRequest').implementation = function (a){
            var uuidchuanzu = utf8ByteToUnicodeStr(a.getReqData()).match(/!!!uuidx:(.*?)!!!/g);
            var uuidchuan = "";
            if (uuidchuanzu != null){
                uuidchuan = uuidchuanzu[0];
            }
            var uuidx = uuidchuan.replace("!!!uuidx:","").replace("!!!","");
            a.setReqData(stringToByte(utf8ByteToUnicodeStr(a.getReqData()).replace(uuidchuan,"")));
            var resp = this.b(a);
            // console.log("xiangying: "+utf8ByteToUnicodeStr(resp.getResData()));
            var respStr = utf8ByteToUnicodeStr(resp.getResData()) + "!!!uuidx:" + uuidx + "!!!";

            send({type: 'RESP', data: respStr});
            var typexx;
            var string_to_recv;
            recv(function (received_json_object) {
                typexx = received_json_object['type'];
                string_to_recv = received_json_object['payload'];
            }).wait();

            if (typexx === 'NEW_RESP') {
                console.log(uuidx+": NewREP: " + string_to_recv)
                resp.setResData(stringToByte(string_to_recv))
                return resp
            }


        }

        var RpcInvoker = Java.use('com.alipay.mobile.common.rpc.RpcInvoker');
        RpcInvoker.a.overload('java.lang.reflect.Method','java.lang.String','[B','com.alipay.mobile.common.rpc.transport.InnerRpcInvokeContext','com.alipay.mobile.common.rpc.transport.http.HttpCaller').implementation = function (a,b,c,d,e){
            // console.log("RpcInvokerRpcInvokerRpcInvoker")
            var uuidchuanzu = utf8ByteToUnicodeStr(c).match(/!!!uuidx:(.*?)!!!/g);
            if (uuidchuanzu != null){
                var uuidchuan = uuidchuanzu[0];
                var newc = stringToByte(utf8ByteToUnicodeStr(c).replace(uuidchuan,""))
                // console.log(utf8ByteToUnicodeStr(newc))
                this.a(a,b,newc,d,e);
            }else {
                this.a(a,b,c,d,e)
            }

            // this.a(a,b,c,d,e);
        }




    }
);

