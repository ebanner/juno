// APL → J glyph translation (ported from Emacs apl->j).
// Longer keys are matched first. "{:" / "}." are protected via placeholders
// so the "{" → "{{" and "}" → "}}" rules do not mangle them.
(function (global) {
  const pairs = [
    // ["{:", "*tail*"],
    ["⍵", " y "],
    ["⍨", "~"],
    ["⌸", "/."],
    ["⊃", "{."],
    ["≢", "#"],
    ["⍒", "\\:"],
    ["⍋", "/:"],
    ["⍤", '"'],
    ["↑", "{."],
    ["{", "{{"],
    ["}", "}}"],
    ["⍺", "x"],
    ["∨", "+."],
    ["×", "*"],
    ["⍳", "i."],
    ["⌷", "{"],
    ["~", "-."],
    ["∪", "~."],
    ["↕", "<\\"],
    ["←", "=:"],
    ["¨", "&>"],
    ["⍤", "@"],
    ["∧", "*."],
    ["´", "/"],
    ["⊏", "{"],
    ["↓", "}."],
    ["≠", "~:"],
    ["¯", "_"],
    ["⍸", "I."],
    ["⊢", "]"],
    ["⍥", "&:"],
    ["⍴", "$"],
    ["÷", "%"],
    ["≥", ">:"],
    ["≤", "<:"],
    ["⊥", "#."],
    ["⌊", "<."],
    ["⌈", ">."],
    ["*", "^"],
    ["⍣", "^:"],
    ["⊙", "}"],
    ["⍎", '".'],
    ["⌽", "|."],
    ["∘", "&"],
    ["⋅", "/ ."],
    ["≡", "-:"],
    ["¬", "-."],
    ["⍬", "a:"],
    ["∊", " e."],
    ["♯", "#"],
    ["˜", "~"],
    ["≍", ",:"],
    ["⌺", ";."],
    ["⊐", "{:"],
  ];

  const pairs2 = [
    ["*tail*", "{:"],
  ];

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function replacePairs(str, table) {
    const map = new Map();
    for (const [from, to] of table) {
      if (!map.has(from)) map.set(from, to); // first wins (like Emacs assoc)
    }
    const keys = [...map.keys()].sort((a, b) => b.length - a.length);
    const re = new RegExp(keys.map(escapeRegExp).join("|"), "g");
    return str.replace(re, (match) => map.get(match));
  }

  function aplToJ(aplStr) {
    const out = replacePairs(replacePairs(aplStr, pairs), pairs2);
    console.log("[aplToJ]", { before: aplStr, after: out });
    return out;
  }

  // Type a word then Space to expand it to a glyph (edit this map freely).
  const wordToGlyph = {
    omega: "⍵",
    alpha: "⍺",
  };

  /**
   * CodeMirror keymap handler: on Space, replace the word before the
   * cursor with its glyph (and a trailing space). Returns true if handled.
   */
  function expandAplWord(view) {
    const { state } = view;
    const sel = state.selection.main;
    if (!sel.empty) return false;

    const pos = sel.head;
    const line = state.doc.lineAt(pos);
    const before = line.text.slice(0, pos - line.from);
    const match = before.match(/([A-Za-z][A-Za-z0-9_]*)$/);
    if (!match) return false;

    const word = match[1];
    const glyph = wordToGlyph[word] ?? wordToGlyph[word.toLowerCase()];
    if (!glyph) return false;

    const from = pos - word.length;
    const insert = glyph + " ";
    view.dispatch({
      changes: { from, to: pos, insert },
      selection: { anchor: from + insert.length },
      userEvent: "input.complete",
    });
    console.log("[expandAplWord]", { word, glyph });
    return true;
  }

  global.aplToJ = aplToJ;
  global.expandAplWord = expandAplWord;
  global.aplWordToGlyph = wordToGlyph;
  console.log("[aplToJ] loaded");
})(typeof globalThis !== "undefined" ? globalThis : window);
