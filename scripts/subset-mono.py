# /// script
# requires-python = ">=3.10"
# dependencies = ["fonttools==4.66.1", "brotli==1.2.0"]
# ///
"""Cuts the code face down to what the site sets in it.

Fontsource's "latin" files of Maple Mono also carry Greek, Cyrillic,
Vietnamese, Braille and the Nerd Font symbols: 74 KB a weight. Code on the
site is Latin text, punctuation, arrows, math and box drawing; everything
else falls through to the next monospace face in --font-mono. The default
features stay (calt carries the ligatures); the alternates (cv*, ss*) are
not used. Maple Mono's licence (OFL 1.1) reserves its name, so the cut face
is renamed. Run after bumping @fontsource/maple-mono:

    uv run scripts/subset-mono.py

`npm run check:glyphs` (scripts/check-mono-glyphs.mjs, part of verify) fails
when the manual's code or the landing page uses a character Maple Mono has
but this cut dropped; add it to UNICODES and run this again.
"""

from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "node_modules/@fontsource/maple-mono/files"
OUT = ROOT / "assets/fonts"
WEIGHTS = ["400", "500"]
UNICODES = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,"
    "U+0329,U+2000-206F,U+20AC,U+2122,U+2190-21FF,U+2200-22FF,U+2500-257F,U+2713-2718,"
    "U+FEFF,U+FFFD"
)
FEATURES = ["calt", "ccmp", "locl"]
# Family, unique id, full name, PostScript name and the typographic and
# variation names: every record that spells the reserved name.
NAMED = {1, 3, 4, 6, 16, 17, 18, 21, 22, 25}


def rename(font: TTFont) -> None:
    for record in font["name"].names:
        if record.nameID in NAMED:
            text = record.toUnicode()
            text = text.replace("Maple Mono", "Ocra Mono").replace("MapleMono", "OcraMono")
            record.string = text


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    options = subset.Options()
    options.layout_features = FEATURES
    options.flavor = "woff2"
    # Keep the copyright and licence records: the licence travels with the face.
    options.name_IDs = ["*"]
    # Without its glyph names (post table) the face rasterises a shade
    # differently in Chrome on macOS, and every screenshot with code changes.
    options.glyph_names = True
    unicodes = subset.parse_unicodes(UNICODES)
    for weight in WEIGHTS:
        font = TTFont(SOURCE / f"maple-mono-latin-{weight}-normal.woff2")
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=unicodes)
        subsetter.subset(font)
        rename(font)
        target = OUT / f"ocra-mono-{weight}.woff2"
        font.flavor = "woff2"
        font.save(target)
        print(f"{target.relative_to(ROOT)}: {target.stat().st_size} bytes")


main()
