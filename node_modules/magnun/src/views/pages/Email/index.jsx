import React, { useState, useEffect } from 'react'

import { EmailProvider } from '../../../contexts/email'
import { translate } from '../../../hooks/translate'

import { getAllEmails } from '../../../services/emails'

import AppPage from '../../../components/CustomUI/AppPage'
import EmailContent from './EmailContent'

import {
  FiInbox,
  FiStar,
  FiClock,
  FiSend,
  FiEdit2,
  FiBookmark,
  FiAlertOctagon,
  FiTrash2,
} from 'react-icons/fi'

import styles from './Email.module.scss'

export default function Email() {
  const initialActions = [
    {
      name: translate('EMAIL.INBOX'),
      type: 'inbox',
      icon: <FiInbox />,
      quantity: 0,
      active: true,
    },
    {
      name: translate('Starred'),
      type: 'starred',
      icon: <FiStar />,
      quantity: 0,
      active: false,
    },
    {
      name: translate('EMAIL.POSTPONED'),
      type: 'postponed',
      icon: <FiClock />,
      quantity: 0,
      active: false,
    },
    {
      name: translate('EMAIL.SENT'),
      type: 'send',
      icon: <FiSend />,
      quantity: 0,
      active: false,
    },
    {
      name: translate('EMAIL.DRAFTS'),
      type: 'draft',
      icon: <FiEdit2 />,
      quantity: 0,
      active: false,
    },
    {
      name: translate('Important'),
      type: 'important',
      icon: <FiBookmark />,
      quantity: 0,
      active: false,
    },
    {
      name: translate('EMAIL.SPAM'),
      type: 'spam',
      icon: <FiAlertOctagon />,
      quantity: 0,
      active: false,
    },
    {
      name: translate('EMAIL.BIN'),
      type: 'trash',
      icon: <FiTrash2 />,
      quantity: 0,
      active: false,
    },
  ]

  const [emails, setEmails] = useState([])

  useEffect(() => {
    const loadEmails = async () => {
      const emails = await getAllEmails()

      setEmails(emails)
    }

    loadEmails()
  }, [])

  return (
    <AppPage className={styles['email-container']}>
      <EmailProvider data={emails} emailActions={initialActions}>
        <EmailContent />
      </EmailProvider>
    </AppPage>
  )
}
