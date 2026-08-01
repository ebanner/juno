// APL → J glyph translation (ported from Emacs apl->j).
// Longer keys are matched first. "{:" / "}." are protected via placeholders
// so the "{" → "{{" and "}" → "}}" rules do not mangle them.
(function (global) {
  const pairs = [
    ["{:", "*tail*"],
    ["}.", "*behead*"],
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
    ["∘", "@"],
    ["∧", "*."],
    ["´", "/"],
    ["⊏", "{:"],
    ["↓", "}."],
    ["≠", "~:"],
    ["¯", "_"],
  ];

  const pairs2 = [
    ["*tail*", "{:"],
    ["*behead*", "}."],
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

  global.aplToJ = aplToJ;
  console.log("[aplToJ] loaded");
})(typeof globalThis !== "undefined" ? globalThis : window);
