import { useEffect } from 'react'

const useCSSVariables = variables => {
  useEffect(() => {
    const root = document.documentElement

    Object.keys(variables).forEach(key => {
      root.style.setProperty(`--${key}`, variables[key])
    })

    return () => {
      Object.keys(variables).forEach(key => {
        root.style.removeProperty(`--${key}`)
      })
    }
  }, [variables])
}

export default useCSSVariables
