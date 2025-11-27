import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { EmailContext } from '../../../../../contexts/email'
import { translate } from '../../../../../hooks/translate'
import { useFormattedDate } from '../../../../../hooks/useFormattedDate'
import { formatFileSize, getFileSize } from '../../../../../utils/utils'

import Button from '../../../../../components/BaseUI/Button'
import IconButton from '../../../../../components/BaseUI/Button/IconButton'
import {
  Dropdown,
  DropdownContent,
} from '../../../../../components/BaseUI/Dropdown'
import Avatar from '../../../../../components/CustomUI/Avatar'
import DropdownMenu from '../../../../../components/CustomUI/DropdownMenu'
import RenderHTML from '../../../../../components/CustomUI/RenderHTML'

import { FaRegStar, FaStar } from 'react-icons/fa'
import {
  MdChevronLeft,
  MdOutlineFileDownload,
  MdOutlinePrint,
  MdOutlineShortcut,
} from 'react-icons/md'

import styles from './EmailReadApp.module.scss'

const actionOptions = [
  { name: translate('EMAIL.PRINT_OUT'), redirect: false },
  { name: translate('EMAIL.DELETE_MESSAGE'), redirect: false },
  { name: translate('EMAIL.REPORT_SPAM'), redirect: false },
  { name: translate('EMAIL.REPORT_PHISHING'), redirect: false },
  { name: translate('EMAIL.SHOW_ORIGINAL'), redirect: false },
]

export default function EmailReadApp() {
  const { showEmailList, currentEmail, toggleStarredEmail } =
    useContext(EmailContext)
  const [attachmentSizes, setAttachmentSizes] = useState({})
  const [totalSizes, setTotalSizes] = useState('')

  const navigate = useNavigate()
  const formatDate = useFormattedDate

  const fetchAttachmentSizes = async () => {
    const sizes = {}
    let total = 0

    if (currentEmail?.attachments) {
      await Promise.all(
        currentEmail.attachments.map(async attachment => {
          const result = await getFileSize(attachment?.url)
          sizes[attachment?.url] = result?.formattedSize
          total += result?.sizeInBytes
        })
      )
    }

    setTotalSizes(formatFileSize(total))
    setAttachmentSizes(sizes)
  }

  useEffect(() => {
    fetchAttachmentSizes()
  }, [currentEmail])

  return (
    <div className={styles['email-read-app-container']}>
      <div className={styles['email-read-app-container__header']}>
        <IconButton
          icon={<MdChevronLeft />}
          appearance="subtle"
          shape="circle"
          className={styles['header--icon']}
          onClick={() => {
            showEmailList()
            navigate(-1)
          }}
        />

        <div className="d-flex justify-content-between align-items-center w-100">
          <div className={styles['email-read-app-container__header__subject']}>
            {currentEmail?.subject}
          </div>

          <IconButton
            icon={
              currentEmail?.status?.starred ? (
                <FaStar
                  className={
                    styles['email-read-app-container__header--starred-icon']
                  }
                />
              ) : (
                <FaRegStar
                  className={
                    styles['email-read-app-container__header--star-icon']
                  }
                />
              )
            }
            appearance="subtle"
            shape="circle"
            onClick={event => toggleStarredEmail(event, currentEmail?.id)}
          />
        </div>
      </div>

      <div className={styles['email-read-app-container__content']}>
        <div className={styles['email-detail']}>
          <div className="d-flex gap-1 justify-content-between">
            <div className="d-flex gap-1">
              <Avatar
                name={currentEmail?.sender?.name}
                src={currentEmail?.sender?.image}
              />

              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-1">
                  <span className={styles['email-detail--name']}>
                    {currentEmail?.sender?.name}
                  </span>
                </div>

                <div className={styles['email-detail__recipient-email']}>
                  <Dropdown
                    trigger={translate('FRAGMENTS.FOR_ME')}
                    placement="top-start"
                    triggerClassName={
                      styles['email-detail__recipient-email--label']
                    }
                  >
                    <DropdownContent className={styles['custom__content']}>
                      <div
                        className={
                          styles['email-detail__recipient-email__info']
                        }
                      >
                        <div className="d-flex gap-1">
                          <strong>{translate('FRAGMENTS.FROM')}: </strong>{' '}
                          {currentEmail?.sender?.email}
                        </div>
                        <div className="d-flex gap-1">
                          <strong>{translate('EMAIL.TO')}: </strong>{' '}
                          {currentEmail?.recipient?.email}
                        </div>
                        <div className="d-flex gap-1">
                          <strong>{translate('UI.DATE')}: </strong>{' '}
                          {formatDate(
                            currentEmail?.date,
                            'DD [de] MMMM [de] YYYY, HH:mm'
                          )}
                        </div>
                      </div>
                    </DropdownContent>
                  </Dropdown>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center">
              <IconButton
                icon={<MdOutlinePrint />}
                appearance="subtle"
                shape="circle"
              />

              <DropdownMenu options={actionOptions} />
            </div>
          </div>

          <div className="my-4">
            <RenderHTML style={{ lineHeight: '24px' }}>
              {currentEmail?.message}
            </RenderHTML>
          </div>

          {currentEmail?.attachments?.length > 0 && (
            <div className={styles['email-detail__attachment']}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className={styles['email-detail__attachment--label']}>
                    {currentEmail?.attachments?.length} arquivos anexados
                  </span>
                  <span className={styles['email-detail__attachment--total']}>
                    {' '}
                    ({totalSizes})
                  </span>
                </div>

                <div>
                  <IconButton
                    icon={<MdOutlineFileDownload />}
                    appearance="subtle"
                    shape="circle"
                    tooltip="Baixar todos"
                    tooltipPosition="left"
                  />
                </div>
              </div>

              {currentEmail?.attachments?.map((attachment, index) => (
                <div
                  key={index}
                  className={styles['email-detail__attachment--info']}
                >
                  <span>
                    {attachment?.name}.{attachment.type.split('/')[1]}
                  </span>
                  <span>
                    {attachmentSizes[attachment?.url] || 'Loading...'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles['email-read-app-container__buttons']}>
        <Button
          iconBefore={
            <MdOutlineShortcut
              className={
                styles['email-read-app-container__buttons--button--icon']
              }
            />
          }
          isBlock
        >
          {translate('EMAIL.TO_RESPOND')}
        </Button>
        <Button iconBefore={<MdOutlineShortcut />} isBlock>
          {translate('EMAIL.TO_FORWARD')}
        </Button>
      </div>
    </div>
  )
}
