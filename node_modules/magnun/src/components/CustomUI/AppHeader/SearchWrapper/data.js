import navigation from '../../../../config/navigation'

const transformNavToData = nav => {
  const pages = []

  const capitalizeFirstLetter = str => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const extractPages = (items, parentLabel = '') => {
    items.forEach(item => {
      if (item.url) {
        pages.push({
          reference: capitalizeFirstLetter(parentLabel),
          name: item.name,
          link: item.url,
        })
      }
      if (item.items) {
        extractPages(item.items, item.name)
      }
    })
  }

  nav.forEach(category => {
    extractPages(category.items, category.category)
  })

  return { pages, files: [] }
}

const data = transformNavToData(navigation)

export default data
