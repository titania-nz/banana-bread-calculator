# Banana Bread Calculator

This repository contains a simple React + TypeScript application that calculates ingredient amounts for banana bread. Adjust the number of bananas (between 1 and 100) and the app displays the scaled recipe in either metric or US measurements.

## Features

- **Interactive scaling** – use the number input to set between one and one hundred bananas and watch the recipe update in real time.
- **Measurement toggle** – switch between metric grams/millilitres and US cups using the built‑in toggle.
- **Data driven** – ingredient quantities are derived from `components/assets/Banana_Bread_Scaling_Table.csv` so you can tweak the base recipe if needed.

## Running locally

The project does not ship with a build system. Copy `App.tsx`, the `components` directory and `styles/globals.css` into a React setup of your choice (for example using Vite) and install the usual dependencies. A root `tsconfig.json` with React defaults is included—extend or use it directly before starting your development server.

```bash
npm install
npm run dev        # start a development server
npm run build      # create a production build
npm run preview    # serve the production build locally
```

UI components are sourced from [shadcn/ui](https://ui.shadcn.com).

## Attributions

See [Attributions.md](Attributions.md) for details on third‑party assets.

## License

Distributed under the CC0 license. See [LICENSE](LICENSE) for more information.
