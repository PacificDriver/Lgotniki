import React, { useContext } from 'react'

import { EmailContext } from '../../../../contexts/email'

import EmailComposeWeb from './EmailComposeWeb'
import EmailComposeApp from './EmailComposeApp'

export default function EmailCompose() {
  const { isMobile } = useContext(EmailContext)

  return <>{isMobile ? <EmailComposeApp /> : <EmailComposeWeb />}</>
}
