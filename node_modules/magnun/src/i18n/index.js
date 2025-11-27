import i18n from 'i18next'
import languageDetector from 'i18next-browser-languagedetector'

import { messages } from './languages/index'
import config from '../config/config'

let lang = localStorage.getItem('lang')
const defaultLanguage = config.i18n.defaultLanguage

if (!lang) {
  localStorage.setItem('lang', JSON.stringify(defaultLanguage))
  localStorage.setItem('i18nextLng', JSON.stringify(defaultLanguage))
  lang = JSON.stringify(defaultLanguage)
}

i18n.use(languageDetector).init({
  resources: messages,
  lng: JSON.parse(lang)?.split('-')[0],
  debug: false,
  defaultNS: ['translations'],
  fallbackLng: defaultLanguage?.split('-')?.[0] || 'en',
  ns: ['translations'],
})

export { i18n }
