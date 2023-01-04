# frida.py
import re
import string
import threading
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from threading import Thread

import frida  # 导入frida模块
import sys  # 导入sys模块

import requests
import globalVar as gl
import flaskServer


suo = threading.Lock()
ECHO_PORT = 28081
BURP_PORT = 8080
gl._init()

def webRun():
    flaskServer.app.run(host='127.0.0.1', port=ECHO_PORT)


class RequestHandler(BaseHTTPRequestHandler):
    global Request_data
    global Respone_data

    def do_REQUEST(self):
        print("laile")
        content_length = int(self.headers.get('content-length', 0))
        fasong = self.rfile.read(content_length)
        uuid = self.path.replace("/","")
        gl.set(uuid + "req", fasong.decode())
        # print("11111111111" + gl.get(uuid + "req"))
        ixx = 0
        while gl.get(uuid + "rep") == None:
            if ixx >= 10 :
                gl.set(uuid + "rep", "Time Out...")
            print(uuid)
            ixx += 1
            time.sleep(1)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(gl.get(uuid + "rep").encode())

    do_RESPONSE = do_REQUEST


def echo_server_thread():
    print('start echo server at port {}'.format(ECHO_PORT))
    server = HTTPServer(('', ECHO_PORT), RequestHandler)
    server.serve_forever()


t = Thread(target=webRun)
t.daemon = True
t.start()


def on_message(message, data):  # js中执行send函数后要回调的函数
    # print(message)
    global Request_data
    global Respone_data
    if message["type"] == "send":
        payload = message["payload"]
        _type, body = payload['type'], payload['data']
        uuid = re.findall("!!!uuidx:(.*?)!!!", body)[0]
        body = body.replace("!!!uuidx:" + uuid + "!!!", "")
        if _type == 'REQ':
            def send_burp_req():
                requests.request('REQUEST', 'http://127.0.0.1:{}/{}'.format(ECHO_PORT,uuid),
                                 proxies={'http': 'http://127.0.0.1:{}'.format(BURP_PORT)},
                                 data=body.encode('utf-8'))

            x = Thread(target=send_burp_req)
            x.start()
            while gl.get(uuid + "req") == None:
                # print(gl.get(uuid + "req"))
                time.sleep(1)
            # print("pythonfanhui: " + gl.get(uuid + "req"))
            script.post({'type': 'NEW_REQ', 'payload': gl.get(uuid + "req")})

        elif _type == 'RESP':
            gl.set(uuid + "rep",body)
            script.post({'type': 'NEW_RESP', 'payload': gl.get(uuid + "rep")})


'''
spawn模式，Frida会自行启动并注入进目标App，Hook的时机非常早
'''
# device=frida.get_remote_device()
# pid=device.spawn([''])  #包名
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
