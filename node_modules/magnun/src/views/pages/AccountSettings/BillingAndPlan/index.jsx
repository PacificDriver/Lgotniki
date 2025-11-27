import React, { useEffect, useState } from 'react'

import { useFormatValue } from '../../../../hooks/useFormatValue'
import { useFormattedDate } from '../../../../hooks/useFormattedDate'
import { getAllUsers } from '../../../../services/users'

import { useRequire } from '../../../../utils/utils'

import AvatarGroup from '../../../../components/BaseUI/AvatarGroup'
import Button from '../../../../components/BaseUI/Button'
import Lozenge from '../../../../components/BaseUI/Lozenge'
import { Table, Td, Tr } from '../../../../components/BaseUI/Table'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'

import { FiDownloadCloud } from 'react-icons/fi'
import { MdOutlineEmail } from 'react-icons/md'

import { headers, invoices } from './data'

import styles from './BillingAndPlan.module.scss'

export default function BillingAndPlan() {
  const [users, setUsers] = useState([])

  const formatValue = useFormatValue
  const formatDate = useFormattedDate

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAllUsers()

      setUsers(users)
    }

    fetchData()
  }, [])

  return (
    <Container className={styles['billing-and-plan']}>
      <ContainerItem sm={4} md={8} xl={6}>
        <div className={styles['billing-and-plan__card']}>
          <div className={styles['card-header']}>
            <div>
              <h5 className={styles['card-header__title']}>Basic Plan</h5>
              <p className={styles['card-header__description']}>
                Our most popular plan for small teams.
              </p>
            </div>

            <p className={styles['card-header__value']}>
              <span>{formatValue(20, 'money')}</span> per month
            </p>
          </div>

          <div className={styles['card-body']}>
            <AvatarGroup data={users?.slice(0, 12)} max={7} />

            <div className={styles['card-body__quantity']}>12 of 20 users</div>
          </div>

          <div className={styles['card-footer']}>
            <Button appearance="neutral" size="small">
              Upgrade plan
            </Button>
          </div>
        </div>
      </ContainerItem>

      <ContainerItem sm={4} md={8} xl={6}>
        <div className={styles['billing-and-plan__card']}>
          <div className={styles['card-header']}>
            <div>
              <h5 className={styles['card-header__title']}>Payment Method</h5>
              <p className={styles['card-header__description']}>
                Change how you pay for your plan.
              </p>
            </div>
          </div>

          <div
            className={`${styles['card-body']} ${styles['card-body__padding-xl']}`}
          >
            <div className={styles['card-body__item-box']}>
              <div>
                <img src={useRequire('brands/matercard-2.png')} alt="" />
              </div>

              <div className="d-flex align-items-start justify-content-between w-100">
                <div className={styles['card-info']}>
                  <div className="d-flex align-items-end gap-2">
                    <div className={styles['card-info__name']}>Master Card</div>
                    <div className={styles['card-info__number']}>
                      **** **** **** 2918
                    </div>
                  </div>
                  <div className={styles['card-info__expire']}>
                    Expire on 09/2027
                  </div>
                  <div className={styles['card-info__email']}>
                    <MdOutlineEmail />
                    billing@magnun.pro
                  </div>
                </div>

                <div>
                  <Button appearance="neutral" size="small">
                    Change
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContainerItem>

      <ContainerItem sm={4} md={8} xl={12} className="mt-3">
        <Table
          title="Billing History"
          columns={headers}
          tableId="customer-list"
          className="card-content"
          disableColumnMenu
          disableExport
          disableColumnResize
        >
          {invoices?.map((invoice, index) => (
            <Tr key={index} id={index}>
              <Td>{invoice?.id}</Td>
              <Td>{formatDate(invoice?.billingDate, 'DD/MM/YYYY')}</Td>
              <Td>{invoice?.plan}</Td>
              <Td>{formatValue(invoice?.amount, 'money')}</Td>
              <Td>
                <div className={styles['invoice-status']}>
                  <Lozenge
                    appearance={
                      invoice?.status === 'Paid'
                        ? 'success-subtle'
                        : 'warning-subtle'
                    }
                  >
                    {invoice?.status}
                  </Lozenge>

                  <button className={styles['invoice-status__button']}>
                    <FiDownloadCloud />
                    Download
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </ContainerItem>
    </Container>
  )
}
