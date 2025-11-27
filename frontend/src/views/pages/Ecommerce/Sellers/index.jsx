import React, { useState } from 'react'

import { translate } from '../../../../hooks/translate'
import useDateFormat from '../../../../hooks/useDateFormat'

import AppPage from '../../../../components/CustomUI/AppPage'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'
import { Table, Tr, Td } from '../../../../components/BaseUI/Table'
import Money from '../../../../components/CustomUI/Money'
import Date from '../../../../components/CustomUI/Date'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '../../../../components/BaseUI/Modal'
import SidebarContainer from '../../../../components/CustomUI/SidebarContainer'
import Input from '../../../../components/BaseUI/Input'
import Select from '../../../../components/BaseUI/Select'
import Button from '../../../../components/BaseUI/Button'
import Avatar from '../../../../components/CustomUI/Avatar'
import ButtonGroup from '../../../../components/BaseUI/ButtonGroup'
import IconButton from '../../../../components/BaseUI/Button/IconButton'
import DatePicker from '../../../../components/CustomUI/DatePicker'

import { FiEye, FiEdit3 } from 'react-icons/fi'

import sellerJSON from '../../../../mocks/sellers.json'

export default function Sellers() {
  const [selers] = useState(sellerJSON)
  const [openModal, setOpenModal] = useState(false)
  const [sellerDetail, setSellerDetail] = useState(null)
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const [addSeller, setAddSeller] = useState(false)

  const headers = [
    { name: translate('UI.NAME'), dataType: 'text' },
    { name: 'Email', dataType: 'text' },
    { name: translate('UI.TELEPHONE'), dataType: 'text' },
    { name: translate('UI.ACTIONS') },
  ]

  const breadcrumbs = [
    { label: 'Magnun', url: '' },
    { label: 'eCommerce', url: '' },
    { label: translate('ECOMMERCE.SELLERS') },
  ]
  const sexOptions = [
    { value: 'Feminino', label: translate('UI.FEMININE') },
    { value: 'Masculino', label: translate('UI.MASCULINE') },
  ]

  const handleCloseModal = () => {
    setOpenModal(false)
    setSellerDetail(null)
  }

  return (
    <AppPage
      title={translate('ECOMMERCE.SELLERS')}
      breadcrumbs={breadcrumbs}
      actions={
        <Button appearance="primary" onClick={() => setAddSeller(true)}>
          {translate('ECOMMERCE.ADD_SELLER')}
        </Button>
      }
    >
      <Container>
        <ContainerItem sm={4} md={8} xl={12}>
          <Table
            title={translate('ECOMMERCE.LIST_OF_SELLERS')}
            columns={headers}
            tableId="list-of-sellers"
            checkboxSelection
          >
            {selers.map((customer, index) => (
              <Tr key={index} id={customer?.id || index}>
                <Td className="d-flex align-items-center gap-1">
                  <Avatar
                    src={customer?.image}
                    name={customer.name}
                    size="small"
                  />
                  <div>{customer.name}</div>
                </Td>

                <Td>{customer.email}</Td>

                <Td>{customer.phone}</Td>

                <Td>
                  <div className="d-flex align-items-center">
                    <IconButton
                      icon={<FiEye style={{ fontSize: '18px' }} />}
                      appearance="subtle"
                      shape="circle"
                      onClick={() => {
                        setOpenModal(true)
                        setSellerDetail(customer)
                      }}
                    />

                    <IconButton
                      icon={<FiEdit3 style={{ fontSize: '18px' }} />}
                      appearance="subtle"
                      shape="circle"
                      onClick={() => {
                        setSidebarOpened(true)
                        setSellerDetail(customer)
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
        <ModalHeader>{translate('ECOMMERCE.SELLER_DATA')}</ModalHeader>
        <ModalBody>
          <div className="d-flex align-items-center gap-1 mb-3">
            <div className="weight-500">{translate('UI.NAME')}:</div>
            <div>{sellerDetail?.name}</div>
          </div>

          <div className="d-flex align-items-center gap-1 mb-3">
            <div className="weight-500">CPF:</div>
            <div>{sellerDetail?.cpf}</div>
          </div>

          <div className="d-flex align-items-center gap-1 mb-3">
            <div className="weight-500">{translate('UI.DATE_OF_BIRTH')}:</div>
            <div>
              <Date value={sellerDetail?.dateOfBirth} />
            </div>
          </div>

          <div className="d-flex align-items-center gap-1 mb-3">
            <div className="weight-500">{translate('UI.SEX')}:</div>
            <div>{sellerDetail?.sex}</div>
          </div>

          <div className="d-flex align-items-center gap-1 mb-3">
            <div className="weight-500">Email:</div>
            <div>{sellerDetail?.email}</div>
          </div>

          <div className="d-flex align-items-center gap-1 mb-3">
            <div className="weight-500">{translate('UI.TELEPHONE')}:</div>
            <div>{sellerDetail?.phone}</div>
          </div>

          <div className="d-flex align-items-start gap-1 mb-3">
            <div className="weight-500">{translate('UI.ADDRESS')}:</div>
            <div>
              {sellerDetail?.address}, {sellerDetail?.neighborhood},{' '}
              {sellerDetail?.number}, {sellerDetail?.city}/{sellerDetail?.state}{' '}
              - {sellerDetail?.zipCode}
            </div>
          </div>

          <div className="d-flex align-items-center gap-1 mb-3">
            <div className="weight-500">{translate('UI.REMUNERATION')}:</div>
            <div>
              <Money value={sellerDetail?.remuneration} />
            </div>
          </div>

          <div className="d-flex align-items-center gap-1 mb-3">
            <div className="weight-500">{translate('UI.ASSESSMENT')}:</div>
            <div className="d-flex align-items-center">
              <div className="material-symbols-outlined size-20">star</div>
              <div className="size-14 pl-1">{sellerDetail?.ratingAverage}</div>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={addSeller}
        alignment={'center'}
        size={'medium'}
        onClose={() => setAddSeller(false)}
      >
        <ModalHeader>{translate('ECOMMERCE.ADD_SELLER')}</ModalHeader>
        <ModalBody>
          <Avatar selection size="large" />

          <div className="py-2"></div>

          <Input label={translate('UI.FUL_NAME')} type="text" required />
          <div className="py-2"></div>

          <Input label="E-mail" type="text" required />
          <div className="py-2"></div>

          <Input label={translate('UI.TELEPHONE')} type="text" required />
          <div className="py-2"></div>

          <Input label={translate('UI.ADDRESS')} type="text" required />
          <div className="py-2"></div>

          <DatePicker label={translate('UI.DATE_OF_BIRTH')} required />
        </ModalBody>
        <ModalFooter>
          <ButtonGroup placement="end">
            <Button appearance="primary">{translate('UI.SAVE')}</Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>

      <SidebarContainer
        title={translate('ECOMMERCE.EDIT_SELLER')}
        show={sidebarOpened}
        onClose={() => setSidebarOpened(false)}
      >
        <div>
          <Input
            type={'text'}
            label={translate('UI.NAME')}
            value={sellerDetail?.name}
          />
        </div>

        <div>
          <Input type={'text'} label={'CPF'} value={sellerDetail?.cpf} />
        </div>

        <div>
          <Input type={'email'} label={'Email'} value={sellerDetail?.email} />
        </div>

        <div>
          <Input
            type={'text'}
            label={translate('UI.TELEPHONE')}
            value={sellerDetail?.phone}
          />
        </div>

        <div className="mb-3">
          <DatePicker
            label={translate('UI.DATE_OF_BIRTH')}
            value={useDateFormat(sellerDetail?.dateOfBirth)}
          />
        </div>

        <div>
          <Select
            label={translate('UI.SEX')}
            options={sexOptions}
            selected={[sellerDetail?.sex]}
            unique={true}
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
