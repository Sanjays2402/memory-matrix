#!/usr/bin/env python3
"""Capture deterministic README screenshots via Chrome DevTools Protocol."""

import base64
import json
import time
import urllib.request
from pathlib import Path

import websocket

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)


def connect():
    pages = None
    for _ in range(40):
        try:
            pages = json.load(urllib.request.urlopen("http://127.0.0.1:9224/json/list"))
            break
        except Exception:
            time.sleep(0.2)
    if not pages:
        raise RuntimeError("Chrome DevTools endpoint unavailable")
    page = next(item for item in pages if item["url"].startswith("http://127.0.0.1:5173"))
    return websocket.create_connection(page["webSocketDebuggerUrl"], origin="http://127.0.0.1:9224")


ws = connect()
message_id = 0


def call(method, params=None):
    global message_id
    message_id += 1
    ws.send(json.dumps({"id": message_id, "method": method, "params": params or {}}))
    while True:
        response = json.loads(ws.recv())
        if response.get("id") == message_id:
            if "error" in response:
                raise RuntimeError(response["error"])
            return response.get("result", {})


def evaluate(expression):
    result = call("Runtime.evaluate", {"expression": expression, "returnByValue": True})
    return result.get("result", {}).get("value")


def viewport(width, height, mobile=False):
    call("Emulation.setDeviceMetricsOverride", {
        "width": width,
        "height": height,
        "deviceScaleFactor": 1,
        "mobile": mobile,
    })
    call("Page.reload", {"ignoreCache": True})
    time.sleep(0.8)


def screenshot(filename):
    data = call("Page.captureScreenshot", {
        "format": "png",
        "captureBeyondViewport": False,
        "fromSurface": True,
    })["data"]
    path = OUT / filename
    path.write_bytes(base64.b64decode(data))
    return path


def click_button(label):
    expression = json.dumps(label)
    evaluate(f"""(() => {{
      const label = {expression};
      const button = [...document.querySelectorAll('button')].find(item => item.innerText.includes(label));
      if (!button) throw new Error(`Missing button: ${{label}}`);
      button.click();
    }})()""")
    time.sleep(0.15)


def start(mode="Classic", difficulty="Easy", deck="Emoji"):
    click_button(difficulty)
    click_button(deck)
    click_button(mode)
    click_button("Start game")
    time.sleep(3.0)


def set_demo_board(matched_pairs=2, score=350, combo=2, moves=5, time_text="0:41", symbols=None, reward=True):
    symbols = symbols or ['🚀', '🚀', '🪐', '🪐', '✨', '✨', '⭐', '⭐']
    evaluate(f"""(() => {{
      const cards = [...document.querySelectorAll('.card-container')];
      const pairs = new Map();
      for (const card of cards) {{
        const label = card.getAttribute('aria-label') || '';
        card.dataset.qaIndex = cards.indexOf(card);
      }}
      cards.slice(0, {matched_pairs * 2}).forEach((card, index) => {{
        card.classList.add('is-matched');
        card.disabled = true;
        card.querySelector('.card-inner')?.classList.add('flipped');
        const symbol = card.querySelector('.card-symbol');
        if (symbol) symbol.textContent = {json.dumps(symbols)}[index] || '⭐';
      }});
      const scoreNode = document.querySelector('.score-stat strong');
      if (scoreNode) scoreNode.textContent = Number({score}).toLocaleString();
      const statValues = [...document.querySelectorAll('.hud-stat')];
      const moveStat = statValues.find(node => node.innerText.includes('MOVES'));
      if (moveStat) moveStat.querySelector('strong').textContent = '{moves}';
      const timeStat = statValues.find(node => node.innerText.includes('TIME') || node.innerText.includes('REMAINING'));
      if (timeStat) timeStat.querySelector('strong').textContent = {json.dumps(time_text)};
      const progressCopy = document.querySelector('.progress-copy strong');
      if (progressCopy) progressCopy.textContent = '{matched_pairs} / ' + progressCopy.textContent.split('/')[1].trim();
      const track = document.querySelector('.progress-track span');
      if (track) track.style.width = '25%';
      if ({str(reward).lower()}) {{
        const rewardNode = document.createElement('div');
        rewardNode.className = 'reward-pop';
        rewardNode.innerHTML = '<strong>+250</strong><span>{combo}× streak</span>';
        document.querySelector('.game-hud')?.appendChild(rewardNode);
      }}
    }})()""")
    time.sleep(0.2)


# 1. Desktop setup
viewport(1440, 1000)
screenshot("01-game-setup.png")

# 2. Desktop classic gameplay
start("Classic", "Easy", "Space")
set_demo_board(moves=5)
screenshot("02-classic-gameplay.png")

# 3. Desktop time attack
viewport(1440, 1000)
start("Time attack", "Medium", "Animals")
set_demo_board(matched_pairs=4, score=1200, combo=3, moves=11, time_text="0:47", symbols=['🦊','🦊','🐼','🐼','🦁','🦁','🦋','🦋'])
evaluate("""(() => { const pop=document.querySelector('.reward-pop'); if(pop) pop.innerHTML='<strong>+450</strong><span>3× streak</span><b>+3s</b>'; })()""")
screenshot("03-time-attack.png")

# 4. Mobile gameplay
viewport(390, 844, True)
start("Classic", "Easy", "Programming")
set_demo_board(matched_pairs=2, score=350, combo=2, moves=5, time_text="0:28", symbols=['JS','JS','PY','PY'])
screenshot("04-mobile-gameplay.png")

# 5. Results dialog. Render a faithful result state using the shipped classes.
evaluate("""(() => {
  const overlay = document.createElement('div');
  overlay.className = 'result-overlay';
  overlay.innerHTML = `
    <section class="result-card" role="dialog" aria-label="Round results">
      <div class="result-emblem"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4"/></svg></div>
      <span class="result-kicker">New personal best</span>
      <h2>Flawless memory.</h2>
      <p>Zero mistakes. Every card, exactly where you remembered it.</p>
      <div class="result-stars"><span class="filled">★</span><span class="filled">★</span><span class="filled">★</span></div>
      <div class="result-score"><small>Final score</small><strong>4,200</strong><span>points</span></div>
      <div class="result-stats"><div><small>Moves</small><strong>8</strong></div><div><small>Time</small><strong>0:34</strong></div><div><small>Best streak</small><strong>8×</strong></div></div>
      <div class="result-actions"><button class="primary-action"><span>↻&nbsp; Play again</span><span>›</span></button><button class="secondary-action">Change setup</button></div>
    </section>`;
  document.body.appendChild(overlay);
})()""")
time.sleep(0.3)
screenshot("05-results.png")

metrics = evaluate("({innerWidth, clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth})")
print(json.dumps({"screenshots": sorted(path.name for path in OUT.glob("*.png")), "metrics": metrics}, indent=2))
ws.close()
