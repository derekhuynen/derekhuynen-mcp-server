// Pure, dependency-free helpers for building the public profile snapshot.
// These are unit-tested; keep them free of file IO.

const EM_DASH = '—';

/** Throw if text contains an em-dash (U+2014). En-dash (U+2013) is allowed. */
export function assertNoEmDashes(text, context) {
  if (typeof text === 'string' && text.includes(EM_DASH)) {
    throw new Error(`Em-dash (U+2014) found in ${context}; replace it before publishing.`);
  }
}

/** Recursively assert no em-dashes across all string values of an object/array. */
export function assertNoEmDashesDeep(value, context) {
  if (typeof value === 'string') {
    assertNoEmDashes(value, context);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => assertNoEmDashesDeep(v, `${context}[${i}]`));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) assertNoEmDashesDeep(v, `${context}.${k}`);
  }
}

/** Return the trimmed body text under `## <heading>` up to the next `## ` heading, or ''. */
export function extractSection(markdown, heading) {
  const lines = markdown.split('\n');
  const start = lines.findIndex((l) => l.trim() === `## ${heading}`);
  if (start === -1) return '';
  const body = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) break;
    body.push(lines[i]);
  }
  return body.join('\n').trim();
}

/** Split a comma-separated string into trimmed, non-empty values.
 *  Commas inside parentheses are NOT split points. A single trailing
 *  period is removed from each value (skills sentences end in a period). */
export function parseCommaList(text) {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const ch of text) {
    if (ch === '(') {
      depth++;
      cur += ch;
    } else if (ch === ')') {
      depth = Math.max(0, depth - 1);
      cur += ch;
    } else if (ch === ',' && depth === 0) {
      parts.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  parts.push(cur);
  return parts
    .map((s) => s.trim().replace(/\.$/, '').trim())
    .filter((s) => s.length > 0);
}

/** Collapse internal whitespace runs (including newlines) to single spaces, trimmed. */
export function collapseWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim();
}

/** Parse a skills.md body of `## Group` headings each followed by a comma-separated line.
 *  Lines within a group are joined before parsing so that wrapped skill lists are handled. */
export function parseSkillGroups(markdown) {
  const lines = markdown.split('\n');
  const groups = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      const category = line.slice(3).trim();
      const bodyLines = [];
      let started = false;
      for (let j = i + 1; j < lines.length; j++) {
        const l = lines[j];
        if (l.startsWith('## ')) break;
        if (l.trim().startsWith('>')) continue;
        if (l.trim() === '') {
          if (started) break;
          continue;
        }
        started = true;
        bodyLines.push(l.trim());
      }
      const joined = bodyLines.join(' ');
      const items = joined ? parseCommaList(joined) : [];
      if (items.length > 0) groups.push({ category, items });
    }
  }
  return groups;
}
