import React from 'react'

import { translate } from '../../../../hooks/translate'

import Button from '../../../../components/BaseUI/Button'
import Select from '../../../../components/BaseUI/Select'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'

export default function Preferences() {
  const timezones = [
    {
      label: '(UTC -03:00) Brasília',
      value: '-03:00',
    },
    {
      label: '(UTC -04:00) La Paz',
      value: '-04:00',
    },
    {
      label: '(UTC -05:00) Bogotá',
      value: '-05:00',
    },
    {
      label: '(UTC -06:00) Cidade do México',
      value: '-06:00',
    },
    {
      label: '(UTC -07:00) Phoenix',
      value: '-07:00',
    },
    {
      label: '(UTC -08:00) Los Angeles',
      value: '-08:00',
    },
    {
      label: '(UTC -09:00) Anchorage',
      value: '-09:00',
    },
    {
      label: '(UTC -10:00) Honolulu',
      value: '-10:00',
    },
    {
      label: '(UTC -11:00) Samoa',
      value: '-11:00',
    },
    {
      label: '(UTC -12:00) Baker Island',
      value: '-12:00',
    },
  ]

  return (
    <div className="account-settings-container__basic-information">
      <h4>{translate('ACCOUNT_SETTINGS.LANGUAGE_AND_REGION')}</h4>

      <Container className="mt-4">
        <ContainerItem sm={4} md={4} xl={5}>
          <Select
            label={translate('PROFILE.LANGUAGE')}
            options={[
              { label: 'English' },
              { label: 'Spanish' },
              { label: 'Portuguese' },
            ]}
            unique
          />
        </ContainerItem>
      </Container>

      <Container className="mb-3">
        <ContainerItem sm={4} md={4} xl={5}>
          <Select label="Timezone" options={timezones} unique />
        </ContainerItem>
      </Container>

      <Button appearance="primary">
        {translate('ACCOUNT_SETTINGS.SAVE_CHANGES')}
      </Button>
    </div>
  )
}
