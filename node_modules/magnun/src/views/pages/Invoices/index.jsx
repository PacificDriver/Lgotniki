import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { translate } from '../../../hooks/translate'
import { useFormatValue as formatValue } from '../../../hooks/useFormatValue'
import { useFormattedDate as formatDate } from '../../../hooks/useFormattedDate'

import { getAllInvoices } from '../../../services/invoices'

import Lozenge from '../../../components/BaseUI/Lozenge'
import { Table, Td, Tr } from '../../../components/BaseUI/Table'
import AppPage from '../../../components/CustomUI/AppPage'
import CardInfo from '../../../components/CustomUI/CardInfo'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'

import styles from './Invoices.module.scss'

import Avatar from '../../../components/CustomUI/Avatar'
import DropdownMenu from '../../../components/CustomUI/DropdownMenu'
import { headers, invoiceHighlights, statusMap } from './data'

export default function Invoices() {
  const [invoiceList, setInvoiceList] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const loadInvoices = async () => {
      const invoices = await getAllInvoices()
      setInvoiceList(invoices)
    }

    loadInvoices()
  }, [])

  return (
    <AppPage
      title={translate('INVOICES.OVERVIEW')}
      className={styles['invoices']}
    >
      <Container>
        {invoiceHighlights?.map((invoice, index) => (
          <ContainerItem sm={4} md={4} xl={3} key={index}>
            <CardInfo
              type="eccomerce"
              card={invoice}
              appearance={invoice?.appearance}
            />
          </ContainerItem>
        ))}
      </Container>

      <Container className="mt-4">
        <ContainerItem sm={4} md={4} xl={12}>
          <Table
            columns={headers}
            tableId="invoice-list"
            disableExport
            disableColumnMenu
          >
            {invoiceList?.map((invoice, index) => (
              <Tr key={index} id={invoice?.id || index}>
                <Td>{invoice?.number}</Td>
                <Td>
                  <Lozenge appearance={statusMap[invoice?.status]?.type}>
                    {statusMap[invoice?.status]?.label}
                  </Lozenge>
                </Td>
                <Td>{formatDate(invoice?.createdAt, 'DD MMM YYYY')}</Td>
                <Td>
                  <Avatar
                    src={invoice.user.image}
                    name={invoice.user.name}
                    size="default"
                  />
                  <span>{invoice.user.name}</span>
                </Td>
                <Td>{formatValue(invoice?.total, 'money', 2)}</Td>
                <Td>{formatValue(invoice?.amountDue, 'money', 2)}</Td>
                <Td>
                  <DropdownMenu
                    options={[
                      { name: translate('UI.VIEW') },
                      { name: translate('UI.EDIT') },
                      { name: translate('UI.DELETE') },
                    ]}
                    direction="right"
                    onClicked={() =>
                      navigate(`/dashboard/invoices/${invoice?.id}`)
                    }
                    horizontalIcon
                  />
                </Td>
              </Tr>
            ))}
          </Table>
        </ContainerItem>
      </Container>
    </AppPage>
  )
}
