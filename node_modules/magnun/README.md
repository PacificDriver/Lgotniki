# Magnun - React Admin Template

Magnun is a modern and responsive admin dashboard template built with ReactJS. It is designed to streamline development and provide a clean, customizable interface for building administrative applications and dashboards.

## Features

- **Responsive Design**: Works seamlessly across desktops, tablets, and mobile devices.
- **Dark Mode and Light Mode**: Easily switch between themes.
- **Modular Components**: Reusable React components for faster development.
- **Internationalization (i18n)**: Supports multiple languages (English, Portuguese, Spanish).
- **Dynamic Data Visualization**: Integrated with ApexCharts and other tools.
- **Simple Customization**: Configure layout, themes, and behavior with ease.
- **Intuitive Navigation**: Combines sidebar and header navigation for a better user experience.

---

## Installation

### Requirements

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (latest LTS version)
- npm (comes with Node.js) or yarn

### Steps

1. **Download**:

   ```bash
   Download the package
   cd Magnun
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # Or, if you prefer yarn:
   yarn install
   ```

3. **Run the development server**:

   ```bash
   npm start
   # Or:
   yarn start
   ```

4. **Build for production**:

   ```bash
   npm run build
   # Or:
   yarn build
   ```

5. **Visit your application**:
   - Development: Open your browser and go to `http://localhost:3000`
   - Production: Use the generated files in the `build/` folder.

---

## Configuration

Magnun provides a flexible configuration system located in `src/config/config.js`. You can customize the theme, layout, and other settings by modifying this file.

### Example Configuration

```javascript
const config = {
  theme: {
    default: 'dark',
    sidebar: {
      default: 'light',
    },
    header: {
      default: 'light',
    },
  },
  i18n: {
    defaultLanguage: 'en-US',
    supportedLanguages: ['en-US', 'pt-BR', 'es-ES'],
  },
  layout: {
    type: 'vertical',
    container: 'boxed',
    sidebar: {
      collapsed: false,
      width: 260,
    },
    header: {
      visible: true,
      fixed: false,
    },
    footer: {
      visible: false,
    },
  },
  formatting: {
    currency: {
      name: 'USD',
      language: 'en-US',
    },
  },
}

export default config
```

### Key Settings

- **Theme**:
  - `default`: Set to `light` or `dark`.
  - `sidebar` and `header`: Customize their themes individually.
- **i18n**:
  - `defaultLanguage`: The default language for the app.
  - `supportedLanguages`: Languages supported by the app.
- **Layout**:
  - `type`: Vertical or horizontal navigation.
  - `container`: Boxed or fluid layout.
  - `sidebar.collapsed`: Toggle sidebar collapse.
  - `header.visible`: Show or hide the header.
  - `footer.visible`: Show or hide the footer.

---

## Folder Structure

Here is an overview of the project's folder structure:

```
Magnun/
├── assets/               # Static assets (images, icons, etc.)
├── components/           # Reusable React components
├── config/               # Configuration files
├── contexts/             # Context API for global state management
├── core/                 # Core application logic and initialization
├── hooks/                # Custom React hooks
├── i18n/                 # Internationalization (language files)
├── layout/               # Layout components and structure
├── mocks/                # Mock data for testing
├── services/             # API services and business logic
├── styles/               # SCSS and CSS styles
├── utils/                # Utility functions and helpers
├── views/                # Main views/pages of the application
├── widgets/              # Custom widgets for dashboards
└── index.js              # Main entry point for the application
```

---

## Credits

Magnun utilizes several open-source libraries and tools:

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [ApexCharts](https://apexcharts.com/) - Modern charting library.
- [i18next](https://www.i18next.com/) - Internationalization framework.
- [Sass](https://sass-lang.com/) - CSS preprocessor.
- And more (see `package.json`).

---

## Version History

### February 17, 2025

- 🛠️ **Restructuring of Folder and File Structure**
  - **File Structure Refactoring:**
    - Moved `App.js` to the `core/` folder.
    - Split `_nav.js` and moved it to the `config/` folder, renaming it to `navigation.js` (_`config.js` remains unchanged_).
    - Added `routes.js` to centralize the routes.
    - Reorganized utility files in the `utils/` folder:
      - Integrated `currencyToLocale.js` into the `formatters/` module.
      - Renamed `_utils.js` to `utils.js`.
      - Retained `extensions.js` but relocated it within the new structure.
  - **Internationalization Refactoring:**
    - Renamed the `translate/` folder to `i18n/`, aligning with the international standard for language management.
  - **Code Standardization:**
    - Added Prettier and ESLint linters to standardize and improve code quality.
  - **Removal of Obsolete Code:**
    - Removed components `Switch`, `AppChart`, and `AppChat` due to their discontinuation and lack of necessity in the current routes.
  - **New Feature:**
    - Created the `FloatWindow` component, which renders elements outside of the `#root` to avoid issues with overflow in internal divs.
- **New Folder Structure (Simplified):**

```
/src
  ├── core
  │ └── App.js
  ├── config
  │ ├── config.js
  │ ├── navigation.js
  │ └── routes.js
  ├── utils
  │ ├── formatters
  │ ├── extensions.js
  │ └── utils.js
  ├── i18n
  │ ├── languages
  │ └── index.js
  └── ...
```

### November 02, 2024

- Completed a complete redesign of the product to enhance the user interface and overall experience.
- Added a new invoicing app to allow users to generate, view, and manage invoices efficiently.
- Fixed usability issues and minor bugs for a more stable experience.
- Updated UI components for better customization and usability.
- Improved performance with significant optimizations for faster and smoother navigation.
- Enhanced user engagement with streamlined visuals and new design elements.

### June 20, 2024

- **Initial Release:** Launched the Magnun product, providing foundational features and a stable framework for future updates.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Support

For questions or support, visit our [support page](https://oreonhub-help.freshdesk.com/support/home).
