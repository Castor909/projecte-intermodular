#!/usr/bin/env python3
"""
Generate VinylEth_Presentation.pptx — UD3 final presentation.
Run: python3 docs/build_presentation.py
Output: docs/VinylEth_Presentation.pptx
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

# ── Colour palette (dark premium theme) ──────────────────────────────────────
BG     = RGBColor(0x18, 0x0E, 0x04)   # dark espresso background
CARD   = RGBColor(0x2A, 0x17, 0x0A)   # card / panel bg
CREAM  = RGBColor(0xF2, 0xEC, 0xE0)   # primary text
DIM    = RGBColor(0xA8, 0x9A, 0x88)   # secondary / muted text
ORANGE = RGBColor(0xD4, 0x62, 0x2A)   # burnt orange accent
GOLD   = RGBColor(0xE8, 0x8A, 0x50)   # lighter accent

DOCS = os.path.dirname(os.path.abspath(__file__))
SS   = os.path.join(DOCS, "screenshots")

# ── Low-level helpers ─────────────────────────────────────────────────────────

def new_prs():
    prs = Presentation()
    prs.slide_width  = Inches(13.33)
    prs.slide_height = Inches(7.5)
    return prs

def blank(prs):
    return prs.slides.add_slide(prs.slide_layouts[6])

def set_bg(slide, color=BG):
    f = slide.background.fill
    f.solid()
    f.fore_color.rgb = color

def txt(slide, text, x, y, w, h,
        size=22, color=CREAM, bold=False,
        align=PP_ALIGN.LEFT, italic=False):
    box = slide.shapes.add_textbox(
        Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    r = p.add_run()
    r.text = text
    r.font.size      = Pt(size)
    r.font.color.rgb = color
    r.font.bold      = bold
    r.font.italic    = italic
    r.font.name      = "Calibri"
    return box

def bullets(slide, items, x, y, w, h,
            size=18, color=CREAM, prefix="▸  "):
    box = slide.shapes.add_textbox(
        Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(5)
        r = p.add_run()
        r.text           = prefix + item
        r.font.size      = Pt(size)
        r.font.color.rgb = color
        r.font.name      = "Calibri"
    return box

def rect(slide, x, y, w, h, fill=CARD, line=False):
    shp = slide.shapes.add_shape(
        1,  # MSO_AUTO_SHAPE_TYPE.RECTANGLE
        Inches(x), Inches(y), Inches(w), Inches(h))
    shp.fill.solid()
    shp.fill.fore_color.rgb = fill
    if line:
        shp.line.color.rgb = line
    else:
        shp.line.fill.background()
    return shp

def hrule(slide, x, y, w, color=ORANGE, h=0.025):
    r = rect(slide, x, y, w, h, fill=color)
    return r

def accent_bar(slide):
    """Left orange vertical bar — consistent across all slides."""
    rect(slide, 0, 0, 0.08, 7.5, fill=ORANGE)

def img(slide, path, x, y, w, h=None):
    if not os.path.exists(path):
        return
    if h:
        return slide.shapes.add_picture(
            path, Inches(x), Inches(y), Inches(w), Inches(h))
    return slide.shapes.add_picture(
        path, Inches(x), Inches(y), Inches(w))

def slide_header(slide, title):
    accent_bar(slide)
    txt(slide, title, 0.35, 0.25, 12.5, 0.72,
        size=34, color=ORANGE, bold=True)
    hrule(slide, 0.35, 1.0, 12.7)

# ── Slide builders ────────────────────────────────────────────────────────────

def s_title(prs):
    s = blank(prs); set_bg(s)
    accent_bar(s)

    txt(s, "VinylEth", 0.35, 1.2, 9, 1.7,
        size=82, color=ORANGE, bold=True)
    hrule(s, 0.35, 3.1, 7.5, color=CREAM, h=0.018)
    txt(s, "Final Project Report", 0.35, 3.25, 9, 0.75,
        size=28, color=CREAM)
    txt(s, "Intermodular Project UD3  ·  CIFP Francesc de Borja Moll",
        0.35, 4.05, 10, 0.5, size=15, color=DIM)
    txt(s, "Stepan Andreev", 0.35, 5.2, 6, 0.5,
        size=20, color=CREAM, bold=True)
    txt(s, "June 2026  ·  github.com/Castor909/projecte-intermodular",
        0.35, 5.75, 10, 0.4, size=13, color=DIM)

    # Right info block
    for i, (label, value) in enumerate([
        ("Stack",    "MERN"),
        ("Payments", "Ethereum / MetaMask"),
        ("Network",  "Sepolia testnet"),
        ("APIs",     "Discogs · iTunes · Resend"),
    ]):
        y = 1.5 + i * 1.3
        rect(s, 9.8, y, 3.3, 1.1, fill=CARD)
        hrule(s, 9.8, y, 0.2, color=ORANGE, h=1.1)
        txt(s, label, 10.15, y + 0.08, 3.0, 0.38,
            size=12, color=DIM)
        txt(s, value, 10.15, y + 0.5, 3.0, 0.5,
            size=16, color=CREAM, bold=True)


def s_idea(prs):
    s = blank(prs); set_bg(s)
    slide_header(s, "The Project")

    txt(s,
        "VinylEth is an online vinyl record store where customers "
        "pay with Ethereum through MetaMask — no traditional "
        "payment processor required.",
        0.35, 1.2, 6.3, 1.3, size=19, color=CREAM)

    bullets(s, [
        "Vinyl revival: 45M records sold in 2023",
        "Target niche: vinyl fans + Web3 users",
        "Privacy-first: no credit cards, no banks",
        "Full e-commerce flow: browse → cart → crypto payment",
        "Real on-chain transaction on Sepolia testnet",
    ], 0.35, 2.65, 6.3, 3.5, size=17)

    img(s, os.path.join(SS, "featured_album_and_special_offers.png"),
        6.9, 1.15, 6.2)


def s_stack(prs):
    s = blank(prs); set_bg(s)
    slide_header(s, "Tech Stack")

    cards = [
        ("React 19  +  React Router 7", "Frontend SPA (Vite build tool)",        ORANGE),
        ("Node.js  +  Express 5",        "REST API backend",                       GOLD),
        ("MongoDB  +  Mongoose 9",       "NoSQL document database",                ORANGE),
        ("JWT  +  bcrypt",               "Stateless auth · password hashing",      GOLD),
        ("MetaMask  (window.ethereum)",  "Ethereum payments — no extra lib",       ORANGE),
        ("Discogs API  +  iTunes API",   "Album metadata · audio previews",        GOLD),
        ("Resend",                       "Transactional email receipts",            ORANGE),
        ("PWA Manifest",                 "Add to Home Screen on mobile",            GOLD),
    ]

    for i, (title, desc, accent) in enumerate(cards):
        col = 0.35 + (i % 2) * 6.45
        row = 1.15 + (i // 2) * 1.45
        rect(s, col, row, 6.2, 1.28, fill=CARD)
        hrule(s, col, row, 0.22, color=accent, h=1.28)
        txt(s, title, col + 0.42, row + 0.1,  5.6, 0.5,
            size=18, color=CREAM, bold=True)
        txt(s, desc,  col + 0.42, row + 0.65, 5.6, 0.45,
            size=14, color=DIM)


def s_architecture(prs):
    s = blank(prs); set_bg(s)
    slide_header(s, "Architecture")
    img(s, os.path.join(DOCS, "architecture.png"), 0.35, 1.15, 12.6)


def s_catalog(prs):
    s = blank(prs); set_bg(s)
    slide_header(s, "Catalog & Browsing")

    img(s, os.path.join(SS, "search_catalogue.png"),
        0.35, 1.15, 7.8)

    bullets(s, [
        "Real-time search — 250ms debounce",
        "Genre filter fetched from database",
        "8 sort options (price, year, stock…)",
        "Pagination via Load more",
        "Stock badges — Out of Stock / Last Copies",
        "Skeleton loading cards",
        "Recently viewed shelf (localStorage)",
    ], 8.4, 1.25, 4.7, 5.8, size=16)


def s_detail(prs):
    s = blank(prs); set_bg(s)
    slide_header(s, "Album Detail & Audio Preview")

    img(s, os.path.join(SS, "album_preview.png"),
        0.35, 1.15, 7.8)

    bullets(s, [
        "Full metadata (label, country, format)",
        "Tracklist with individual durations",
        "Custom HTML5 audio player",
        "  · Play/pause, seek bar, buffering",
        "  · iTunes 30-second preview URL",
        "Similar albums (same genre, 4 items)",
        "Add to cart / wishlist toggle",
    ], 8.4, 1.25, 4.7, 5.8, size=16)


def s_payment(prs):
    s = blank(prs); set_bg(s)
    slide_header(s, "Checkout & MetaMask Payment")

    img(s, os.path.join(SS, "payment_process.png"),
        0.35, 1.15, 7.8)

    txt(s, "3-step flow:", 8.4, 1.25, 4.7, 0.45,
        size=16, color=GOLD, bold=True)

    steps = [
        "Cart  →  Shipping form  →  Payment",
        "Shipping address auto-filled from profile",
        "Chain switch to Sepolia (0xaa36a7)",
        "eth_sendTransaction via MetaMask",
        "ETH → Wei via BigInt (no float errors)",
        "TX hash + Etherscan link on confirm",
        "Order saved to DB  +  email receipt sent",
        "Cart cleared automatically",
    ]
    bullets(s, steps, 8.4, 1.75, 4.7, 5.3,
            size=15, prefix="→  ")


def s_admin(prs):
    s = blank(prs); set_bg(s)
    slide_header(s, "Admin Panel")

    img(s, os.path.join(SS, "admin_panel.png"),
        0.35, 1.15, 7.8)

    bullets(s, [
        "Dashboard: albums, orders, revenue, top sellers",
        "Album CRUD — full form",
        "Quick Discogs import (release ID → all fields)",
        "iTunes audio preview auto-fill",
        "Batch: discount %, featured flag, delete",
        "CSV export of album catalog",
        "Order search by TX hash + date range",
        "Separate password auth (x-admin-token)",
    ], 8.4, 1.25, 4.7, 5.8, size=15)


def s_problems(prs):
    s = blank(prs); set_bg(s)
    slide_header(s, "Problems & Solutions")

    problems = [
        (
            "MongoDB SIGSEGV crash on development machine",
            "Native mongodb-bin 8.2.7 crashed at startup on Arch Linux.",
            "Docker mongo:7 — stable DB, zero code changes needed.",
        ),
        (
            "ETH → Wei floating-point precision loss",
            "amount * 1e18 produced rounding errors for values like 0.015 ETH.",
            "BigInt arithmetic: split at decimal point, scale each part independently.",
        ),
        (
            "ESLint: CartContext exported provider + hook in same file",
            "React fast-refresh plugin rejected mixed exports.",
            "Split into useCart.js + cartContextValue.js — also improved SoC.",
        ),
    ]

    for i, (title, problem, solution) in enumerate(problems):
        y = 1.2 + i * 2.0
        rect(s, 0.35, y, 12.7, 1.78, fill=CARD)
        hrule(s, 0.35, y, 0.22, color=ORANGE, h=1.78)
        txt(s, title,    0.75, y + 0.1,  12.0, 0.45,
            size=17, color=ORANGE, bold=True)
        txt(s, "⚠  " + problem,  0.75, y + 0.58, 12.0, 0.45,
            size=14, color=DIM)
        txt(s, "✓  " + solution, 0.75, y + 1.05, 12.0, 0.55,
            size=14, color=CREAM)


def s_evolution(prs):
    s = blank(prs); set_bg(s)
    slide_header(s, "Project Evolution")

    phases = [
        ("UD1A", "Initial Setup", [
            "React + mock catalog",
            "Express skeleton",
            "Design system defined",
        ]),
        ("UD1B", "Backend + Cart", [
            "MongoDB + Album model",
            "REST API (albums list & detail)",
            "Cart with localStorage",
        ]),
        ("UD2A", "Wallet + Search", [
            "MetaMask connect in header",
            "Cart quantity controls",
            "Catalog search, filter, sort",
        ]),
        ("UD3", "Complete App", [
            "Full payment flow + orders",
            "JWT auth + admin panel",
            "Email, wishlist, PWA",
        ]),
    ]

    # Timeline bar
    hrule(s, 0.35, 4.3, 12.7, color=ORANGE, h=0.05)

    col_w = 3.15
    for i, (phase, title, items) in enumerate(phases):
        x = 0.35 + i * col_w

        # Phase label
        txt(s, phase, x, 1.15, col_w - 0.15, 0.7,
            size=30, color=ORANGE, bold=True, align=PP_ALIGN.CENTER)
        txt(s, title, x, 1.9, col_w - 0.15, 0.5,
            size=15, color=GOLD, align=PP_ALIGN.CENTER)
        hrule(s, x + 0.15, 2.48, col_w - 0.4, color=CARD, h=0.02)

        # Bullet items above timeline
        bullets(s, items, x + 0.15, 2.6, col_w - 0.3, 1.55,
                size=13, color=DIM, prefix="· ")

        # Dot on timeline
        dot_x = x + col_w / 2 - 0.2
        rect(s, dot_x, 4.14, 0.38, 0.38, fill=ORANGE)

        # Phase repeated below dot
        txt(s, phase, x, 4.65, col_w - 0.15, 0.5,
            size=16, color=ORANGE, bold=True, align=PP_ALIGN.CENTER)


def s_conclusions(prs):
    s = blank(prs); set_bg(s)
    slide_header(s, "What Was Achieved")

    # Stats row
    stats = [
        ("111", "features implemented"),
        ("17",  "API endpoints"),
        ("3",   "external APIs"),
        ("4",   "dev phases"),
    ]
    for i, (num, label) in enumerate(stats):
        x = 0.35 + i * 3.15
        rect(s, x, 1.2, 3.0, 1.5, fill=CARD)
        txt(s, num,   x, 1.25, 3.0, 0.9,
            size=54, color=ORANGE, bold=True, align=PP_ALIGN.CENTER)
        txt(s, label, x, 2.1,  3.0, 0.45,
            size=14, color=DIM, align=PP_ALIGN.CENTER)

    # Two columns
    txt(s, "Delivered", 0.35, 2.95, 6.2, 0.45,
        size=18, color=GOLD, bold=True)
    bullets(s, [
        "Full e-commerce flow: browse → cart → crypto payment",
        "Ethereum payments via MetaMask on Sepolia testnet",
        "Production-grade admin panel with Discogs import",
        "JWT auth, order history, email receipts via Resend",
    ], 0.35, 3.48, 6.2, 2.8, size=16)

    txt(s, "Future improvements", 6.75, 2.95, 6.2, 0.45,
        size=18, color=GOLD, bold=True)
    bullets(s, [
        "Solidity escrow contract (buyer protection)",
        "Stock reservation during checkout",
        "Image upload via Cloudinary",
        "Automated test suite — Vitest + Jest + Supertest",
    ], 6.75, 3.48, 6.2, 2.8, size=16, color=DIM)


def s_thankyou(prs):
    s = blank(prs); set_bg(s)
    accent_bar(s)

    txt(s, "Thank you.", 0.35, 1.6, 10, 1.7,
        size=78, color=CREAM, bold=True)
    hrule(s, 0.35, 3.5, 8.5, color=ORANGE, h=0.025)
    txt(s, "Questions?", 0.35, 3.7, 8, 0.9,
        size=38, color=ORANGE)
    txt(s, "github.com/Castor909/projecte-intermodular",
        0.35, 5.1, 10, 0.5, size=18, color=DIM)
    txt(s, "Stepan Andreev  ·  Projecte Intermodular UD3  ·  June 2026",
        0.35, 5.7, 10, 0.4, size=13, color=DIM)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    prs = new_prs()

    s_title(prs)        # 1
    s_idea(prs)         # 2
    s_stack(prs)        # 3
    s_architecture(prs) # 4
    s_catalog(prs)      # 5
    s_detail(prs)       # 6
    s_payment(prs)      # 7
    s_admin(prs)        # 8
    s_problems(prs)     # 9
    s_evolution(prs)    # 10
    s_conclusions(prs)  # 11
    s_thankyou(prs)     # 12

    out = os.path.join(DOCS, "VinylEth_Presentation.pptx")
    prs.save(out)
    print(f"✓  Saved: {out}  ({len(prs.slides)} slides)")

if __name__ == "__main__":
    main()
