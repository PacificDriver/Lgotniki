import React from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../../../components/BaseUI/Button'
import { useTitle } from '../../../hooks/useTitle'
import { translate } from '../../../hooks/translate'

export default function Page404() {
  useTitle('404 Error Page | Magnun - React Admin Template')

  const navigate = useNavigate()

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center w-100"
      style={{
        height: '100vh',
      }}
    >
      <h1
        style={{
          fontSize: '100px',
          marginBottom: '50px',
        }}
      >
        404
      </h1>

      <p
        style={{
          fontSize: '16px',
          fontWeight: '300',
          textTransform: 'uppercase',
        }}
      >
        {translate('ERROR.404_MESSAGE')}
      </p>

      <div className="mt-5">
        <Button
          title={translate('AUTHENTICATION.BACK_TO_HOME')}
          appearance="primary"
          onClick={() => navigate('/dashboard')}
        />
      </div>
    </div>
  )
}
