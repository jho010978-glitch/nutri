## Typography Rules
- Apply these rules only when implementing design/UI styling work.
- For text styling in design tasks, read `src/tokens/typography.ts` before coding.
- Reuse `src/components/Typography.tsx` for rendered text where practical.
- Do not hardcode one-off `font-size`/`font-weight` in TSX unless explicitly requested.
- If a new text style is needed, extend `src/tokens/typography.ts` first, then apply it via `variant`/`weight`.
- Keep visual consistency with existing variants before adding new ones.
