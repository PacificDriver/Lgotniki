import React, { useState } from 'react'

import { translate } from '../../../../hooks/translate'
import { useFormatValue } from '../../../../hooks/useFormatValue'

import Button from '../../../../components/BaseUI/Button'
import IconButton from '../../../../components/BaseUI/Button/IconButton'
import Input from '../../../../components/BaseUI/Input'
import ListGroup from '../../../../components/BaseUI/ListGroup'
import ListItem from '../../../../components/BaseUI/ListGroup/ListItem'
import Lozenge from '../../../../components/BaseUI/Lozenge'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '../../../../components/BaseUI/Modal'
import Select from '../../../../components/BaseUI/Select'
import { Table, Td, Tr } from '../../../../components/BaseUI/Table'
import AppPage from '../../../../components/CustomUI/AppPage'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'
import Picture from '../../../../components/CustomUI/Picture'
import SidebarContainer from '../../../../components/CustomUI/SidebarContainer'

import ordersJSON from '../../../../mocks/orders.json'
import productsJSON from '../../../../mocks/products.json'

import { FiEdit3, FiEye } from 'react-icons/fi'

const Orders = () => {
  const [orders] = useState(ordersJSON)
  const [openModal, setOpenModal] = useState(false)
  const [orderDetail, setOrderDetail] = useState(null)
  const [productInfo, setProductInfo] = useState(null)
  const [sidebarOpened, setSidebarOpened] = useState(false)

  const format = useFormatValue

  const headers = [
    { name: translate('ECOMMERCE.ORDER_ID'), dataType: 'text' },
    { name: translate('UI.DATE'), dataType: 'date' },
    { name: translate('UI.TOTAL'), dataType: 'between' },
    { name: translate('ECOMMERCE.PAYMENT_STATUS'), dataType: 'option' },
    { name: translate('ECOMMERCE.PAYMENT_METHOD'), dataType: 'option' },
    { name: translate('ECOMMERCE.ORDER_STATUS'), dataType: 'option' },
    { name: translate('UI.ACTIONS') },
  ]

  const breadcrumbs = [
    { label: 'Magnun', url: '' },
    { label: 'eCommerce', url: '' },
    { label: translate('ECOMMERCE.ORDERS') },
  ]

  const paymentStatus = {
    0: {
      name: translate('ECOMMERCE.PROCESSING'),
      class: 'default-subtle',
    },
    1: {
      name: translate('ECOMMERCE.APPROVED'),
      class: 'success-subtle',
    },
    2: {
      name: translate('ECOMMERCE.DISAPPROVED'),
      class: 'danger-subtle',
    },
  }

  const paymentMethod = {
    1: { icon: 'barcode', name: translate('ECOMMERCE.TICKET') },
    2: { icon: 'credit_card', name: translate('ECOMMERCE.CREDIT_CARD') },
  }

  const orderStatus = {
    0: {
      name: translate('ECOMMERCE.RECEIVED'),
      class: 'info-subtle',
    },
    1: {
      name: translate('ECOMMERCE.SENT'),
      class: 'warning-subtle',
    },
    2: { name: translate('UI.DELIVERED'), class: 'success-subtle' },
    3: { name: translate('UI.CANCELED'), class: 'danger-subtle' },
  }

  const orderStatusOptions = [
    { value: 0, label: translate('ECOMMERCE.RECEIVED') },
    { value: 1, label: translate('ECOMMERCE.SENT') },
    { value: 2, label: translate('UI.DELIVERED') },
    { value: 3, label: translate('UI.CANCELED') },
  ]

  const handleCloseModal = () => {
    setOpenModal(false)
    setOrderDetail(null)
    setProductInfo(null)
  }

  return (
    <AppPage title={translate('ECOMMERCE.ORDERS')} breadcrumbs={breadcrumbs}>
      <Container>
        <ContainerItem sm={4} md={8} xl={12}>
          <Table
            title={translate('ECOMMERCE.WISH_LIST')}
            columns={headers}
            tableId="wish-list"
            checkboxSelection
            disableExport
          >
            {orders.map((order, index) => (
              <Tr key={index} id={order?.id || index}>
                <Td className="weight-600">{order.orderCode}</Td>
                <Td>{format(order.date, 'date')}</Td>
                <Td>{format(order.subTotal + order.shipping, 'money')}</Td>
                <Td>
                  <Lozenge
                    appearance={paymentStatus[order.paymentStatus].class}
                  >
                    {paymentStatus[order.paymentStatus].name}
                  </Lozenge>
                </Td>
                <Td className="d-flex align-items-center gap-1">
                  <div className="material-symbols-outlined size-20">
                    {paymentMethod[order.paymentMethod].icon}
                  </div>
                  <div>{paymentMethod[order.paymentMethod].name}</div>
                </Td>
                <Td>
                  <Lozenge appearance={orderStatus[order.orderStatus].class}>
                    {orderStatus[order.orderStatus].name}
                  </Lozenge>
                </Td>
                <Td>
                  <div className="d-flex align-items-center">
                    <IconButton
                      icon={<FiEye style={{ fontSize: '18px' }} />}
                      appearance="subtle"
                      shape="circle"
                      onClick={() => {
                        setOpenModal(true)
                        setOrderDetail(order)
                        setProductInfo(
                          productsJSON?.find(
                            product => product.id === order.productId
                          )
                        )
                      }}
                    />

                    <IconButton
                      icon={<FiEdit3 style={{ fontSize: '18px' }} />}
                      appearance="subtle"
                      shape="circle"
                      onClick={() => {
                        setSidebarOpened(true)
                        setOrderDetail(order)
                      }}
                    />
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        </ContainerItem>
      </Container>

      <Modal
        isOpen={openModal}
        alignment={'center'}
        size={'medium'}
        onClose={handleCloseModal}
      >
        <ModalHeader>{translate('ECOMMERCE.ORDER_DETAILS')}</ModalHeader>
        <ModalBody>
          <div className="d-flex align-items-center gap-1 mb-3">
            <div className="weight-500">
              {translate('ECOMMERCE.REQUEST_CODE')}:
            </div>
            <div>{orderDetail?.orderCode}</div>
          </div>

          <div className="d-flex align-items-center gap-1 mb-3">
            <div className="weight-500">{translate('ECOMMERCE.CLIENT')}:</div>
            <div>Bruna Matarazzo</div>
          </div>

          <div className="d-flex align-items-center gap-1 mb-3">
            <div className="weight-500">
              {translate('ECOMMERCE.FORM_OF_PAYMENT')}:
            </div>
            <div className="d-flex align-items-center gap-1">
              <div>{orderDetail?.paymentMethod === 1 ? '1' : '4'} x </div>
              <div>
                <Lozenge appearance="info-subtle">
                  <div className="material-symbols-outlined size-20">
                    {paymentMethod[orderDetail?.paymentMethod]?.icon}
                  </div>

                  <div>{paymentMethod[orderDetail?.paymentMethod]?.name}</div>
                </Lozenge>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-1 mb-3">
            <div className="weight-500">
              {translate('ECOMMERCE.PAYMENT_STATUS')}:
            </div>

            <Lozenge appearance={orderStatus[orderDetail?.orderStatus]?.class}>
              {orderStatus[orderDetail?.orderStatus]?.name}
            </Lozenge>
          </div>

          <ListGroup borderless={true}>
            <ListItem>
              <div className="weight-500">{translate('UI.PRODUCT')}:</div>
              <div className="weight-500">{translate('UI.PRICE')}</div>
            </ListItem>

            <ListItem>
              <div className="d-flex align-items-center gap-1">
                <div>
                  <Picture image={productInfo?.image} width={'30px'} />
                </div>
                <div>{productInfo?.name}</div>
              </div>
              <div>{format(productInfo?.price, 'money')}</div>
            </ListItem>

            <ListItem>
              <div className="weight-500">Subtotal: </div>
              <div>{format(orderDetail?.subTotal, 'money')}</div>
            </ListItem>

            <ListItem>
              <div className="weight-500">
                {translate('ECOMMERCE.FREIGHT')}:{' '}
              </div>
              <div>
                {orderDetail?.shipping > 0
                  ? format(orderDetail.shipping, 'money')
                  : translate('ECOMMERCE.FREE')}
              </div>
            </ListItem>

            <ListItem>
              <div className="weight-500">{translate('UI.TOTAL')}: </div>
              <div>
                {format(orderDetail?.subTotal + orderDetail?.shipping, 'money')}
              </div>
            </ListItem>
          </ListGroup>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>

      <SidebarContainer
        title={translate('ECOMMERCE.EDIT_ORDER')}
        show={sidebarOpened}
        onClose={() => setSidebarOpened(false)}
      >
        <div>
          <Input
            type={'text'}
            value={orderDetail?.orderCode}
            label={translate('ECOMMERCE.REQUEST_CODE')}
            disabled={true}
          />
        </div>

        <div>
          <Input
            type={'text'}
            value={'Bruna Matarazzo'}
            label={translate('ECOMMERCE.CLIENT')}
            disabled={true}
          />
        </div>

        <div>
          <Select
            label={translate('ECOMMERCE.ORDER_STATUS')}
            options={orderStatusOptions}
            selected={[orderDetail?.orderStatus]}
            unique={true}
          />
        </div>

        <div>
          <Input
            type={'text'}
            value={orderDetail?.subTotal}
            label={'Subtotal'}
            disabled={true}
          />
        </div>

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

export default Orders
