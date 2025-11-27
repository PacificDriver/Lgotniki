import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { translate } from '../../../../hooks/translate'
import { useFormatValue } from '../../../../hooks/useFormatValue'
import { useModalConfirm as confirm } from '../../../../hooks/useModalConfirm'

import Button from '../../../../components/BaseUI/Button'
import IconButton from '../../../../components/BaseUI/Button/IconButton'
import Input from '../../../../components/BaseUI/Input'
import Label from '../../../../components/BaseUI/Label'
import Lozenge from '../../../../components/BaseUI/Lozenge'
import Select from '../../../../components/BaseUI/Select'
import { Table, Td, Tr } from '../../../../components/BaseUI/Table'
import Toggle from '../../../../components/BaseUI/Toggle'
import AppPage from '../../../../components/CustomUI/AppPage'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'
import Picture from '../../../../components/CustomUI/Picture'
import RichTextEditor from '../../../../components/CustomUI/RichTextEditor'
import SidebarContainer from '../../../../components/CustomUI/SidebarContainer'
import { Toast, ToastContainer } from '../../../../components/CustomUI/Toast'

import { FiEdit3, FiTrash2 } from 'react-icons/fi'

import productsJSON from '../../../../mocks/products.json'

const Products = () => {
  const [products, setProducts] = useState(productsJSON)
  const [toasts, setToasts] = useState([])
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const [productInfo, setProductInfo] = useState({})

  const format = useFormatValue
  const navigate = useNavigate()

  const headers = [
    { name: translate('UI.NAME'), dataType: 'text' },
    { name: translate('UI.CATEGORY'), dataType: 'option' },
    { name: translate('UI.PRICE'), dataType: 'between' },
    { name: translate('UI.STOCK'), dataType: 'between' },
    { name: translate('UI.SALES'), dataType: 'between' },
    { name: translate('UI.STATUS'), dataType: 'option' },
    { name: translate('UI.CREATED'), dataType: 'date' },
    { name: translate('UI.ACTIONS') },
  ]

  const breadcrumbs = [
    { label: 'Magnun', url: '' },
    { label: 'eCommerce', url: '' },
    { label: translate('UI.PRODUCTS') },
  ]

  const handleProductInfo = product => {
    setSidebarOpened(true)
    setProductInfo(product)
  }

  const deleteProduct = id => {
    const product = products?.find(product => product.id === id)
    const index = products?.findIndex(product => product.id === id)
    const values = products

    confirm({
      title: `${translate('UI.DELETE')} ${product?.name}?`,
      message:
        'The exclusion is permanent and there is a possibility of recovery.',
      appearance: 'danger',
      confirmButtonText: translate('UI.DELETE'),
      onConfirm: async () => {
        values?.splice(index, 1)
        setProducts([...values])

        setToasts([
          {
            description: `The product "${product?.name}" has been successfully deleted from the system.`,
            id: id,
            key: id,
            title: 'Product successfully deleted!',
            appearance: 'success',
          },
          ...toasts,
        ])
      },
    })
  }

  const removeToast = index => {
    const values = toasts
    values.splice(index, 1)

    setToasts([...values])
  }

  const closeSidebar = () => {
    setSidebarOpened(false)
    setProductInfo({})
  }

  return (
    <AppPage
      title={translate('UI.PRODUCTS')}
      breadcrumbs={breadcrumbs}
      actions={
        <Button
          appearance="primary"
          onClick={() => navigate('/dashboard/ecommerce/products/create')}
        >
          {translate('ECOMMERCE.ADD_PRODUCT')}
        </Button>
      }
    >
      <Container>
        <ContainerItem sm={4} md={8} xl={12}>
          <Table
            title={translate('ECOMMERCE.PRODUCT_LIST')}
            columns={headers}
            tableId="product-list"
            checkboxSelection
            disableExport
          >
            {products.map((product, index) => (
              <Tr key={index} id={product?.id || index}>
                <Td>
                  <div className="d-flex align-items-center gap-1">
                    <Picture
                      image={product.image}
                      width="25px"
                      minWidth="25px"
                    />
                    <span>{product.name}</span>
                  </div>
                </Td>
                <Td>
                  <Lozenge appearance="info-subtle">
                    {product?.category}
                  </Lozenge>
                </Td>
                <Td>{format(product?.price, 'money')}</Td>
                <Td>
                  <Lozenge appearance="info-subtle">
                    {format(product?.stock, 'number')}
                  </Lozenge>
                </Td>
                <Td>
                  <Lozenge appearance="info-subtle">
                    {format(product.salesQuantity, 'number')}
                  </Lozenge>
                </Td>
                <Td>
                  <Lozenge
                    appearance={
                      product.status === 1 ? 'success-subtle' : 'danger-subtle'
                    }
                  >
                    {product.status === 1
                      ? translate('UI.ACTIVE')
                      : translate('UI.INACTIVE')}
                  </Lozenge>
                </Td>
                <Td>{format(product.createdDate, 'date')}</Td>
                <Td>
                  <div className="d-flex align-items-center gap-1 u-pointer">
                    <IconButton
                      icon={<FiEdit3 style={{ fontSize: '18px' }} />}
                      appearance="subtle"
                      shape="circle"
                      onClick={() => handleProductInfo(product)}
                    />

                    <IconButton
                      icon={<FiTrash2 style={{ fontSize: '18px' }} />}
                      appearance="subtle"
                      shape="circle"
                      onClick={() => deleteProduct(product.id)}
                    />
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        </ContainerItem>
      </Container>

      <SidebarContainer
        show={sidebarOpened}
        title="Edição de produto"
        onClose={closeSidebar}
      >
        <Input
          type={'text'}
          value={productInfo?.name}
          label={translate('UI.NAME')}
        />

        <Label>{translate('UI.DESCRIPTION')}</Label>
        <RichTextEditor content={productInfo?.description} />

        <Select
          label={translate('UI.CATEGORY')}
          options={[
            { label: 'Móveis', value: 'Móveis' },
            { label: 'Calçados', value: 'Calçados' },
          ]}
          selected={productInfo?.category}
          unique={true}
        />

        <Input
          type={'number'}
          value={productInfo?.price}
          label={translate('UI.PRICE')}
        />

        <Input
          type={'number'}
          value={productInfo?.['stock']}
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

        <div className="label">{translate('UI.STATUS')}</div>
        <Toggle label="Ativo" />

        <div className="mt-4">
          <Button
            title={translate('UI.SAVE')}
            appearance="primary"
            onClick={() => setSidebarOpened(false)}
          />
        </div>
      </SidebarContainer>

      <ToastContainer>
        {toasts?.map((toast, index) => (
          <Toast
            {...toast}
            key={index}
            actions={[
              { content: 'Dismiss', onClick: () => removeToast(index) },
            ]}
          />
        ))}
      </ToastContainer>
    </AppPage>
  )
}

export default Products
