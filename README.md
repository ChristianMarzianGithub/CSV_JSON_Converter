# CSV ↔ JSON Converter

A Vite + React + TypeScript tool for converting between CSV and JSON with strong handling of nested data, delimiter detection, and clear validation messages. TailwindCSS powers a responsive light/dark UI and conversions run in a Web Worker to keep the interface smooth.

## Features

- Two-way conversion with a mode selector (JSON → CSV, CSV → JSON)
- JSON handling: wraps single objects, flattens nested keys with dot notation, stringifies arrays, and escapes commas/quotes/newlines
- CSV handling: delimiter auto-detection (comma, semicolon, tab), robust quoted field parsing, and reconstruction of nested objects from dot-notation headers
- Input validation with friendly errors; output updates only after pressing **Convert**
- Download outputs as `.json` or `.csv`
- Dark/light mode toggle via Tailwind
- Conversion logic isolated in `src/utils/jsonToCsv.ts` and `src/utils/csvToJson.ts`
- Unit tests for both conversion utilities

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Run the unit tests:

   ```bash
   npm test
   ```

4. Build for production:

   ```bash
   npm run build
   ```

## Usage

1. Select **JSON → CSV** or **CSV → JSON**.
2. Paste your input into the left text area.
3. Click **Convert** to produce the result on the right.
4. Use **Download Output** to save the result as `.json` or `.csv`, or **Clear** to reset.

### Example Inputs

- JSON

  ```json
  [
    {"name": "Ada", "city": "London", "address": {"street": "42 Binary Rd", "zip": 10001}},
    {"name": "Linus", "city": "Helsinki", "languages": ["C", "Perl"], "active": true}
  ]
  ```

- CSV

  ```csv
  name,company,address.city,address.zip
  "Ada",Acme,"London",10001
  "Linus",Open Source,"Helsinki",00200
  ```

## Project Structure

```
├── index.html
├── src
│   ├── App.tsx
│   ├── main.tsx
│   ├── hooks
│   │   └── useConverterWorker.ts
│   ├── components
│   │   ├── ErrorBanner.tsx
│   │   ├── ModeSelector.tsx
│   │   ├── TextPanel.tsx
│   │   └── ThemeToggle.tsx
│   ├── utils
│   │   ├── csvToJson.test.ts
│   │   ├── csvToJson.ts
│   │   ├── jsonToCsv.test.ts
│   │   └── jsonToCsv.ts
│   ├── workers
│   │   └── conversionWorker.ts
│   └── index.css
├── tailwind.config.cjs
├── postcss.config.cjs
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── package.json
```

## Notes

- Delimiter detection scans the first few rows for commas, semicolons, or tabs.
- Dot-notation headers like `address.city` rebuild nested objects in JSON results.
- Arrays inside JSON are stringified when producing CSV.
