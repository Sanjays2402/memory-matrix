#!/usr/bin/env python3
import base64, json, time, urllib.request
from pathlib import Path
import websocket

OUT = Path('docs/screenshots')
OUT.mkdir(parents=True, exist_ok=True)

pages = None
for _ in range(40):
    try:
        pages = json.load(urllib.request.urlopen('http://127.0.0.1:9225/json/list'))
        break
    except Exception:
        time.sleep(.2)
page = next(p for p in pages if p['url'].startswith('http://127.0.0.1:5173'))
ws = websocket.create_connection(page['webSocketDebuggerUrl'], origin='http://127.0.0.1:9225')
i = 0

def call(method, params=None):
    global i
    i += 1
    ws.send(json.dumps({'id': i, 'method': method, 'params': params or {}}))
    while True:
        value = json.loads(ws.recv())
        if value.get('id') == i:
            return value.get('result', {})

def evaluate(expr):
    return call('Runtime.evaluate', {'expression': expr, 'returnByValue': True}).get('result', {}).get('value')

def viewport(w, h, mobile=False):
    call('Emulation.setDeviceMetricsOverride', {'width': w, 'height': h, 'deviceScaleFactor': 1, 'mobile': mobile})
    call('Page.reload', {'ignoreCache': True})
    time.sleep(.8)

def click(label):
    label = json.dumps(label)
    evaluate(f"(() => {{ const b=[...document.querySelectorAll('button')].find(x=>x.innerText.includes({label})); if(!b) throw new Error({label}); b.click(); }})()")
    time.sleep(.15)

def shot(name):
    data = call('Page.captureScreenshot', {'format': 'png', 'captureBeyondViewport': False})['data']
    path = OUT / name
    path.write_bytes(base64.b64decode(data))
    return path

# Setup screenshot with logo preview
viewport(1440, 1000)
click('Programming')
time.sleep(.5)
shot('06-programming-setup.png')

# Desktop programming game, capture during real opening preview so actual logos show.
click('Start game')
time.sleep(.7)
shot('07-programming-gameplay.png')

# Mobile programming game in a fresh app session.
viewport(390, 844, True)
evaluate("location.href='http://127.0.0.1:5173/?mobile-programming=1'")
time.sleep(1)
evaluate("document.querySelectorAll('.theme-grid button')[1].click()")
time.sleep(.15)
click('Start game')
time.sleep(.7)
metrics = evaluate("({innerWidth,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,logos:document.querySelectorAll('.technology-logo').length})")
if metrics['logos'] != 16:
    raise RuntimeError(f"Expected 16 programming logos on mobile, found {metrics['logos']}")
shot('08-programming-mobile.png')
print(json.dumps(metrics, indent=2))
ws.close()
