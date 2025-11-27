import moment from 'moment/moment'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MediaPreview } from 'react-view-files'

import { EmailContext } from '../../../../../contexts/email'
import { translate } from '../../../../../hooks/translate'

import IconButton from '../../../../../components/BaseUI/Button/IconButton'
import Pagination from '../../../../../components/BaseUI/Pagination'
import Avatar from '../../../../../components/CustomUI/Avatar'
import RenderHTML from '../../../../../components/CustomUI/RenderHTML'

import {
  MdAccessTime,
  MdBookmarkBorder,
  MdDeleteOutline,
  MdOutlineArchive,
  MdOutlineArrowBack,
  MdOutlineLocalPrintshop,
  MdOutlineReport,
  MdOutlineShortcut,
  MdOutlineStar,
  MdOutlineStarBorder,
} from 'react-icons/md'

import styles from './EmailReadWeb.module.scss'

export default function EmailReadWeb() {
  const { emails, showEmailList, currentEmail, toggleStarredEmail } =
    useContext(EmailContext)
  const [emailDetails, setEmailDetails] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  const navigate = useNavigate()

  useEffect(() => {
    setEmailDetails(currentEmail)

    const page = emails?.findIndex(email => email?.id === currentEmail?.id)

    setCurrentPage(page + 1)
  }, [currentEmail])

  const formatDate = value => {
    const date = moment(value)

    const now = moment()

    const difference = now.diff(date, 'days')

    if (difference === 0) {
      const differenceBetweenHours = now.diff(date, 'hours')
      const differenceBetweenMinutes = now.diff(date, 'minutes')

      let message = ''

      if (differenceBetweenHours >= 1)
        message = `(há ${differenceBetweenHours} ${
          differenceBetweenHours > 1
            ? translate('EMAIL.HOURS')
            : translate('EMAIL.HOUR')
        })`
      else
        message = `(${translate(
          'EMAIL.THERE_IS'
        )} ${differenceBetweenMinutes} ${
          differenceBetweenMinutes > 1
            ? translate('EMAIL.MINUTES')
            : translate('EMAIL.MINUTE')
        })`

      return `${date.format('HH:mm')} ${message}`
    }

    return `${date.format('ddd, DD MMM')} ${translate(
      'EMAIL.OF'
    )} ${date.format('YYYY')}, ${date.format('HH:mm')}`
  }

  const handlePageChange = pagination => {
    const email = emails[currentPage - 1]

    setEmailDetails(email)
    setCurrentPage(pagination.currentPage)
  }

  return (
    <div className={styles['email-read-container']}>
      {/* {!isMobile && <EmailList />} */}

      <div className={styles['email-read-container__content']}>
        <div className={styles['header']}>
          <div className="d-flex align-items-center gap-2">
            <IconButton
              icon={<MdOutlineArrowBack />}
              appearance="subtle"
              shape="circle"
              className={styles['header--icon']}
              onClick={() => {
                showEmailList()
                navigate(-1)
              }}
            />

            <div className={styles['header__actions']}>
              <IconButton
                icon={<MdOutlineArchive />}
                appearance="subtle"
                shape="circle"
                tooltip={translate('EMAIL.TO_FILE')}
                tooltipPosition="top"
                className={styles['header--icon']}
              />
              <IconButton
                icon={<MdOutlineReport />}
                appearance="subtle"
                shape="circle"
                tooltip={translate('EMAIL.REPORT_SPAM')}
                tooltipPosition="top"
                className={styles['header--icon']}
              />
              <IconButton
                icon={<MdDeleteOutline />}
                appearance="subtle"
                shape="circle"
                tooltip={translate('UI.DELETE')}
                tooltipPosition="top"
                className={styles['header--icon']}
              />
              <IconButton
                icon={<MdAccessTime />}
                appearance="subtle"
                shape="circle"
                tooltip={translate('EMAIL.SUSPEND')}
                tooltipPosition="top"
                className={styles['header--icon']}
              />
              <IconButton
                icon={<MdBookmarkBorder />}
                appearance="subtle"
                shape="circle"
                tooltip={translate('Important')}
                tooltipPosition="top"
                className={styles['header--icon']}
              />
            </div>
          </div>

          <div>
            <Pagination
              options={{
                skipPrevious: false,
                skipNext: false,
                selectQuantity: false,
                simpleCounting: true,
              }}
              totalPerPage={1}
              totalItems={emails?.length}
              onPageChange={({ pagination }) => handlePageChange(pagination)}
              currentPage={currentPage}
            />
          </div>
        </div>

        <div className={styles['content']}>
          <div className="d-flex align-items-start justify-content-between mb-2">
            <div className={styles['content__user']}>
              <Avatar
                name={emailDetails?.sender?.name}
                src={emailDetails?.sender?.image}
              />

              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-1">
                  <span className={styles['content__user--name']}>
                    {emailDetails?.sender?.name}
                  </span>
                  <span className={styles['content__user--email']}>
                    {emailDetails?.sender?.email}
                  </span>
                </div>

                <span className={styles['content__user--recipient-email']}>
                  to olivia_vera_jesus@hot.com.br
                </span>
              </div>
            </div>

            <div className={styles['content__date']}>
              {formatDate(emailDetails?.date)}
            </div>
          </div>

          <div className={styles['content__subject']}>
            <div>{emailDetails?.subject}</div>

            <div className="d-flex align-items-center">
              <IconButton
                icon={
                  emailDetails?.status?.starred ? (
                    <MdOutlineStar
                      className={styles['content__subject--icon--starred']}
                    />
                  ) : (
                    <MdOutlineStarBorder />
                  )
                }
                appearance="subtle"
                shape="circle"
                className={styles['content__subject--icon']}
                onClick={event => toggleStarredEmail(event, emailDetails?.id)}
              />

              <IconButton
                icon={<MdOutlineLocalPrintshop />}
                appearance="subtle"
                shape="circle"
                className={styles['content__subject--icon']}
              />
            </div>
          </div>

          <div className={styles['content__message']}>
            <RenderHTML>{emailDetails?.message}</RenderHTML>
          </div>

          {emailDetails?.attachments?.length > 0 && (
            <>
              <div className={styles['content__horizontal-line']}></div>
              <div>
                <div className={styles['content__attachments']}>
                  <span className={styles['content__attachments--quantity']}>
                    {emailDetails?.attachments?.length}{' '}
                    {emailDetails?.attachments?.length > 1
                      ? translate('EMAIL.ATTACHMENTS')
                      : translate('EMAIL.ATTACHMENT')}
                  </span>

                  <span className={styles['content__attachments--action']}>
                    Download all
                  </span>
                </div>

                <div className="d-flex align-items-center gap-1">
                  {emailDetails?.attachments?.map((attachment, index) => (
                    <div key={index} className="d-flex">
                      <MediaPreview
                        file={attachment}
                        displayFooter={true}
                        hideDropdown={true}
                        cover={true}
                        style={{
                          width: '150px',
                          height: '100px',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className={styles['content__horizontal-line']}></div>

          <div className={styles['content__buttons']}>
            <button className={styles['content__buttons--button']}>
              <MdOutlineShortcut
                className={styles['content__buttons--button--icon']}
              />
              Reply
            </button>

            <button className={styles['content__buttons--button']}>
              <MdOutlineShortcut />
              Forward
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
