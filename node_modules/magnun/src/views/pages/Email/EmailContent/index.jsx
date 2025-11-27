import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'

import { EmailContext } from '../../../../contexts/email'

import EmailSidebar from '../EmailSidebar'
import EmailCompose from '../EmailCompose'

import styles from './EmailContent.module.scss'

export default function EmailContent() {
  const { showEmailDetails, createEmail, isMobile } = useContext(EmailContext)

  return (
    <>
      <div
        className={`${styles['email-content-container']} ${showEmailDetails && styles['email-content-container--read']} ${isMobile && styles['email-content-container--mobile']}`}
      >
        {!isMobile && (
          <div>
            <EmailSidebar />
          </div>
        )}
        <div>
          <Outlet />
        </div>
      </div>

      {createEmail && (
        <div>
          <EmailCompose />
        </div>
      )}
    </>
  )
}
