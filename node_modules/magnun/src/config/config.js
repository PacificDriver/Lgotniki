const config = {
  theme: {
    default: 'light', // or dark
    sidebar: {
      default: 'light', // or dark
    },
    header: {
      default: 'light', // or dark
    },
  },
  i18n: {
    defaultLanguage: 'en-US',
    supportedLanguages: ['en-US', 'pt-BR', 'es-ES'],
  },
  layout: {
    sidebar: {
      collapsed: false,
      width: 260,
    },
    header: {
      visible: true,
      fixed: false,
    },
    footer: {
      visible: true,
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
