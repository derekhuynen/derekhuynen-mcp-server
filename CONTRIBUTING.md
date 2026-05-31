# Contributing

Thanks for your interest. This repository is a personal example/reference MCP server, so it is
not accepting feature contributions, but bug reports and suggestions are welcome via issues.

## Local development

```bash
npm install
npm run dev:http     # or: npm run dev:stdio
npm test
```

Before opening a pull request, make sure the full gate passes:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

## Data

The served content in `src/data/profile.json` is generated from a separate private source of
truth via `npm run generate`. Do not hand-edit `profile.json`; it is overwritten on regeneration.
