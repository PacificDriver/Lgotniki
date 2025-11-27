import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { MdInsertLink } from 'react-icons/md'
import { FiExternalLink } from 'react-icons/fi'

import styles from './LinkPreview.module.scss'

const LinkPreview = ({ url, isCompact }) => {
  const [data, setData] = useState({
    title: '',
    domain: '',
    description: '',
    image: '',
    processed: false,
  })

  const handleOpenLink = () => {
    window.open(url, '_blank')
  }

  const apiKey = process.env.REACT_APP_LINK_PREVIEW_API_KEY

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const response = await axios.get('https://api.linkpreview.net/', {
          params: {
            q: url,
          },
          headers: {
            'X-Linkpreview-Api-Key': apiKey,
          },
        })

        const { title, description, image } = response.data
        const domain = new URL(url).hostname

        setData({
          title,
          domain,
          description,
          image,
          processed: true,
        })
      } catch (error) {
        console.error('Erro ao buscar dados do link:', error)
      }
    }

    if (!isCompact) fetchLinkData()
  }, [url, isCompact, apiKey])

  if (isCompact) {
    return (
      <div
        className={styles['link-compact']}
        onClick={handleOpenLink}
        data-url={url}
      >
        <div className={styles['link-compact__icon']}>
          <FiExternalLink />
        </div>
        <div className={styles['link-compact__link']}>{url}</div>
      </div>
    )
  }

  return data?.processed ? (
    <div className={styles['link-preview']}>
      {data?.image ? (
        <div
          className={styles['image-container']}
          style={{ backgroundImage: `url(${data.image})` }}
        ></div>
      ) : (
        <div className={styles['icon-container']}>
          <MdInsertLink />
        </div>
      )}

      <div className={styles['content']} onClick={handleOpenLink}>
        <div className={styles['domain']}>{data.domain}</div>
        <div className={styles['title']}>{data.title}</div>
      </div>
    </div>
  ) : (
    <></>
  )
}

export default LinkPreview
