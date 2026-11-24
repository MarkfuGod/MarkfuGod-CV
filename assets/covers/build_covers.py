"""Hand-written SVG card covers for the portfolio homepage.

Run:  python3 build_covers.py   (writes *.svg next to this file)

Fact ledger — every number drawn here comes from the October 2026 resume:
  Matchii   6.1k -> 8.6k req/s (+42%); p95 11.1 -> 7.2 ms; 115 tables; 1,599 Go tests; 24 connector capabilities
  M-PAC     500 survivors; 12 weeks; [S1] citations; faithfulness check; physician escalation; ~720 msgs/day
  Being     LIBERO spatial 98.6, object 97.0, goal 98.0, libero-10 95.0; 4B from base 37.8 (spatial, 6k steps)
  Skillios  ~10 tools; ~8.2 s -> ~3.4 s (~2.4x)
  Vibe      preset teams: investment committee, quant desk, risk, macro, crypto
  NL2BP     7 roles / 9 agents; PlantUML
  Atari     9 games linked by portals; assets generated at runtime
  pi-asm    code lines copied from src/tools.s (_tool_exec) in MarkfuGod/pi-asm
"""
import os

W, H = 640, 360
SANS = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
MONO = "'SF Mono', Menlo, Consolas, monospace"
OUT = os.path.dirname(os.path.abspath(__file__))
# One palette for every cover: ink on paper plus one accent, like figures in a paper.
PAPER, INK, MUTED, RULE, ACC, ACC2, SOFT = "#f4f2ed", "#1d2024", "#6d7178", "#c3c5c9", "#1d5fa0", "#b4532a", "#dfe7ef"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


class Cover:
    def __init__(self, name, c1, c2):
        self.name, self.parts = name, []
        self.defs = []
        self.parts.append(f'<rect width="{W}" height="{H}" fill="{PAPER}"/>')

    def add(self, s):
        self.parts.append(s)

    def text(self, x, y, s, size=18, fill=INK, weight=600, anchor="start", font=SANS, op=1):
        self.add(f'<text x="{x}" y="{y}" font-family="{font}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" opacity="{op}">{esc(s)}</text>')

    def box(self, x, y, w, h, fill="none", stroke=INK, r=10, sw=1.5):
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')

    def line(self, x1, y1, x2, y2, stroke=INK, sw=2, dash=None, arrow=False):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        m = ' marker-end="url(#ar)"' if arrow else ""
        self.add(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{sw}"{d}{m}/>')

    def save(self):
        self.defs.append('<marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1d2024"/></marker>')
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
               f'<defs>{"".join(self.defs)}</defs>{"".join(self.parts)}</svg>\n')
        with open(os.path.join(OUT, self.name + ".svg"), "w") as f:
            f.write(svg)
        print("wrote", self.name + ".svg")


# ---------------------------------------------------------------- Matchii: layered tower
def matchii():
    c = Cover("matchii", "#0a2f55", "#1467b3")
    layers = [
        ("Next.js", [], 0),
        ("Go API", ["Agents", "Connectors"], 1),
        ("PostgreSQL", ["Redis"], 2),
        ("CI · 1,599 Go tests", [], 3),
    ]
    x0, y0, w, h, gap = 36, 36, 360, 54, 14
    for label, extra, i in layers:
        y = y0 + i * (h + gap)
        if not extra:
            c.box(x0, y, w, h)
            c.text(x0 + w / 2, y + 34, label, 20, anchor="middle")
        else:
            ws = [w * .36] + [(w * .64 - 10 * len(extra)) / len(extra)] * len(extra)
            x = x0
            for j, (lab, ww) in enumerate(zip([label] + extra, ws)):
                c.box(x, y, ww, h, fill=SOFT if j == 0 else "none")
                c.text(x + ww / 2, y + 34, lab, 18 if j == 0 else 15, anchor="middle", weight=600 if j == 0 else 500)
                x += ww + 10
    # metric panel
    c.box(424, 36, 180, 258, fill="none", stroke=RULE, r=14)
    c.text(514, 62, "req/s", 16, MUTED, 500, "middle")
    for i, (lab, val, hgt, col) in enumerate([("before", "6.1k", 6.1, RULE), ("Redis", "8.6k", 8.6, ACC)]):
        bx = 462 + i * 58
        bh = hgt * 16
        c.add(f'<rect x="{bx}" y="{240 - bh}" width="40" height="{bh}" rx="5" fill="{col}"/>')
        c.text(bx + 20, 232 - bh, val, 16, anchor="middle")
        c.text(bx + 20, 262, lab, 14, MUTED, 500, "middle")
    c.text(514, 284, "+42%", 20, ACC, 800, "middle")
    c.save()


