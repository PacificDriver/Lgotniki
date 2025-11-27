import React from 'react'

import { translate } from '../../../../hooks/translate'

import Button from '../../../../components/BaseUI/Button'
import Input from '../../../../components/BaseUI/Input'
import Avatar from '../../../../components/CustomUI/Avatar'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'

import userImg from '../../../../assets/users/jennyfer.jpg'

export default function BasicInformation() {
  return (
    <div className="account-settings-container__basic-information">
      <Container className="mt-4">
        <ContainerItem
          className="account-settings-container__basic-information--picture"
          sm={4}
          md={4}
          xl={12}
        >
          <div className="account-settings-container__basic-information--picture--avatar">
            <Avatar
              src={userImg}
              name="Beatriz"
              appearance="circle"
              size="xlarge"
              selection
            />
          </div>
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={12}>
          <Input label={translate('UI.FULL_NAME')} />
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={6}>
          <Input label="E-mail" />
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={6}>
          <Input label={translate('PROFILE.ORGANIZATION')} />
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={6}>
          <Input label={translate('PROFILE.DEPARTMENT')} />
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={6}>
          <Input label={translate('PROFILE.POSITION')} />
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={12}>
          <Button appearance="primary">
            {translate('ACCOUNT_SETTINGS.SAVE_CHANGES')}
          </Button>
        </ContainerItem>
      </Container>
    </div>
  )
}
