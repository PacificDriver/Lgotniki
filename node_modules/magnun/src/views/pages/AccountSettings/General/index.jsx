import React from 'react'

import { translate } from '../../../../hooks/translate'

import Button from '../../../../components/BaseUI/Button'
import Input from '../../../../components/BaseUI/Input'
import Label from '../../../../components/BaseUI/Label'
import Avatar from '../../../../components/CustomUI/Avatar'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'
import RichTextEditor from '../../../../components/CustomUI/RichTextEditor'

import userImg from '../../../../assets/users/jennyfer.jpg'

import styles from './General.module.scss'

export default function General() {
  return (
    <div className={styles['general']}>
      <div className="title-page mt-2">My Profile</div>
      <p className="sub-title">
        Organize your personal data and control which information is visible to
        others and which apps can access.
      </p>

      <Container className="mt-5 card">
        <ContainerItem className="general--picture" sm={4} md={4} xl={12}>
          <div className="general--picture--avatar">
            <Avatar
              src={userImg}
              name="Beatriz"
              appearance="circle"
              size="xxlarge"
              selection
            />
          </div>
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={6}>
          <Input
            label={translate('UI.FULL_NAME')}
            type="text"
            value="Carolina Ferreira"
          />
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={6}>
          <Input label="E-mail" type="email" value="ferreira.carol@email.com" />
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={6}>
          <Input
            label={translate('Username')}
            type="text"
            value="carolinaferreira"
          />
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={6}>
          <Input
            label={translate('Phone number')}
            type="tel"
            value="+55 (11) 91234-5678"
          />
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={12}>
          <Label>Bio</Label>
          <RichTextEditor placeholder="Define your bio" focused />
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
