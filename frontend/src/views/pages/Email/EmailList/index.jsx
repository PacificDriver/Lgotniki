import React, { useContext } from 'react'

import { EmailContext } from '../../../../contexts/email'

import EmailListApp from './EmailListApp'
import EmailListWeb from './EmailListWeb'

export default function EmailList() {
  const { isMobile } = useContext(EmailContext)

  return <>{isMobile ? <EmailListApp /> : <EmailListWeb />}</>
}
