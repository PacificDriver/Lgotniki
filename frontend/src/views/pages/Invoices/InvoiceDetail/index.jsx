import React from 'react'

import { useFormatValue as formatValue } from '../../../../hooks/useFormatValue'

import Avatar from '../../../../components/CustomUI/Avatar'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'
import { useRequire } from '../../../../utils/utils'

import { invoiceItems } from '../data'

import { translate } from '../../../../hooks/translate'
import styles from './InvoiceDetail.module.scss'

export default function InvoiceDetail() {
  return (
    <div className={styles['invoice-detail']}>
      <Container>
        <ContainerItem
          sm={4}
          md={5}
          xl={12}
          className={`card ${styles['invoice-detail__custom-card']}`}
        >
          <div className={styles['customer-info']}>
            <div className={styles['customer-info__user']}>
              <Avatar
                src={useRequire('brands/mailchimp.jpg')}
                appearance="square"
              />

              <div className={styles['personal-info']}>
                <span>Innovatech Solutions LTDA</span>
                <span>support@innovatechsolutions.com</span>
              </div>
            </div>

            <div className="weight-600">#INV842020</div>
          </div>

          <div className={styles['invoice-info']}>
            <div className="d-flex justify-content-between gap-2 w-100">
              <div className={styles['invoice-info__sender']}>
                <h4>{translate('INVOICES.SENDER')}</h4>

                <div className={styles['user']}>
                  <div>
                    <Avatar src={useRequire('extras/background.png')} />
                  </div>

                  <div className={styles['user__info']}>
                    <span>Luminous Creations</span>
                    <span>Avenue of Light, Cityville BR</span>
                    <span>contact@luminouscreations.com</span>
                  </div>
                </div>
              </div>

              <div className={styles['invoice-info__customer']}>
                <h4>{translate('ECOMMERCE.CLIENT')}</h4>

                <div className={styles['user']}>
                  <div className={styles['user__info']}>
                    <span>Innovatech Solutions LTDA</span>
                    <span>Brightway Lane, Los Angeles, USA</span>
                    <span>support@innovatechsolutions.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles['invoice-info__detail']}>
              <h4>{translate('INVOICES.INVOICE_DETAIL')}</h4>

              <Container>
                <ContainerItem
                  sm={4}
                  md={4}
                  xl={3}
                  className={styles['invoice-info__detail__item']}
                >
                  <span>{translate('INVOICES.INVOICE_NUMBER')}</span>
                  <span>IN9838383</span>
                </ContainerItem>

                <ContainerItem
                  sm={4}
                  md={4}
                  xl={3}
                  className={styles['invoice-info__detail__item']}
                >
                  <span>{translate('INVOICES.ISSUE_DATE')}</span>
                  <span>28 de Junho, 2024</span>
                </ContainerItem>

                <ContainerItem
                  sm={4}
                  md={4}
                  xl={3}
                  className={styles['invoice-info__detail__item']}
                >
                  <span>{translate('INVOICES.DUE_DATE')}</span>
                  <span>28 de Junho, 2024</span>
                </ContainerItem>

                <ContainerItem
                  sm={4}
                  md={4}
                  xl={3}
                  className={styles['invoice-info__detail__item']}
                >
                  <span>{translate('INVOICES.BILLING_CURRENCY')}</span>
                  <span>USD ($)</span>
                </ContainerItem>
              </Container>
            </div>
          </div>

          <div className={styles['invoice-items']}>
            <h5>{translate('INVOICES.ITEMS')}</h5>

            <div className="d-flex flex-column gap-1 mt-3">
              {invoiceItems?.map((item, index) => (
                <div key={index} className={styles['invoice-items__item']}>
                  <div className="w-35">{item?.name}</div>
                  <div className={styles['invoice-items__item__quantity']}>
                    {item?.quantity}
                  </div>
                  <div className="w-35 d-flex justify-content-end">
                    {formatValue(item?.amount, 'money', 2)}
                  </div>
                </div>
              ))}

              <div className="d-flex align-items-center justify-content-between">
                <h6 className="size-12 weight-500">
                  {translate('INVOICES.SUB_TOTAL')}
                </h6>
                <span className={styles['invoice-items__subtotal']}>
                  {formatValue(
                    invoiceItems.reduce(
                      (accumulator, item) => accumulator + item.amount,
                      0
                    ),
                    'money',
                    2
                  )}
                </span>
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <h6 className="size-12 weight-500">
                  {translate('INVOICES.DISCOUNT')} (10%)
                </h6>
                <span className={styles['invoice-items__discount']}>
                  {formatValue(
                    invoiceItems.reduce(
                      (accumulator, item) => accumulator + item.amount,
                      0
                    ) * 0.1,
                    'money',
                    2
                  )}
                </span>
              </div>
            </div>
          </div>
        </ContainerItem>
      </Container>
    </div>
  )
}
