import React, { useState } from 'react'

import { translate } from '../../../../../hooks/translate'

import AppPage from '../../../../../components/CustomUI/AppPage'
import Container from '../../../../../components/CustomUI/Container'
import ContainerItem from '../../../../../components/CustomUI/Container/ContainerItem'
import CardContainer from '../../../../../components/CustomUI/CardContainer'
import Input from '../../../../../components/BaseUI/Input'
import Select from '../../../../../components/BaseUI/Select'
import RichTextEditor from '../../../../../components/CustomUI/RichTextEditor'
import Label from '../../../../../components/BaseUI/Label'
import Button from '../../../../../components/BaseUI/Button'
import Dropzone from '../../../../../components/CustomUI/Dropzone'
import ButtonGroup from '../../../../../components/BaseUI/ButtonGroup'

const CreateOption = () => {
  return (
    <Container className="px-3">
      <ContainerItem sm={4} md={4} xl={3}>
        <Select
          options={[
            { value: 1, label: 'Marca' },
            { value: 2, label: 'Modelo' },
            { value: 3, label: 'Cor' },
            { value: 4, label: 'Estilo' },
            { value: 5, label: 'Tamanho' },
            { value: 6, label: 'Material' },
          ]}
          selected={[1]}
          unique
        />
      </ContainerItem>
      <ContainerItem sm={4} md={4} xl={5}>
        <Input />
      </ContainerItem>
    </Container>
  )
}

export default function CreateProduct() {
  const [options, setOptions] = useState([<CreateOption key={0} />])

  const addOption = () => {
    const newOptions = [...options, <CreateOption key={options.length} />]
    setOptions(newOptions)
  }

  return (
    <AppPage title={translate('ECOMMERCE.ADD_PRODUCT')}>
      <CardContainer title={translate('ECOMMERCE.PRODUCT_INFORMATION')}>
        <Container className="p-3">
          <ContainerItem sm={4} md={4} xl={6}>
            <Input
              label={translate('ECOMMERCE.PRODUCT_NAME')}
              type="text"
              required
            />
          </ContainerItem>

          <ContainerItem sm={4} md={4} xl={3}>
            <Input label={translate('ECOMMERCE.BRAND')} type="text" required />
          </ContainerItem>

          <ContainerItem sm={4} md={4} xl={3}>
            <Input label={translate('ECOMMERCE.MODEL')} type="text" required />
          </ContainerItem>

          <ContainerItem sm={4} md={4} xl={6}>
            <Select label={translate('UI.CATEGORY')} required />
          </ContainerItem>

          <ContainerItem sm={4} md={4} xl={3}>
            <Input label={translate('UI.PRICE')} type="text" required />
          </ContainerItem>

          <ContainerItem sm={4} md={4} xl={3}>
            <Input label={translate('ECOMMERCE.WEIGHT')} type="text" required />
          </ContainerItem>

          <ContainerItem sm={4} md={8} xl={12}>
            <Label required>{translate('UI.DESCRIPTION')}</Label>
            <RichTextEditor
              useBorder
              placeholder={translate('ECOMMERCE.PRODUCT_DESCRIPTION')}
              focused
            />
          </ContainerItem>
        </Container>
      </CardContainer>

      <div className="my-2"></div>

      <CardContainer title={translate('ECOMMERCE.PRODUCT_IMAGES')}>
        <Container className="p-3">
          <ContainerItem sm={4} md={8} xl={12}>
            <Dropzone />
          </ContainerItem>
        </Container>
      </CardContainer>

      <div className="my-2"></div>

      <CardContainer title={translate('ECOMMERCE.TECHNICAL_SPECIFICATIONS')}>
        {options}

        <div className="p-3">
          <Button onClick={addOption} appearance="primary">
            {translate('ECOMMERCE.ADD_ANOTHER_LINE')}
          </Button>
        </div>

        <div className="p-3">
          <ButtonGroup placement="end">
            <Button appearance="soft">{translate('UI.DISCARD')}</Button>
            <Button appearance="primary">{translate('UI.SAVE')}</Button>
          </ButtonGroup>
        </div>
      </CardContainer>
    </AppPage>
  )
}
