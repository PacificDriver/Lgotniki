import React, { useState } from 'react'
import { useChat } from '../../../../hooks/useChat'
import { translate } from '../../../../hooks/translate'
import Avatar from '../../../../components/CustomUI/Avatar'
import Toggle from '../../../../components/BaseUI/Toggle'
import {
  Accordion,
  AccordionItem,
} from '../../../../components/BaseUI/Accordion'
import Image from '../../../../components/CustomUI/Image'
import Button from '../../../../components/BaseUI/Button'

import { FiImage, FiFileText, FiLink } from 'react-icons/fi'
import {
  MdOutlineRemoveCircleOutline,
  MdReportGmailerrorred,
  MdOutlineDeleteOutline,
  MdImportExport,
  MdChevronLeft,
} from 'react-icons/md'

import styles from './UserInfo.module.scss'
import LinkPreview from '../../../../components/CustomUI/LinkPreview'

const media = [
  { src: require('../../../../assets/extras/image-1.jpg') },
  { src: require('../../../../assets/extras/image-2.jpg') },
  { src: require('../../../../assets/extras/image-3.jpg') },
  { src: require('../../../../assets/extras/image-4.jpg') },
  { src: require('../../../../assets/extras/image-5.jpg') },
  { src: require('../../../../assets/extras/image-6.jpg') },
]
export default function UserInfo({ onBack }) {
  const { userInfo, isMobile } = useChat()

  const [tabs, setTabs] = useState([
    { name: translate('CHAT.MEDIA'), icon: <FiImage />, selected: true },
    { name: translate('CHAT.DOCS'), icon: <FiFileText />, selected: false },
    { name: translate('CHAT.LINKS'), icon: <FiLink />, selected: false },
  ])

  const handleSelected = index => {
    tabs?.forEach(tab => (tab.selected = false))
    tabs[index].selected = true

    setTabs([...tabs])
  }

  return (
    <div className={styles['user-info-container']}>
      {onBack && (
        <div
          className={styles['user-info-container__back-icon']}
          onClick={onBack}
        >
          <MdChevronLeft />
          {translate('UI.BACK')}
        </div>
      )}

      <div className="d-flex flex-column align-items-center gap-2">
        <Avatar name={userInfo?.name} src={userInfo?.image} size="xlarge" />

        <div className="d-flex flex-column align-items-center">
          <span className={styles['user-info-container__name']}>
            {userInfo?.name}
          </span>
          <span className={styles['user-info-container__email']}>
            {userInfo?.email}
          </span>
        </div>
      </div>

      <div className="w-100 d-flex flex-column gap-2">
        <div className="d-flex justify-content-between">
          <span className={styles['user-info-container__notifications']}>
            {translate('CHAT.NOTIFICATIONS')}
          </span>

          <Toggle isChecked />
        </div>

        <div className="d-flex justify-content-between">
          <Accordion
            items={[
              { title: translate('CHAT.MEDIA_LINKS_AND_DOCS') },
              { title: translate('CHAT.PRIVACY_AND_SECURITY') },
            ]}
            gap="0"
            borderless
            defaultIndex={0}
            accordionClassName={isMobile && styles['custom-accordion']}
          >
            <AccordionItem className="p-0">
              <div className={styles['file-tabs']}>
                {tabs?.map(({ name, icon, selected }, index) => (
                  <div
                    key={index}
                    className={`${styles['file-tabs__tab']} ${selected && styles['file-tabs__tab--selected']}`}
                    onClick={() => handleSelected(index)}
                  >
                    {icon}
                    {name}
                  </div>
                ))}
              </div>

              {tabs[0].selected && (
                <div className="d-flex flex-wrap gap-1">
                  {media?.map(({ src }, index) => (
                    <Image
                      key={index}
                      src={src}
                      className={styles['custom-media']}
                    />
                  ))}
                </div>
              )}

              {tabs[2].selected && (
                <LinkPreview
                  url="https://www.magazineluiza.com.br/smartphone-motorola-edge-30-neo-256gb-lilas-5g-octa-core-8gb-ram-63-cam-dupla-selfie-32mp/p/235718900/te/me3n/"
                  isCompact
                />
              )}
            </AccordionItem>

            <AccordionItem className="p-0">
              <Button
                appearance="subtle"
                iconBefore={<MdOutlineRemoveCircleOutline />}
                isBlock
                className={styles['custom-buttom']}
              >
                {translate('CHAT.BLOCK')}
              </Button>
              <Button
                appearance="subtle"
                iconBefore={<MdReportGmailerrorred />}
                isBlock
                className={styles['custom-buttom']}
              >
                {translate('CHAT.REPORT')}
              </Button>
              <Button
                appearance="subtle"
                iconBefore={<MdOutlineDeleteOutline />}
                isBlock
                className={styles['custom-buttom']}
              >
                {translate('CHAT.DELETE_CONVERSATION')}
              </Button>
              <Button
                appearance="subtle"
                iconBefore={<MdImportExport />}
                isBlock
                className={styles['custom-buttom']}
              >
                {translate('CHAT.EXPORT_CONVERSATION')}
              </Button>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
