import React, { useContext, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { EmailContext } from '../../../../../contexts/email'
import { translate } from '../../../../../hooks/translate'

import Avatar from '../../../../../components/CustomUI/Avatar'

import { FaRegStar, FaStar } from 'react-icons/fa'
import { MdAttachment, MdAdd } from 'react-icons/md'

import styles from './EmailListApp.module.scss'

const EmailTabs = () => {
  const { actions, screenSize, setCurrentSidebar, showEmailList } =
    useContext(EmailContext)
  const [tabs, setTabs] = useState(actions)

  const setActiveTab = index => {
    const values = tabs
    values?.forEach(tab => (tab.active = false))
    values[index].active = true

    setCurrentSidebar(values[index].type)
    showEmailList()
    setTabs([...values])
  }

  return (
    <div
      className={styles['email-list-app-container__email-tabs']}
      style={{ width: `${screenSize}px` }}
    >
      <div className={styles['tabs']}>
        {tabs.map(({ name: tab, active }, index) => (
          <div
            key={index}
            className={`${styles['tabs__tab']} ${active && styles['tabs__tab--active']}`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function EmailListApp() {
  const navigate = useNavigate()

  const {
    emails,
    screenSize,
    handleEmailClick,
    formatDate,
    toggleStarredEmail,
    setCreateEmail,
  } = useContext(EmailContext)

  const emailsFiltered = useMemo(() => {
    return emails
  }, [emails])

  const getSenderName = name => {
    return name?.length > 17 ? name?.slice(0, 17) + '.' : name
  }

  return (
    <div className={styles['email-list-app-container']}>
      <div className={styles['email-list-app-container__header']}>
        <span className={styles['email-list-app-container__header--title']}>
          Email
        </span>
      </div>

      <EmailTabs />

      <div className={styles['email-list-app-container__content']}>
        <div className={styles['email-list']}>
          {emailsFiltered?.map((email, index) => (
            <div
              key={index}
              className={styles['email-list__items']}
              onClick={() => {
                handleEmailClick(email?.id)
                navigate(`/dashboard/emails/${email?.uuid}`)
              }}
            >
              <Avatar
                src={email.sender?.image}
                name={email?.sender?.name}
                appearance="square"
                size="large"
              />

              <div className={styles['infos']}>
                <div className={styles['infos__sender']}>
                  <div
                    className={`${styles['infos__sender--name']} ${!email?.status?.read && styles['infos__sender--name--read']}`}
                  >
                    {getSenderName(email.sender?.name)}
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    {email?.attachments?.length > 0 && (
                      <span className={styles['infos__sender--attachment']}>
                        <MdAttachment />
                      </span>
                    )}

                    <span className={styles['infos__sender--date']}>
                      {formatDate(email.date)}
                    </span>
                  </div>
                </div>

                <div
                  className={`${styles['infos__subject']} ${!email?.status?.read && styles['infos__subject--read']}`}
                >
                  {email.subject}
                </div>

                <div
                  className={styles['infos__message']}
                  style={{ width: `${screenSize - 80}px` }}
                >
                  <div className={styles['infos__message--content']}>
                    {email?.message}
                  </div>
                  <span
                    className={styles['infos__message--star-icon']}
                    onClick={event => toggleStarredEmail(event, email?.id)}
                  >
                    {email?.status.starred ? (
                      <FaStar
                        className={styles['infos__subject__icons--starred']}
                      />
                    ) : (
                      <FaRegStar />
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {!emailsFiltered?.length && (
            <div className={styles['email-list__no-data']}>
              <span className={styles['email-list__no-data--message']}>
                {translate('EMAIL.NO_DATA')}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={styles['email-list-app-container__add']}>
        <MdAdd onClick={() => setCreateEmail(true)} />
      </div>
    </div>
  )
}