# ---------------------------------------------------------------- M-PAC: pipeline with escalation
def mpac():
    c = Cover("mpac", "#ffffff", "#1e8a5c")
    steps = ["WhatsApp", "Retrieve", "GPT-4o", "Check", "Send"]
    x, y, w, h, gap = 26, 120, 100, 56, 22
    for i, s in enumerate(steps):
        xx = x + i * (w + gap)
        hi = s == "Check"
        c.box(xx, y, w, h, fill=SOFT if hi else "none", stroke=ACC if hi else INK)
        c.text(xx + w / 2, y + 35, s, 17, anchor="middle")
        if i:
            c.line(xx - gap + 2, y + h / 2, xx - 3, y + h / 2, arrow=True)
    # citation tag under GPT-4o
    gx = x + 2 * (w + gap)
    c.box(gx + 22, y + h + 14, 56, 28, fill=ACC, stroke="none", r=6)
    c.text(gx + 50, y + h + 34, "[S1]", 15, "#ffffff", 800, "middle", MONO)
    c.text(gx + 50, y + h + 62, "cited", 14, MUTED, 500, "middle")
    # escalation branch from Check
    cx = x + 3 * (w + gap) + w / 2
    c.line(cx, y, cx, 72, stroke=ACC2, dash="5 4", arrow=True)
    c.box(cx - 70, 30, 140, 40, fill="none", stroke=ACC2)
    c.text(cx, 56, "Physician", 16, ACC2, 700, "middle")
    c.text(cx - 84, 56, "sensitive", 14, ACC2, 500, "end")
    # chat bubbles
    c.box(26, 250, 210, 40, fill="#ffffff", stroke=RULE, r=14)
    c.text(40, 276, "做完運動膝頭痛點算？", 15, INK, 600)
    c.box(250, 262, 190, 40, fill=ACC, stroke="none", r=14)
    c.text(264, 288, "依 [S1]：先休息…", 15, "#ffffff", 600)
    c.save()


# ---------------------------------------------------------------- Being-H0.5: bar chart
def being():
    c = Cover("being", "#24124a", "#5b35a8")
    rows = [("Spatial", 98.6), ("Object", 97.0), ("Goal", 98.0), ("LIBERO-10", 95.0)]
    base, top, x0 = 270, 50, 60
    scale = (base - top) / 100
    c.line(x0 - 10, base, 600, base, stroke=MUTED, sw=1.5)
    for p in (50, 100):
        yy = base - p * scale
        c.line(x0 - 10, yy, 600, yy, stroke=RULE, sw=1, dash="4 4")
        c.text(x0 - 16, yy + 5, f"{p}%", 13, MUTED, 500, "end")
    bw, gap = 72, 22
    for i, (lab, v) in enumerate(rows):
        bx = x0 + i * (bw + gap)
        bh = v * scale
        c.add(f'<rect x="{bx}" y="{base - bh}" width="{bw}" height="{bh}" rx="6" fill="{ACC}"/>')
        c.text(bx + bw / 2, base - bh - 8, f"{v:.1f}", 16, anchor="middle", weight=700)
        c.text(bx + bw / 2, base + 22, lab, 14, MUTED, 500, "middle")
    # from-base 4B
    bx = x0 + 4 * (bw + gap) + 26
    bh = 37.8 * scale
    c.add(f'<rect x="{bx}" y="{base - bh}" width="{bw}" height="{bh}" rx="6" fill="{ACC2}"/>')
    c.text(bx + bw / 2, base - bh - 8, "37.8", 16, ACC2, 700, "middle")
    c.text(bx + bw / 2, base + 22, "4B base", 14, ACC2, 600, "middle")
    c.line(bx - 13, top, bx - 13, base + 30, stroke=RULE, sw=1, dash="3 4")
    c.save()


