import React, { useContext } from 'react'

import { EmailContext } from '../../../../contexts/email'

import EmailReadWeb from './EmailReadWeb'
import EmailReadApp from './EmailReadApp'

export default function EmailRead() {
  const { isMobile } = useContext(EmailContext)

  return <div>{isMobile ? <EmailReadApp /> : <EmailReadWeb />}</div>
}
