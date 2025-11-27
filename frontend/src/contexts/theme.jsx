import { createContext } from 'react'

import usePersistTheme from '../hooks/usePersistTheme'

import config from '../config/config'

export const ThemeContext = createContext({
  theme: config.theme.default,
  undefined,
})

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = usePersistTheme('theme', config.theme.default)
  const [sidebarTheme, setSidebarTheme] = usePersistTheme(
    'sidebarTheme',
    config.theme.sidebar.default
  )
  const [topMenuTheme, setTopMenuTheme] = usePersistTheme(
    'topMenuTheme',
    config.theme.header.default
  )

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        sidebarTheme,
        setSidebarTheme,
        topMenuTheme,
        setTopMenuTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
