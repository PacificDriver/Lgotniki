import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import Breadcrumbs from '../../../components/BaseUI/Breadcrumbs'

import {
  FiFile,
  FiClipboard,
  FiSettings,
  FiServer,
  FiTool,
  FiHelpCircle,
  FiRefreshCw,
  FiChevronRight,
  FiSearch,
} from 'react-icons/fi'

import styles from './Support.module.scss'

const links = [
  {
    name: 'Getting Started',
    url: '/support/getting-started',
    icon: <FiFile />,
    description:
      'Explore os primeiros passos para começar a usar o sistema com instruções detalhadas.',
  },
  {
    name: 'Product Specifications',
    url: '/support/product-specifications',
    icon: <FiClipboard />,
    description:
      'Consulte as especificações completas do produto, incluindo recursos e capacidades técnicas.',
  },
  {
    name: 'Installation and Configuration Instructions',
    url: '/support/installation-and-configuration-instructions',
    icon: <FiSettings />,
    description:
      'Siga o guia passo a passo para instalar e configurar corretamente o sistema.',
  },
  {
    name: 'Server Requirements',
    url: '/support/server-requirements',
    icon: <FiServer />,
    description:
      'Verifique os requisitos mínimos e recomendados para o servidor e infraestrutura.',
  },
  {
    name: 'Troubleshooting Tips',
    url: '/support/troubleshooting-tips',
    icon: <FiTool />,
    description:
      'Dicas práticas e comuns para identificar e resolver possíveis problemas no sistema.',
  },
  {
    name: 'FAQs',
    url: '/support/faqs',
    icon: <FiHelpCircle />,
    description:
      'Encontre respostas rápidas para as dúvidas mais frequentes sobre o funcionamento do sistema.',
  },
  {
    name: 'Regular Updates',
    url: '/support/regular-updates',
    icon: <FiRefreshCw />,
    description:
      'Fique por dentro das atualizações mais recentes e melhorias contínuas do sistema.',
  },
]

const Support = () => {
  const [route, setRoute] = useState('')
  const [searchQuery, setSearchQuery] = useState('') // Estado para controlar a pesquisa
  const [filteredLinks, setFilteredLinks] = useState(links) // Links filtrados

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const currentRoute = location.pathname.split('/support/')[1]
    if (currentRoute) {
      const routeName = links.find(link =>
        link.url.includes(currentRoute)
      )?.name
      setRoute(routeName || '')
    } else {
      setRoute('')
    }
  }, [location.pathname])

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase()
    const filtered = links.filter(
      link =>
        link.name.toLowerCase().includes(lowercasedQuery) ||
        link.description.toLowerCase().includes(lowercasedQuery)
    )
    setFilteredLinks(filtered)
  }, [searchQuery])

  const handleCardClick = url => {
    navigate(url)
    setSearchQuery('')
  }

  const isMainRoute = ['/support/', '/support'].includes(location.pathname)

  return (
    <div className={styles['support']}>
      <div className={styles['support__logo']}>
        <img
          src={require('../../../assets/logos/logo-1.png')}
          alt="Hostinger Logo"
          className={styles['logo']}
        />
      </div>

      <div
        className={styles['support__login']}
        onClick={() => navigate('/login')}
      >
        Log in
      </div>

      <div className={styles['header']}>
        <h1>How can we help?</h1>

        <div className={styles['search']}>
          <input
            type="text"
            placeholder="Search for articles..."
            className={styles['search__input']}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <FiSearch />
        </div>
      </div>

      {isMainRoute ? (
        <Container className="px-5 mt-5">
          {filteredLinks.map(({ name, url, icon, description }, index) => (
            <ContainerItem
              key={index}
              sm={4}
              md={4}
              xl={3}
              className={`card-content ${styles['support__card']}`}
              onClick={() => handleCardClick(url)}
            >
              <span>{icon}</span>
              <h4>{name}</h4>
              <p>{description}</p>
            </ContainerItem>
          ))}
        </Container>
      ) : (
        <div className={styles['support__body']}>
          <Breadcrumbs
            options={[{ label: 'Suporte', url: '/support' }, { label: route }]}
            separator={<FiChevronRight />}
          />
          <div className="py-3"></div>
          <Outlet />
        </div>
      )}
    </div>
  )
}

export default Support
