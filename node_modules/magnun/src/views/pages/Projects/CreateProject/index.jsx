import React from 'react'

import { translate } from '../../../../hooks/translate'

import AppPage from '../../../../components/CustomUI/AppPage'
import CardContainer from '../../../../components/CustomUI/CardContainer'
import Input from '../../../../components/BaseUI/Input'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'
import RichTextEditor from '../../../../components/CustomUI/RichTextEditor'
import DatePicker from '../../../../components/CustomUI/DatePicker'
import Label from '../../../../components/BaseUI/Label'
import Select from '../../../../components/BaseUI/Select'
import Avatar from '../../../../components/CustomUI/Avatar'

import usersJSON from '../../../../mocks/users.json'
import ButtonGroup from '../../../../components/BaseUI/ButtonGroup'
import Button from '../../../../components/BaseUI/Button'

export default function CreateProject() {
  const breadcrumbs = [
    { label: 'Magnun', url: '' },
    { label: translate('PROJECTS.TITLE'), url: '' },
    { label: translate('PROJECTS.CREATE_PROJECT') },
  ]

  const users = usersJSON?.map(user => ({
    label: user?.name,
    value: user?.id,
  }))

  return (
    <AppPage
      title={translate('PROJECTS.CREATE_PROJECT')}
      breadcrumbs={breadcrumbs}
    >
      <CardContainer className="p-3">
        <Container>
          <ContainerItem sm={4} md={4} xl={6}>
            <Input
              type="text"
              label="Name"
              placeholder={translate('PROJECTS.PROJECT_NAME')}
            />
          </ContainerItem>

          <ContainerItem sm={4} md={4} xl={6}>
            <Label>Avatar</Label>
            <Avatar appearance="square" size="large" selection />
          </ContainerItem>

          <ContainerItem sm={4} md={4} xl={6}>
            <Select label={translate('PROJECTS.TEAM_MEMBER')} options={users} />
          </ContainerItem>

          <ContainerItem sm={4} md={4} xl={6}>
            <Input
              type="number"
              label={translate('PROJECTS.BUDGET')}
              placeholder={translate('PROJECTS.INSERT_PROJECT_BUDGET')}
            />
          </ContainerItem>

          <ContainerItem sm={4} md={4} xl={6}>
            <DatePicker label={translate('PROJECTS.START_DATE')} />
          </ContainerItem>

          <ContainerItem sm={4} md={4} xl={6}>
            <DatePicker label={translate('PROJECTS.END_DATE')} />
          </ContainerItem>

          <ContainerItem sm={4} md={8} xl={12}>
            <Label>{translate('UI.DESCRIPTION')}</Label>
            <RichTextEditor focused={true} />
          </ContainerItem>

          <ContainerItem sm={4} md={4} xl={12}>
            <ButtonGroup>
              <Button appearance="primary">{translate('UI.SAVE')}</Button>
              <Button appearance="soft">{translate('UI.CANCEL')}</Button>
            </ButtonGroup>
          </ContainerItem>
        </Container>
      </CardContainer>
    </AppPage>
  )
}
