# @irate/ui

The iRate design system: [shadcn/ui](https://ui.shadcn.com) components, the compositions both
apps build on, the light/dark theme, charts, and motion.

```text
src/
  components/ui/   shadcn/ui components (new-york style). We own this code — edit freely.
  components/      iRate compositions: AppShell, AuthLayout, PageHeader, StatCard, Money, …
  charts/          Recharts wrappers               → import from "@irate/ui/charts"
  motion/          FadeIn, Stagger, PageTransition → import from "@irate/ui/motion"
  hooks/           hooks shadcn components need (use-mobile)
  lib/utils.ts     cn() — merge Tailwind classes
  styles/globals.css  Tailwind entry + theme tokens (imported by each app's globals.css)
```

Apps import from the barrel (`import { Button, Card } from "@irate/ui"`). Anything not re-exported
there can be imported directly: `import { Sheet } from "@irate/ui/components/ui/sheet"`.

## Adding a shadcn component

```bash
cd packages/ui
npx shadcn@latest add <component>
```

`components.json` follows shadcn's monorepo setup, so files land in `src/components/ui` with
imports like `@irate/ui/lib/utils`. Afterwards:

1. Check the new file imports `cn` from `@irate/ui/lib/utils`. Some CLI versions write
   `from "cn"` and add an unrelated `cn` npm package — fix the import and
   `npm uninstall cn -w @irate/ui`.
2. Leave `src/styles/globals.css` alone if the CLI appended default colours; tokens are defined
   there once per theme in the iRate palette.
3. Re-export it from `src/index.ts` if both apps will use it.
4. Run `npm run format` from the repository root.

## Theme

Colours live in `src/styles/globals.css` as CSS variables, once under `:root` (light) and once
under `.dark`. `next-themes` toggles the `.dark` class on `<html>`; `ThemeProvider` and
`ThemeToggle` (light / dark / system) wrap it. Use semantic utilities such as `bg-background`,
`text-muted-foreground`, `bg-primary`, `text-success`, `text-warning`, `bg-sidebar`, never raw
colours. To change the palette, edit the variables — both themes and every component follow.

## Customisations to shadcn defaults

- `Button` takes `loading`: it disables the button and shows a spinner (not with `asChild`).
- `Badge` has `success` and `warning` variants (used for KYC status).

## Scripts

```bash
npm run test --workspace=@irate/ui        # Vitest + Testing Library
npm run storybook --workspace=@irate/ui   # http://localhost:6006
```
