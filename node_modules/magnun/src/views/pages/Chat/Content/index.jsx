import React from 'react'

import { useChat } from '../../../../hooks/useChat'
import Mobile from './Mobile'
import Web from './Web'

export default function Content() {
  const { isMobile } = useChat()

  return <>{isMobile ? <Mobile /> : <Web />}</>
}