# ---------------------------------------------------------------- Skillios: skill tree + latency
def skillios():
    c = Cover("skillios", "#ffffff", "#d0611f")
    # phone frame
    c.box(36, 24, 170, 290, fill="#ffffff", stroke=INK, r=26, sw=2)
    c.add(f'<rect x="96" y="34" width="50" height="8" rx="4" fill="{MUTED}"/>')
    nodes = {"goal": (121, 82)}
    c.line(121, 98, 76, 150); c.line(121, 98, 121, 150); c.line(121, 98, 166, 150)
    for x in (76, 121, 166):
        c.line(x, 166, x, 218)
    c.add(f'<circle cx="121" cy="82" r="18" fill="{ACC}"/>')
    c.text(121, 88, "★", 18, "#ffffff", 700, "middle")
    for x, done in ((76, True), (121, True), (166, False)):
        c.add(f'<circle cx="{x}" cy="158" r="13" fill="{ACC if done else "none"}" stroke="{ACC}" stroke-width="2"/>')
        c.add(f'<circle cx="{x}" cy="226" r="10" fill="none" stroke="{MUTED}" stroke-width="2"/>')
    c.box(58, 258, 126, 34, fill=ACC, stroke="none", r=10)
    c.text(121, 280, "Confirm", 15, "#ffffff", 700, "middle")
    # latency bars
    c.text(250, 74, "multi-tool latency", 17, INK, 600)
    for i, (lab, v, col) in enumerate([("sequential", 8.2, RULE), ("parallel reads", 3.4, ACC)]):
        y = 104 + i * 74
        c.text(250, y, lab, 15, MUTED, 500)
        c.add(f'<rect x="250" y="{y + 10}" width="{v * 36}" height="30" rx="6" fill="{col}"/>')
        c.text(260 + v * 36, y + 32, f"~{v} s", 17, weight=700)
    c.text(250, 284, "~2.4× faster", 26, ACC2, 800)
    c.save()


# ---------------------------------------------------------------- Vibe-Trading: swarm
def vibe():
    c = Cover("vibe", "#ffffff", "#3a4556")
    cx, cy = 200, 168
    agents = [("Committee", 200, 54), ("Quant", 330, 120), ("Risk", 290, 262), ("Macro", 110, 262), ("Crypto", 70, 120)]
    for _, x, y in agents:
        c.line(cx, cy, x, y, stroke=INK, sw=1.5)
    for i, (a, x, y) in enumerate(agents):
        for b, x2, y2 in agents[i + 1:]:
            c.line(x, y, x2, y2, stroke="none", sw=1)
    for a, x, y in agents:
        c.add(f'<circle cx="{x}" cy="{y}" r="36" fill="{PAPER}" stroke="{ACC}" stroke-width="2"/>')
        c.text(x, y + 5, a, 12, INK, 600, "middle")
    c.add(f'<circle cx="{cx}" cy="{cy}" r="38" fill="{ACC}"/>')
    c.text(cx, cy + 6, "Report", 16, "#ffffff", 800, "middle")
    # candlesticks
    candles = [(60, 90, 70, 105, 1), (52, 80, 58, 70, 0), (40, 75, 50, 60, 1), (30, 62, 34, 55, 1), (34, 70, 44, 50, 0), (20, 52, 26, 42, 1), (14, 40, 18, 30, 1)]
    for i, (hi, lo, o, cl, up) in enumerate(candles):
        x = 430 + i * 26
        col = ACC if up else ACC2
        top, bot = 70 + hi * 1.6, 70 + lo * 1.6
        c.line(x + 8, top, x + 8, bot, stroke=col, sw=2)
        y1, y2 = sorted((70 + o * 1.6, 70 + cl * 1.6))
        c.add(f'<rect x="{x}" y="{y1}" width="16" height="{max(y2 - y1, 4)}" rx="2" fill="{col}"/>')
    c.text(430, 300, "backtest · run card", 15, MUTED, 500)
    c.save()


