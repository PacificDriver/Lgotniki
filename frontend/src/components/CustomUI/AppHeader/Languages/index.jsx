import React, { useEffect, useState } from 'react'

import { translate } from '../../../../hooks/translate'
import { useLocalStorage } from '../../../../hooks/useLocalStorage'
import { useRequire } from '../../../../utils/utils'

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
} from '../../../BaseUI/Dropdown'

import useScreenSize from '../../../../hooks/useScreenSize'
import styles from './Languages.module.scss'

export default function Languages() {
  const [language, setLanguage] = useState(null)

  const { getStorage, persistStorage } = useLocalStorage()
  const { isMobile } = useScreenSize()

  useEffect(() => {
    setLanguage(getStorage('lang') || 'en-US')
  }, [])

  const languages = [
    {
      image: useRequire('countries/estados-unidos-lg.png'),
      name: translate('LANGUAGES.ENGLISH'),
      lang: 'en-US',
    },
    {
      image: useRequire('countries/brasil-lg.png'),
      name: translate('LANGUAGES.PORTUGUESE'),
      lang: 'pt-BR',
    },
    {
      image: useRequire('countries/espanha-lg.png'),
      name: translate('LANGUAGES.SPANISH'),
      lang: 'es-ES',
    },
    {
      image: useRequire('countries/frança.png'),
      name: translate('LANGUAGES.FRENCH'),
      lang: 'fr-FR',
    },
    {
      image: useRequire('countries/italia-lg.png'),
      name: translate('LANGUAGES.ITALIAN'),
      lang: 'it-IT',
    },
    {
      image: useRequire('countries/alemanha.png'),
      name: translate('LANGUAGES.GERMAN'),
      lang: 'de-DE',
    },
  ]

  const defaultLanguage = languages.filter(lang => lang.lang === language)[0]

  const handleLanguageSelection = language => {
    persistStorage('lang', language?.lang)

    window.location.reload()
  }

  return (
    <div className={styles['languages-container']}>
      <Dropdown
        trigger={
          <>
            <div className={styles['default__selector']}>
              <div className="avatar-24">
                <img
                  src={defaultLanguage?.image}
                  alt={defaultLanguage?.name}
                  className={styles['image-selected']}
                />
              </div>
            </div>

            <div className={styles['selector__sm']}>
              <div className={styles['selector']}>
                <img src={defaultLanguage?.image} alt={defaultLanguage?.name} />
              </div>
            </div>
          </>
        }
        placement={isMobile ? 'left' : 'right'}
        hideDropdownIcon
      >
        <DropdownContent className={styles['language-dropdown-selector']}>
          {languages.map((language, index) => (
            <DropdownItem
              key={index}
              onClick={() => handleLanguageSelection(language)}
              className={styles['language-dropdown-selector__item']}
            >
              <div className="d-flex align-items-center gap-initial">
                <div className={styles['image']}>
                  <img src={language.image} alt={language.name} />
                </div>

                <div>{language.name}</div>
              </div>
            </DropdownItem>
          ))}
        </DropdownContent>
      </Dropdown>
    </div>
  )
}
