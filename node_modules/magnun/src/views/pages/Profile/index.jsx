import React from 'react'

import { translate } from '../../../hooks/translate'

import AppPage from '../../../components/CustomUI/AppPage'
import CardContainer from '../../../components/CustomUI/CardContainer'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import Avatar from '../../../components/CustomUI/Avatar'
import Lozenge from '../../../components/BaseUI/Lozenge'
import { Accordion, AccordionItem } from '../../../components/BaseUI/Accordion'
import RichTextEditor from '../../../components/CustomUI/RichTextEditor'
import Input from '../../../components/BaseUI/Input'

import userImg from '../../../assets/users/carolina.avif'

import './Profile.scss'

export default function Profile() {
  const accordions = [
    { title: translate('PROFILE.ABOUT_YOU') },
    { title: translate('PROFILE.PERSONAL_INFORMATION') },
    { title: translate('PROFILE.LANGUAGE_AND_LOCATION') },
  ]

  return (
    <AppPage
      title={translate('PROFILE.TITLE')}
      breadcrumbs={[
        { label: 'Mangnu', url: '' },
        { label: translate('PROFILE.TITLE') },
      ]}
      className="profile-container"
    >
      <CardContainer>
        <div className="profile-container__header">
          <div className="profile-container__header--avatar">
            <Avatar src={userImg} name="Jennyfer" size="xxlarge" />
          </div>
        </div>

        <div className="profile-container__user">
          <h2>Carolina Ferreira</h2>

          <div className="d-flex align-items-center gap-1">
            <span>Software Engineer</span> |
            <Lozenge appearance="default-subtle">UI Research</Lozenge>
            <Lozenge appearance="default-subtle">Tech Lead</Lozenge>
          </div>
        </div>

        <div className="p-3">
          <Accordion items={accordions} gap="8px">
            <AccordionItem>
              <RichTextEditor
                content={`<p>Hello! My name is <strong>Carolina Ferreira</strong>. I'm passionate about <em>technology</em> and love creating amazing things on the <u>web</u>. Currently, I work as a <em><strong>Engenheira de Software</strong></em> and I'm always looking to learn and grow in my field.</p>
                        <p>In this space, I share a bit of my experiences, projects, and anything else that inspires me. Welcome!</p>`}
                readOnly
              />
            </AccordionItem>

            <AccordionItem>
              <Container>
                <ContainerItem sm={4} md={4} xl={6}>
                  <Input
                    label="E-mail"
                    value="ferreira.carol@email.com"
                    disabled
                  />
                </ContainerItem>

                <ContainerItem sm={4} md={4} xl={6}>
                  <Input
                    label={translate('PROFILE.ORGANIZATION')}
                    value="Magnun"
                    disabled
                  />
                </ContainerItem>

                <ContainerItem sm={4} md={4} xl={6}>
                  <Input
                    label={translate('PROFILE.DEPARTMENT')}
                    value="Technology"
                    disabled
                  />
                </ContainerItem>

                <ContainerItem sm={4} md={4} xl={6}>
                  <Input
                    label={translate('PROFILE.POSITION')}
                    value="Tech Lead"
                    disabled
                  />
                </ContainerItem>
              </Container>
            </AccordionItem>

            <AccordionItem>
              <Container>
                <ContainerItem sm={4} md={4} xl={6}>
                  <Input
                    label={translate('PROFILE.LANGUAGE')}
                    value="English"
                    disabled
                  />
                </ContainerItem>

                <ContainerItem sm={4} md={4} xl={6}>
                  <Input
                    label="Timezone"
                    value="(UTC-04:00) New York"
                    disabled
                  />
                </ContainerItem>
              </Container>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContainer>
    </AppPage>
  )
}
