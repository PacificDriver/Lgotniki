import React, { useState } from 'react'

import { translate } from '../../../../hooks/translate'
import { useFormattedDate as formatDate } from '../../../../hooks/useFormattedDate'

import Button from '../../../../components/BaseUI/Button'
import IconButton from '../../../../components/BaseUI/Button/IconButton'
import Input from '../../../../components/BaseUI/Input'
import { Table, Td, Tr } from '../../../../components/BaseUI/Table'
import Toggle from '../../../../components/BaseUI/Toggle'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'

import { activities, headers } from './data'

import { FiTrash2 } from 'react-icons/fi'

export default function Security() {
  const [twoStepVerification, setTwoStepVerification] = useState(false)
  const [twoFactorAuthentication, setTwoFactorAuthentication] = useState(false)

  return (
    <div className="px-3">
      <h1 className="title-page">Security</h1>
      <p className="sub-title-page mb-5">Manage your security settings.</p>

      <div className="card">
        <h4 className="mb-1 weight-500">
          {translate('ACCOUNT_SETTINGS.CHANGE_PASSWORD')}
        </h4>
        <p className="sub-title-page">
          Set a strong password to ensure the protection of your account.
        </p>

        <Container className="mt-4">
          <ContainerItem sm={4} md={3} xl={5}>
            <Input
              label={translate('ACCOUNT_SETTINGS.CURRENT_PASSWORD')}
              placeholder={translate('ACCOUNT_SETTINGS.ENTER_CURRENT_PASSWORD')}
              type="password"
              required
            />
          </ContainerItem>

          <ContainerItem sm={4} md={3} xl={5}>
            <Input
              label={translate('ACCOUNT_SETTINGS.NEW_PASSWORD')}
              placeholder={translate('ACCOUNT_SETTINGS.ENTER_NEW_PASSWORD')}
              required
              type="password"
            />
          </ContainerItem>

          <ContainerItem
            sm={4}
            md={2}
            xl={2}
            className="d-flex align-items-center mt-2"
          >
            <Button appearance="primary" isBlock>
              Change
            </Button>
          </ContainerItem>
        </Container>
      </div>

      <div className="card mt-4">
        <h4 className="mb-1 weight-500">{translate('Authentication')}</h4>
        <p className="sub-title-page">
          To increase the security of your account, we recommend that, in
          addition to your password, you request an additional verification
          code. This can be done through methods such as two-step verification
          or two-factor authentication (2FA), ensuring an extra layer of
          protection against unauthorized access.
        </p>

        <Container className="mt-4">
          <ContainerItem
            sm={4}
            md={8}
            xl={12}
            className="d-flex align-items-center justify-content-between mt-2"
          >
            <div className="d-flex align-items-center">
              <Toggle onChecked={value => setTwoStepVerification(value)} />
              <span className="ml-2">
                {translate('ACCOUNT_SETTINGS.TWO_STEP_VERIFICATION')}
              </span>
            </div>

            {twoStepVerification && (
              <Button appearance="subtle-link">Configure</Button>
            )}
          </ContainerItem>

          <ContainerItem
            sm={4}
            md={8}
            xl={12}
            className="d-flex align-items-center justify-content-between mt-2"
          >
            <div className="d-flex align-items-center">
              <Toggle onChecked={value => setTwoFactorAuthentication(value)} />
              <span className="ml-2">
                {translate('Two-factor Authentication (2FA)')}
              </span>
            </div>

            {twoFactorAuthentication && (
              <Button appearance="subtle-link">Configure</Button>
            )}
          </ContainerItem>
        </Container>
      </div>

      <div className="card mt-4">
        <h4 className="mb-1 weight-500">{translate('Browsers and devices')}</h4>
        <p className="sub-title-page">
          The following browsers and devices are currently signed in to your
          account. Remove any unauthorized devices.
        </p>

        <Container className="mt-4">
          <ContainerItem sm={4} md={8} xl={12}>
            <Table
              columns={headers}
              tableId="browsers-and-devices"
              disableColumnMenu
              disableExport
              hideFooter
              disableColumnFilter
              disableColumnResize
              disableSearchFilter
            >
              {activities?.map((activity, index) => (
                <Tr key={index} id={index}>
                  <Td>
                    <img
                      src={activity?.image}
                      alt={activity?.browser}
                      width={20}
                    />
                    {activity?.browser}
                  </Td>
                  <Td>{activity?.device}</Td>
                  <Td>{activity?.location}</Td>
                  <Td className="d-dlex justify-content-between w-100">
                    {formatDate(
                      activity?.recentActivity,
                      'DD/MM/YYYY [at] HH:mm'
                    )}

                    <IconButton
                      icon={
                        <FiTrash2
                          style={{ color: '#66718F', fontSize: '18px' }}
                        />
                      }
                      appearance="subtle"
                      shape="circle"
                    />
                  </Td>
                </Tr>
              ))}
            </Table>
          </ContainerItem>
        </Container>
      </div>
    </div>
  )
}
