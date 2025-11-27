export const useLocalStorage = () => {
  const getStorage = key => {
    const saved = localStorage.getItem(key)

    if (!saved) return null

    try {
      return JSON.parse(saved)
    } catch (error) {
      // Значит значение было сохранено без JSON.stringify (например, старый токен)
      // Возвращаем строку как есть, чтобы можно было удалить/перезаписать
      return saved
    }
  }

  const persistStorage = (key, value) => {
    if (typeof value === 'string') {
      localStorage.setItem(key, value)
      return
    }

    localStorage.setItem(key, JSON.stringify(value))
  }

  const clearStorage = key => localStorage.removeItem(key)

  return {
    getStorage,
    persistStorage,
    clearStorage,
  }
}
