import time

from flask import Flask, request
import globalVar as gl
# gl._init()
app = Flask(__name__)
ECHO_PORT = 28081
@app.route('/<string:uuid>',methods=('REQUEST',))
def aaa(uuid):
    # print()
    gl.set(uuid + "req", request.data.decode())
    ixx = 0
    while gl.get(uuid + "rep") == None:
        if ixx >= 10:
            gl.set(uuid + "rep", "Time Out...")
        # print(uuid)
        ixx += 1
        time.sleep(1)
    return gl.get(uuid + "rep")

if __name__ == '__main__':
    print('start echo server at port {}'.format(ECHO_PORT))
    app.run(host='127.0.0.1', port=ECHO_PORT, debug=True)