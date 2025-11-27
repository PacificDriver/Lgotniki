import React from 'react'
import moment from 'moment/moment'
import { translate } from '../../../../hooks/translate'

import CardContainer from '../../../../components/CustomUI/CardContainer'
import Tooltip from '../../../../components/BaseUI/Tooltip'
import ActionButton from '../../../../components/CustomUI/ActionButton'
import DropdownMenu from '../../../../components/CustomUI/DropdownMenu'
import { MediaPreview } from '../../../../components/CustomUI/MediaView'

import { MdArrowBack } from 'react-icons/md'
import { MdShortcut } from 'react-icons/md'
import { MdOutlineLocalPrintshop } from 'react-icons/md'
import { MdStar } from 'react-icons/md'
import { MdOutlineStarOutline } from 'react-icons/md'
import { MdFileDownload } from 'react-icons/md'

import styles from './ReadEmail.module.scss'

export default function ReadEmail({ info, onBack }) {
  const actionOptions = [
    { name: translate('EMAIL.TO_RESPOND'), redirect: false },
    { name: translate('EMAIL.TO_FORWARD'), redirect: false },
    { name: translate('EMAIL.PRINT_OUT'), redirect: false },
    { name: translate('EMAIL.DELETE_MESSAGE'), redirect: false },
    { name: translate('EMAIL.REPORT_SPAM'), redirect: false },
    { name: translate('EMAIL.REPORT_PHISHING'), redirect: false },
    { name: translate('EMAIL.SHOW_ORIGINAL'), redirect: false },
  ]

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

  return (
    <div className={styles['read-email-container']}>
      <CardContainer className={styles['email__details']}>
        <div className={styles['actions__detail']}>
          <div className="d-flex align-items-center gap-1">
            <div className="d-flex align-items-center u-pointer">
              <ActionButton onClick={onBack}>
                <MdArrowBack />
              </ActionButton>
            </div>

            <div className={styles['subject__detail']}>{info?.subject}</div>
          </div>

          <ActionButton>
            <MdOutlineLocalPrintshop />
          </ActionButton>
        </div>

        <div className={styles['sender__detail']}>
          <div className={styles['sender__info']}>
            <div className={styles['sender__info__email']}>
              <span className={styles['sender__name']}>
                {info?.sender.name}
              </span>
              <span className={styles['sender__email']}>
                {info?.sender.email}
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <div className={styles['sender__date']}>
              {formatDate(info?.date)}
            </div>

            <ActionButton>
              {info?.starred ? (
                <MdStar style={{ color: '#f7ca4c' }} />
              ) : (
                <MdOutlineStarOutline />
              )}
            </ActionButton>

            <ActionButton className="u-revert">
              <MdShortcut />
            </ActionButton>

            <DropdownMenu direction="right" options={actionOptions} />
          </div>
        </div>

        <div
          className={styles['message__detail']}
          dangerouslySetInnerHTML={{ __html: info?.message }}
        ></div>

        <div className={styles['horizontal__separator']}></div>

        {info?.attachments?.length > 0 && (
          <>
            <div className="d-flex align-items-center justify-content-between w-100 mb-3">
              <span className="weight-600">
                {info?.attachments?.length}{' '}
                {info?.attachments?.length > 1
                  ? translate('EMAIL.ATTACHMENTS')
                  : translate('EMAIL.ATTACHMENT')}
              </span>

              <span className="d-flex u-pointer">
                <Tooltip
                  position="left"
                  content={translate('EMAIL.DOWNLOAD_ALL_ATTACHMENTS')}
                >
                  <MdFileDownload style={{ fontSize: '22px' }} />
                </Tooltip>
              </span>
            </div>

            <div className={styles['message__attachments']}>
              {info?.attachments?.map((attachment, index) => (
                <div key={index} className={`styles['attachment__list']`}>
                  <MediaPreview
                    file={attachment}
                    displayFooter={true}
                    hideDropdown={true}
                    cover={true}
                    style={{
                      width: '178px',
                      height: '118px',
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <div className={styles['buttons__detail']}>
          <div className={styles['action__button']}>
            <div className="u-revert">
              <MdShortcut />
            </div>
            <div>{translate('EMAIL.TO_RESPOND')}</div>
          </div>

          <div className={styles['action__button']}>
            <div>
              <MdShortcut />
            </div>
            <div>{translate('EMAIL.TO_FORWARD')}</div>
          </div>
        </div>
      </CardContainer>
    </div>
  )
}
