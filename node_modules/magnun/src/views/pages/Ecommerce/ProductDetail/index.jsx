import React, { useState } from 'react'

import { translate } from '../../../../hooks/translate'
import { useFormatValue } from '../../../../hooks/useFormatValue'

import Badge from '../../../../components/BaseUI/Badge'
import Button from '../../../../components/BaseUI/Button'
import Input from '../../../../components/BaseUI/Input'
import Label from '../../../../components/BaseUI/Label'
import Select from '../../../../components/BaseUI/Select'
import Toggle from '../../../../components/BaseUI/Toggle'
import AppPage from '../../../../components/CustomUI/AppPage'
import CardContainer from '../../../../components/CustomUI/CardContainer'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'
import Picture from '../../../../components/CustomUI/Picture'
import RichTextEditor from '../../../../components/CustomUI/RichTextEditor'
import SidebarContainer from '../../../../components/CustomUI/SidebarContainer'
import TagText from '../../../../components/CustomUI/TagText'

import productsJSON from '../../../../mocks/products.json'

import { MdStar } from 'react-icons/md'

import './style.scss'

const ProductDetail = () => {
  const [product] = useState(productsJSON[8])
  const [sidebarOpened, setSidebarOpened] = useState(false)

  const format = useFormatValue

  return (
    <AppPage
      title={translate('ECOMMERCE.PRODUCT_DETAILS')}
      className="product-details"
    >
      <CardContainer className="py-3">
        <Container>
          <ContainerItem sm={4} md={8} xl={5}>
            <div className="d-flex flex-column align-items-center gap-2">
              <Picture
                image={product.image}
                width={'70%'}
                className="initial__image"
              />
              <div className="d-flex align-items-center gap-1">
                <div className="full-border u-pointer p-1">
                  <Picture image={product.image} width={'50px'} />
                </div>
                <div className="full-border u-pointer p-1">
                  <Picture image={product.image} width={'50px'} />
                </div>
                <div className="full-border u-pointer p-1">
                  <Picture image={product.image} width={'50px'} />
                </div>
                <div className="full-border u-pointer p-1">
                  <Picture image={product.image} width={'50px'} />
                </div>
              </div>
            </div>
          </ContainerItem>

          <ContainerItem sm={4} md={8} xl={7} className="px-4">
            <div className="product__title">
              <div>{product.name}</div>
              <div>
                <span
                  className="material-symbols-outlined u-pointer size-20"
                  onClick={() => setSidebarOpened(true)}
                >
                  edit_square
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 py-2">
              <div className="d-flex align-items-center gap-1 size-14">
                <div className="d-flex align-items-center">
                  <MdStar className="star__rating" />{' '}
                  <div className="pl-1">{product.evaluationNote}</div>
                </div>
              </div>

              <div className="weigth-600 size-14">
                {format(237, 'number')} {translate('UI.ASSESSMENTS')}
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 mt-3 mb-4">
              <div>
                <Badge className="badge-success-outline" text={'30% OFF'} />
              </div>

              <div className="weight-400 size-14 text-through">
                {format(1799.99, 'money')}
              </div>

              <div className="weight-700 size-18">
                {format(product?.price, 'money')}
              </div>
            </div>

            <div className="product__separator"></div>

            <div className="weight-700 size-14 mt-4 mb-2">
              {translate('UI.COLORS')}
            </div>

            <div className="d-flex align-items-center gap-1">
              {['#7196B8', '#B5B5D8', '#F0EFF5', '#F7D7E0', '#FBB7CB'].map(
                (color, index) => (
                  <div
                    key={index}
                    className="product__colors"
                    style={{ background: color }}
                  ></div>
                )
              )}
            </div>

            <div className="py-4">
              <div className="mb-3 weight-600 size-14">
                {translate('ECOMMERCE.PRODUCT_DESCRIPTION')}
              </div>
              <TagText>{product.description}</TagText>
            </div>

            <div className="d-flex align-items-center justify-content-between mb-5 size-14">
              <div className="d-flex flex-column align-items-center">
                <div className="weight-600 mb-1">
                  {translate('ECOMMERCE.IN_STOCK')}
                </div>
                <div>{format(product?.stock, 'number')}</div>
              </div>

              <div className="d-flex flex-column align-items-center">
                <div className="weight-600 mb-1">
                  {translate('ECOMMERCE.NUMBER_OF_ORDERS')}
                </div>
                <div>{format(product.salesQuantity, 'number')}</div>
              </div>

              <div className="d-flex flex-column align-items-center">
                <div className="weight-600 mb-1">
                  {translate('ECOMMERCE.AMOUNT_OF_SALES')}
                </div>
                <div>
                  {format(product?.stock - product.salesQuantity, 'number')}
                </div>
              </div>
            </div>
          </ContainerItem>
        </Container>
      </CardContainer>

      <SidebarContainer
        show={sidebarOpened}
        title={translate('ECOMMERCE.PRODUCT_EDITION')}
        onClose={() => setSidebarOpened(false)}
      >
        <Input
          type={'text'}
          value={product?.name}
          label={translate('UI.NAME')}
        />

        <Label>{translate('UI.DESCRIPTION')}</Label>
        <RichTextEditor content={product?.description} />

        <Select
          label={translate('UI.CATEGORY')}
          options={[
            { label: 'Móveis', value: 'Móveis' },
            { label: 'Calçados', value: 'Calçados' },
          ]}
          selected={product?.category}
          unique={true}
        />

        <Input
          type={'number'}
          value={product?.price}
          label={translate('UI.PRICE')}
        />

        <Input
          type={'number'}
          value={product?.['stock']}
          label={translate('UI.STOCK')}
        />

        <div className="my-3">
          <div className="label">{translate('UI.COLORS')}</div>
          <div className="mt-3 d-flex align-items-center gap-1">
            {['#7196B8', '#B5B5D8', '#F0EFF5', '#F7D7E0', '#FBB7CB'].map(
              (color, index) => (
                <div
                  key={index}
                  style={{ background: color, width: '30px', height: '30px' }}
                ></div>
              )
            )}
          </div>
        </div>

        <Label>{translate('UI.STATUS')}</Label>
        <Toggle label={translate('UI.ACTIVE')} />

        <div className="mt-4">
          <Button
            title={translate('UI.SAVE')}
            appearance="primary"
            onClick={() => setSidebarOpened(false)}
          />
        </div>
      </SidebarContainer>
    </AppPage>
  )
}

export default ProductDetail
