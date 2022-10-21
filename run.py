# frida.py
import string
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from threading import Thread

import frida  # 导入frida模块
import sys  # 导入sys模块

import requests
import globalVar as gl

ECHO_PORT = 28081
BURP_PORT = 8080
gl._init()
gl.set("Request_data", None)
gl.set("Respone_data", None)
gl.set("OK_NO", True)


class RequestHandler(BaseHTTPRequestHandler):
    global Request_data
    global Respone_data

    def do_REQUEST(self):
        content_length = int(self.headers.get('content-length', 0))


        fasong = self.rfile.read(content_length)
        gl.set("Request_data", fasong.decode())
        while gl.get("Respone_data") == None:
            print("burp等待响应")
            time.sleep(1)
        print("burp接收响应并返回")
        print(gl.get("Respone_data"))
        print("响应")
        self.send_response(200)
        self.end_headers()
        self.wfile.write(gl.get("Respone_data").encode())
        gl.set("OK_NO", True)

    do_RESPONSE = do_REQUEST


def echo_server_thread():
    print('start echo server at port {}'.format(ECHO_PORT))
    server = HTTPServer(('', ECHO_PORT), RequestHandler)
    server.serve_forever()


t = Thread(target=echo_server_thread)
t.daemon = True
t.start()


def on_message(message, data):  # js中执行send函数后要回调的函数
    global Request_data
    global Respone_data
    if message["type"] == "send":
        payload = message["payload"]
        _type, body = payload['type'], payload['data']
        if _type == 'REQ':
            print("python接收请求")
            jishi = 0
            while not gl.get("OK_NO"):
                if jishi < 8:
                    print("等待上一个请求结束")
                    time.sleep(1)
                    jishi += 1
                else:
                    print("请求超时，跳过")
                    gl.set("Respone_data","None...")
                    time.sleep(2)
                    gl.set("OK_NO",True)
                    break
            gl.set("OK_NO", False)
            gl.set("Request_data", None)
            gl.set("Respone_data", None)

            def send_burp_req():
                print("python发送请求到burp")
                requests.request('REQUEST', 'http://127.0.0.1:{}/'.format(ECHO_PORT),
                                 proxies={'http': 'http://127.0.0.1:{}'.format(BURP_PORT)},
                                 data=body.encode('utf-8'))

            x = Thread(target=send_burp_req)
            x.start()
            while gl.get("Request_data") == None:
                print("python等待burp返回请求")
                time.sleep(1)
            print("python送回修改后的请求")
            script.post({'type': 'NEW_REQ', 'payload': gl.get("Request_data")})


        elif _type == 'RESP':
            print("python接收响应")
            gl.set("Respone_data", body)
            print("python送回响应")
            script.post({'type': 'NEW_RESP', 'payload': gl.get("Respone_data")})


'''
spawn模式，Frida会自行启动并注入进目标App，Hook的时机非常早
'''
# device=frida.get_remote_device()
# pid=device.spawn(['cn.dongguanbank.mbank.test'])  #包名
# device.resume(pid)
# time.sleep(1)
# session = device.attach(pid)

'''
attach模式，Frida会附加到当前的目标进程中，即需要App处于启动状态，这也意味着只能从当前时机往后Hook，
'''
# print("start")
session = frida.get_remote_device().attach('')  # app的名字
print("start")
with open("./frida.js") as f:
    script = session.create_script(f.read())

script.on('message', on_message)  # 加载回调函数，也就是js中执行send函数规定要执行的python函数
script.load()  # 加载脚本
sys.stdin.read()
