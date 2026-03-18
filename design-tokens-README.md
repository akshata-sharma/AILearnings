# Design Tokens

Included files:
- `design-tokens.ts`: typed token source for app-level usage
- `design-tokens.css`: CSS custom properties version

Suggested usage:
1. Import `designTokens` into your theme utilities or components.
2. Mirror the same values into Tailwind config if you want named utilities.
3. Ask Claude to strictly use these tokens instead of inventing values for colors, radius, spacing, or gradients.

Recommended guidance for Claude:
- Never use arbitrary hex values if a token exists.
- Never use decimal border-radius values.
- Reuse gradient tokens exactly.
- Use component tokens for cards, buttons, and sections.