# ---------------------------------------------------------------- NL2BP: text -> agents -> UML
def nl2bp():
    c = Cover("nl2bp", "#ffffff", "#0f8a7e")
    # requirement doc
    c.box(30, 50, 140, 200, fill="#ffffff", stroke=RULE, r=8)
    c.text(44, 78, "Requirements", 14, INK, 700)
    for i, wdt in enumerate((112, 96, 108, 80, 104, 90, 70)):
        c.add(f'<rect x="44" y="{94 + i * 20}" width="{wdt}" height="7" rx="3" fill="{MUTED}"/>')
    c.line(182, 150, 218, 150, arrow=True)
    # 9 agents in 3x3
    for i in range(9):
        x = 248 + (i % 3) * 44
        y = 106 + (i // 3) * 44
        c.add(f'<circle cx="{x}" cy="{y}" r="15" fill="{ACC}" opacity="{1 if i < 7 else .55}"/>')
    c.text(292, 262, "7 roles · 9 agents", 15, INK, 600, "middle")
    c.line(354, 150, 390, 150, arrow=True)
    # UML class boxes
    def cls(x, y, name, rows):
        c.box(x, y, 104, 28 + 18 * rows, fill="none", stroke=INK, r=4)
        c.text(x + 52, y + 19, name, 14, INK, 700, "middle")
        c.line(x, y + 27, x + 104, y + 27, stroke=INK, sw=1)
        for r in range(rows):
            c.add(f'<rect x="{x + 10}" y="{y + 36 + r * 18}" width="{70 - r * 12}" height="6" rx="3" fill="{RULE}"/>')
    cls(404, 46, "Order", 3)
    cls(520, 46, "User", 2)
    cls(462, 196, "Payment", 2)
    c.line(508, 90, 520, 90, stroke=INK, sw=1.5)
    c.line(456, 128, 500, 196, stroke=INK, sw=1.5)
    c.text(404, 300, "@startuml", 14, INK, 600, font=MONO)
    c.save()


# ---------------------------------------------------------------- Atari Portal: pixel scene
def atari():
    c = Cover("atari", "#04060c", "#0b1a2a")
    # grid floor
    for i in range(9):
        c.line(320, 250, -160 + i * 120, 360, stroke=RULE, sw=1)
    for y in (262, 280, 306, 340):
        c.line(0, y, 640, y, stroke=RULE, sw=1)
    # portal
    for r, op in ((84, .9), (70, .6), (56, .4)):
        c.add(f'<ellipse cx="320" cy="140" rx="{r * .82}" ry="{r}" fill="none" stroke="{ACC}" stroke-width="3" opacity="{op}"/>')
    px = 6
    def sprite(x, y, rows, col):
        for j, row in enumerate(rows):
            for i, ch in enumerate(row):
                if ch == "#":
                    c.add(f'<rect x="{x + i * px}" y="{y + j * px}" width="{px}" height="{px}" fill="{col}"/>')
    invader = ["..#.....#..", "...#...#...", "..#######..", ".##.###.##.", "###########", "#.#######.#", "#.#.....#.#", "...##.##..."]
    sprite(60, 60, invader, INK)
    sprite(500, 70, invader, INK)
    pac = [".#####.", "#######", "####...", "###....", "####...", "#######", ".#####."]
    sprite(110, 200, pac, ACC2)
    for i in range(3):
        c.add(f'<rect x="{170 + i * 22}" y="{217}" width="8" height="8" fill="{ACC2}"/>')
    tet = [(ACC, [(0, 0), (1, 0), (2, 0), (1, 1)]), (ACC, [(0, 0), (0, 1), (0, 2), (0, 3)])]
    for (col, cells), (ox, oy) in zip(tet, ((470, 190), (580, 150))):
        for cx, cy in cells:
            c.add(f'<rect x="{ox + cx * 18}" y="{oy + cy * 18}" width="17" height="17" fill="{col}"/>')
    c.add(f'<rect x="270" y="300" width="100" height="10" fill="{ACC2}"/>')
    c.add(f'<rect x="340" y="276" width="10" height="10" fill="{INK}"/>')
    c.text(320, 147, "9 GAMES", 19, INK, 800, "middle", MONO)
    c.save()


# ---------------------------------------------------------------- pi-asm: terminal
def piasm():
    c = Cover("piasm", "#0b1210", "#0e3a2c")
    c.box(30, 26, 580, 286, fill="#1d2024", stroke=INK, r=12)
    for i, col in enumerate(("#55595f",) * 3):
        c.add(f'<circle cx="{54 + i * 20}" cy="48" r="6" fill="{col}"/>')
    c.text(320, 53, "src/tools.s", 14, "#9a9ea4", 500, "middle", MONO)
    code = [
        ("_tool_exec:", "#9cc3ea"),
        ("    mov     x19, x0", None),
        ("    mov     x20, x1", None),
        ("    bl      _tools_json_get", None),
        ("    ldr     x23, [x9, x22, lsl #3]", None),
        ("    add     x23, x9, x23, lsl #5", None),
        ("    ldr     x1, [x23]", None),
        ("    bl      _strcmp", None),
        ("    cbz     x23, Lte_ext_done", None),
    ]
    for i, (ln, col) in enumerate(code):
        y = 88 + i * 24
        c.text(52, y, f"{107 + i:>3}", 14, "#6d7178", 500, font=MONO)
        if col:
            c.text(96, y, ln, 16, col, 700, font=MONO)
        else:
            parts = ln.split(None, 1)
            c.text(128, y, parts[0], 16, "#e2a878", 600, font=MONO)
            c.text(208, y, parts[1] if len(parts) > 1 else "", 16, "#e8e6e1", 500, font=MONO)
    c.save()


# ---------------------------------------------------------------- KithAgent (public repo version): files -> triage -> summaries -> daemon API
def kith():
    c = Cover("kith", "", "")
    # folders
    for i, name in enumerate(("Projects", "Documents", "Downloads")):
        y = 52 + i * 58
        c.add(f'<path d="M30 {y} h40 l8 8 h62 v38 h-110 z" fill="#ffffff" stroke="{INK}" stroke-width="1.5"/>')
        c.text(85, y + 32, name, 13, INK, 600, "middle")
    c.line(150, 136, 186, 136, arrow=True)
    # triage
    c.text(250, 46, "LLM triage", 14, MUTED, 600, "middle")
    for i, (lab, w, col) in enumerate((("high", 92, ACC), ("medium", 66, ACC), ("low", 40, RULE), ("skip", 110, RULE))):
        y = 62 + i * 36
        op = 1 if i == 0 else (.55 if i == 1 else 1)
        c.text(196, y + 17, lab, 13, MUTED, 500)
        c.add(f'<rect x="248" y="{y + 4}" width="{w * .62}" height="18" rx="3" fill="{col}" opacity="{op}"/>')
    c.line(326, 136, 362, 136, arrow=True)
    # summaries + retrieval
    c.box(372, 64, 120, 60, fill="#ffffff", stroke=INK)
    c.text(432, 90, "summaries", 14, INK, 700, "middle")
    c.text(432, 110, "by priority", 12, MUTED, 500, "middle")
    c.box(372, 148, 120, 60, fill="#ffffff", stroke=INK)
    c.text(432, 174, "exact lookup", 13, INK, 700, "middle")
    c.text(432, 194, "+ RAG", 12, MUTED, 500, "middle")
    c.line(492, 136, 524, 136, arrow=True)
    # daemon
    c.box(532, 84, 82, 104, fill=SOFT, stroke=ACC, sw=2)
    c.text(573, 130, "daemon", 14, ACC, 700, "middle")
    c.text(573, 150, "API", 14, ACC, 700, "middle")
    # agents
    for i, a in enumerate(("Cursor", "Claude Code", "Codex", "your scripts")):
        x = 40 + i * 146
        c.box(x, 268, 130, 40, fill="none", stroke=RULE, r=20)
        c.text(x + 65, 293, a, 14, INK, 600, "middle")
    c.add(f'<path d="M573 188 V236 H105 V262" fill="none" stroke="{INK}" stroke-width="1.5" stroke-dasharray="5 4"/>')
    for i in range(1, 4):
        x = 105 + i * 146
        c.line(x, 236, x, 262, stroke=INK, sw=1.5, dash="5 4")
    c.save()


if __name__ == "__main__":
    for fn in (matchii, mpac, being, skillios, vibe, nl2bp, atari, piasm, kith):
        fn()
