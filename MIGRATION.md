# Migration from Webpack to Vite

This document outlines the changes made to migrate your portfolio project from Webpack to Vite.

## Changes Made

### 1. Dependencies

- **Removed**: All Webpack-related packages

  - webpack
  - webpack-cli
  - webpack-dev-server
  - webpack-merge
  - html-webpack-plugin
  - css-loader
  - style-loader
  - sass-loader
  - ts-loader

- **Added**: Vite and related packages
  - vite
  - sass (for SCSS preprocessing)

### 2. Configuration Files

- **Removed**:

  - `webpack.common.js`
  - `webpack.dev.js`
  - `webpack.prod.js`

- **Added**:
  - `vite.config.ts` - Main Vite configuration

### 3. Package.json Scripts

- **Before**:

  ```json
  "scripts": {
    "dev": "webpack serve --open --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  }
  ```

- **After**:
  ```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
  ```

### 4. HTML Entry Point

- **Added** script tag to `src/index.html`:
  ```html
  <script type="module" src="/ts/main.ts"></script>
  ```

### 5. TypeScript Configuration

- Updated `tsconfig.json` for better Vite compatibility:
  - Changed `module` from "commonjs" to "ESNext"
  - Added `moduleResolution: "bundler"`
  - Updated `target` to "ES2020"
  - Added DOM libraries
  - Enabled `isolatedModules` and `allowSyntheticDefaultImports`

### 6. Three.js Import Fix

- Changed from default import to namespace import:

  ```typescript
  // Before
  import Three from "three";

  // After
  import * as THREE from "three";
  ```

## Benefits of Vite

1. **Faster Development**: Vite uses esbuild for lightning-fast rebuilds
2. **Better HMR**: Hot Module Replacement is more reliable and faster
3. **Native ES Modules**: Modern approach to module handling
4. **Simpler Configuration**: Less boilerplate compared to Webpack
5. **Built-in TypeScript Support**: No need for additional loaders
6. **Built-in SCSS Support**: Just install `sass` package

## Available Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production in `dist/` folder
- `npm run preview` - Preview the production build locally

## Notes

- The Sass deprecation warnings about @import are cosmetic and don't affect functionality
- The CJS Node API deprecation warning is also cosmetic
- All existing SCSS files work without modification
- Three.js and GSAP dependencies remain unchanged and fully functional
