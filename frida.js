


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


Java.perform(function () {

        // var RpcInvoker = Java.use('com.alipay.mobile.common.rpc.RpcInvoker');
        // RpcInvoker.getSerializer.implementation = function (method, args, operationTypeValue, id, invokeContext, protoDesc) {
        //     console.log("getSerializer");
        //     var SerializerObject = this.getSerializer(method, args, operationTypeValue, id, invokeContext, protoDesc);
        //     var byte1 = SerializerObject.packet();
        //     console.log(byte1)
        //     return SerializerObject;
        // }


        // var SignJsonSerializer = Java.use('com.alipay.mobile.common.rpc.protocol.json.SignJsonSerializer');
        // SignJsonSerializer.packet.implementation = function () {
        //     console.log("packetpacketpacket");
        //     var OldreqData = this.packet();
        //     return OldreqData;
        // send({type: 'REQ', data: utf8ByteToUnicodeStr(OldreqData)})
        // var typexx;
        // var string_to_recv;
        // recv(function (received_json_object) {
        //     typexx = received_json_object['type'];
        //     string_to_recv = received_json_object['payload'];
        //
        // }).wait();
        //
        // if (typexx === 'NEW_REQ') {
        //     // console.log("frida接收请求")
        //     console.log("string_to_recv");
        //     console.log(OldreqData);
        //     console.log(string_to_recv);
        //     return stringToByte(string_to_recv)
        //     // return this.$init(config, method, id, op, reqData, contentType, context, invokeContext);
        // }
        // }


        // 获取响应
        // var Response = Java.use('com.alipay.mobile.common.transport.Response');
        // Response.getResData.implementation = function () {
        //     console.log("getResData");
        //     var zhi = this.mResData.value;
        //
        //     send({type: 'RESP', data: zhi})
        //     var typexx;
        //     var string_to_recv;
        //     recv(function (received_json_object) {
        //         typexx = received_json_object['type'];
        //         string_to_recv = received_json_object['payload'];
        //
        //
        //     }).wait();
        //
        //     if (typexx === 'NEW_REQ') {
        //         console.log("frida接收")
        //         console.log(string_to_recv);
        //         var new_reqData = stringToByte(string_to_recv);
        //         console.log(new_reqData);
        //         console.log(reqData);
        //         return this.$init(config, method, id, op, new_reqData, contentType, context, invokeContext);
        //         // return this.$init(config, method, id, op, reqData, contentType, context, invokeContext);
        //     }
        //
        //     // console.log(zhi)
        //     return zhi;
        // }


        // 修改响应
        var RpcInvoker = Java.use('com.alipay.mobile.common.rpc.RpcInvoker');
        RpcInvoker.a.overload('java.lang.reflect.Method', '[Ljava.lang.Object;', 'java.lang.String', 'int', 'com.alipay.mobile.common.rpc.transport.InnerRpcInvokeContext', 'com.alipay.mobile.common.rpc.protocol.util.RPCProtoDesc').implementation = function (a1, b, c, d, e, f) {
            // console.log("m17325a");
            var Response = this.a(a1, b, c, d, e, f);

            // sign()
            // console.log("frida准备响应")
            var RespBytes = Response.getResData();
            // console.log(utf8ByteToUnicodeStr(RespBytes));
            // console.log("frida发送响应")
            send({type: 'RESP', data: utf8ByteToUnicodeStr(RespBytes)});
            var string_to_recv;
            var typexx;
            recv(function (received_json_object) {
                typexx = received_json_object['type'];
                string_to_recv = received_json_object['payload'];
            }).wait();

            if (typexx === 'NEW_RESP') {
                // console.log("frida接收响应")
                // console.log(string_to_recv);
                var new_respData = stringToByte(string_to_recv);
                // console.log(new_respData);
                // console.log(RespBytes);
                Response.setResData(new_respData);
                // console.log(Response.getResData())
                // console.log("frida放开响应，继续运行")
                return Response;
            }

            // return Response;

        }

        // 修改请求
        // var HttpCaller = Java.use('com.alipay.mobile.common.rpc.transport.http.HttpCaller');
        // HttpCaller.$init.implementation = function (config, method, id, op, reqData, contentType, context, invokeContext) {
        //     // console.log("frida发送请求")
        //     send({type: 'REQ', data: utf8ByteToUnicodeStr(reqData)})
        //     var typexx;
        //     var string_to_recv;
        //     recv(function (received_json_object) {
        //         typexx = received_json_object['type'];
        //         string_to_recv = received_json_object['payload'];
        //
        //
        //     }).wait();
        //
        //     if (typexx === 'NEW_REQ') {
        //         // console.log("frida接收请求")
        //
        //         console.log("string_to_recv");
        //         var new_reqData = stringToByte(string_to_recv);
        //         console.log(new_reqData);
        //         console.log(reqData);
        //         // console.log(new_reqData);
        //         // console.log(reqData);
        //         // console.log("frida放开请求，继续运行")
        //         return this.$init(config, method, id, op, new_reqData, contentType, context, invokeContext);
        //         // return this.$init(config, method, id, op, reqData, contentType, context, invokeContext);
        //     }
        //
        // }

        var JsonSerializerV2 = Java.use('com.alipay.mobile.common.rpc.protocol.json.JsonSerializerV2');
        JsonSerializerV2.packet.implementation = function () {
            var OldReqData = this.packet();
            send({type: 'REQ', data: utf8ByteToUnicodeStr(OldReqData)})
            var typexx;
            var string_to_recv;
            recv(function (received_json_object) {
                typexx = received_json_object['type'];
                string_to_recv = received_json_object['payload'];


            }).wait();

            if (typexx === 'NEW_REQ') {
                // console.log("frida接收请求")

                console.log("string_to_recv");
                var new_reqData = stringToByte(string_to_recv);
                console.log(OldReqData);
                console.log(string_to_recv);
                // console.log(new_reqData);
                // console.log(reqData);
                // console.log("frida放开请求，继续运行")
                return new_reqData;
                // return this.$init(config, method, id, op, reqData, contentType, context, invokeContext);
            }
        }



        // var Serializer = Java.use('com.alipay.mobile.common.rpc.protocol.Serializer');
        // Serializer.packet.implementation = function () {
        //     console.log("SerializerSerializerSerializerSerializer");
        //     return this.packet();
        // }

        // var PBSerializer = Java.use('com.alipay.mobile.common.rpc.protocol.protobuf.PBSerializer');
        // PBSerializer.packet.implementation = function () {
        //     var OldReqData = this.packet();
        //     send({type: 'REQ', data: utf8ByteToUnicodeStr(OldReqData)})
        //     var typexx;
        //     var string_to_recv;
        //     recv(function (received_json_object) {
        //         typexx = received_json_object['type'];
        //         string_to_recv = received_json_object['payload'];
        //
        //
        //     }).wait();
        //
        //     if (typexx === 'NEW_REQ') {
        //         // console.log("frida接收请求")
        //
        //         console.log("string_to_recv");
        //         var new_reqData = stringToByte(string_to_recv);
        //         console.log(OldReqData);
        //         console.log(string_to_recv);
        //         // console.log(new_reqData);
        //         // console.log(reqData);
        //         // console.log("frida放开请求，继续运行")
        //         return new_reqData;
        //         // return this.$init(config, method, id, op, reqData, contentType, context, invokeContext);
        //     }
        // }
        //
        // var SimpleRpcJsonSerializerV2 = Java.use('com.alipay.mobile.common.rpc.protocol.json.SimpleRpcJsonSerializerV2');
        // SimpleRpcJsonSerializerV2.packet.implementation = function () {
        //     var OldReqData = this.packet();
        //     send({type: 'REQ', data: utf8ByteToUnicodeStr(OldReqData)})
        //     var typexx;
        //     var string_to_recv;
        //     recv(function (received_json_object) {
        //         typexx = received_json_object['type'];
        //         string_to_recv = received_json_object['payload'];
        //
        //
        //     }).wait();
        //
        //     if (typexx === 'NEW_REQ') {
        //         // console.log("frida接收请求")
        //
        //         console.log("string_to_recv");
        //         var new_reqData = stringToByte(string_to_recv);
        //         console.log(OldReqData);
        //         console.log(string_to_recv);
        //         // console.log(new_reqData);
        //         // console.log(reqData);
        //         // console.log("frida放开请求，继续运行")
        //         return new_reqData;
        //         // return this.$init(config, method, id, op, reqData, contentType, context, invokeContext);
        //     }
        // }
        //
        //
        //
        //
        //
        // var SimpleRpcPBSerializer = Java.use('com.alipay.mobile.common.rpc.protocol.protobuf.SimpleRpcPBSerializer');
        // SimpleRpcPBSerializer.packet.implementation = function () {
        //     var OldReqData = this.packet();
        //     send({type: 'REQ', data: utf8ByteToUnicodeStr(OldReqData)})
        //     var typexx;
        //     var string_to_recv;
        //     recv(function (received_json_object) {
        //         typexx = received_json_object['type'];
        //         string_to_recv = received_json_object['payload'];
        //
        //
        //     }).wait();
        //
        //     if (typexx === 'NEW_REQ') {
        //         // console.log("frida接收请求")
        //
        //         console.log("string_to_recv");
        //         var new_reqData = stringToByte(string_to_recv);
        //         console.log(OldReqData);
        //         console.log(string_to_recv);
        //         // console.log(new_reqData);
        //         // console.log(reqData);
        //         // console.log("frida放开请求，继续运行")
        //         return new_reqData;
        //         // return this.$init(config, method, id, op, reqData, contentType, context, invokeContext);
        //     }
        // }




    }
);

