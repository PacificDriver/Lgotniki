import React, { useState } from 'react'

import { translate } from '../../../hooks/translate'
import { useFormatValue } from '../../../hooks/useFormatValue'

import ListGroup from '../../../components/BaseUI/ListGroup'
import ListItem from '../../../components/BaseUI/ListGroup/ListItem'
import Lozenge from '../../../components/BaseUI/Lozenge'
import { Table, Td, Tr } from '../../../components/BaseUI/Table'
import AppPage from '../../../components/CustomUI/AppPage'
import CardContainer from '../../../components/CustomUI/CardContainer'
import CardInfo from '../../../components/CustomUI/CardInfo'
import ApexChart from '../../../components/CustomUI/Charts/ApexChart'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import Picture from '../../../components/CustomUI/Picture'
import { Toast, ToastContainer } from '../../../components/CustomUI/Toast'

import {
  MdCached,
  MdOutlineAccountBalanceWallet,
  MdOutlineInventory2,
  MdOutlineLocalMall,
} from 'react-icons/md'

import productsJSON from '../../../mocks/products.json'

import { filterOptions, lifetimeSalesData } from './data'

import FunnelConversion from '../../../widgets/FunnelConversion'
import MetricOverview from '../../../widgets/MetricOverview'
import SegmentDistribution from '../../../widgets/SegmentDistribution'
import StatisticalOverviewCard from '../../../widgets/StatisticalOverviewCard'
import { incomeAndExpansesdata } from '../Crm/data'
import styles from './Ecommerce.module.scss'

const Ecommerce = () => {
  const format = useFormatValue

  const [products] = useState(productsJSON)
  const [toasts, setToasts] = useState([])
  const [lifetimeSales, setLifetimeSales] = useState(lifetimeSalesData.daily)

  const strokedGauge = {
    series: [81],
    options: {},
  }

  const headers = [
    { name: translate('UI.NAME'), dataType: 'text' },
    { name: translate('UI.CATEGORY'), dataType: 'option' },
    { name: translate('UI.PRICE'), dataType: 'between' },
    { name: translate('UI.STOCK'), dataType: 'between' },
    { name: translate('UI.SALES'), dataType: 'between' },
    { name: translate('UI.STATUS'), dataType: 'option' },
    { name: translate('UI.CREATED'), dataType: 'date' },
  ]

  const cardInfo = [
    {
      title: translate('DASHBOARD.TODAYS_SALES'),
      type: 'money',
      value: 3229228.7,
      percentage: 4.85,
      icon: <MdOutlineLocalMall />,
      money: true,
      appearance: 'success',
    },
    {
      title: translate('DASHBOARD.TODAYS_RECIPE'),
      type: 'money',
      value: 1722532.09,
      percentage: -1.64,
      icon: <MdOutlineAccountBalanceWallet />,
      money: true,
      appearance: 'danger',
    },
    {
      title: translate('DASHBOARD.TODAYS_ORDERS'),
      type: 'number',
      value: 3427,
      percentage: 2.02,
      icon: <MdOutlineInventory2 />,
      money: true,
      appearance: 'warning',
    },
    {
      title: translate('DASHBOARD.CONVERSION'),
      type: 'percentage',
      value: 28,
      percentage: 4.85,
      icon: <MdCached />,
      money: true,
    },
  ]

  const donutChat = {
    series: [28283.81, 93723.14, 16059.78],
    labels: [
      translate('DASHBOARD.DIRECT'),
      translate('DASHBOARD.SOCIAL'),
      translate('DASHBOARD.ORGANIC_RESEARCH'),
    ],
    options: {
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
          },
        },
      },
    },
  }

  const removeToastAutoDismiss = () => {
    toasts?.shift()

    setToasts([...toasts])
  }

  const handleLifetimeSales = value => {
    const options = { d: 'daily', w: 'weekly', m: 'monthly', a: 'annually' }

    setLifetimeSales({ ...lifetimeSalesData[options[value]] })
  }

  return (
    <AppPage
      title="Welcome to Dashboard"
      className={styles['ecommerce-container']}
    >
      <Container className="mb-3">
        {cardInfo?.map((card, index) => (
          <ContainerItem key={index} sm={4} md={4} xl={3}>
            <CardInfo
              type="eccomerce"
              card={card}
              appearance={card.appearance}
            />
          </ContainerItem>
        ))}
      </Container>

      <Container>
        <ContainerItem sm={4} md={5} xl={8}>
          <ApexChart
            title={translate('DASHBOARD.LIFETIME_SALES')}
            type="barStacked"
            options={lifetimeSales.categories}
            categories={lifetimeSales.categories}
            series={lifetimeSales.series}
            colors={['#6988fa', '#f89d3d', '#34c38f']}
            legend={true}
            direction="top"
            alignment="left"
            roundedMarkers={true}
            filter={filterOptions}
            height={300}
            typeOfInformation="money"
            onSelected={value => handleLifetimeSales(value)}
          />
        </ContainerItem>

        <ContainerItem sm={4} md={3} xl={4}>
          <SegmentDistribution
            title={translate('DASHBOARD.SALES_BY_CHANNELS')}
            dataset={{
              categories: [
                translate('DASHBOARD.STORE_SALES'),
                translate('DASHBOARD.WEBSITE_SALES'),
                translate('DASHBOARD.APP_SALES'),
                translate('DASHBOARD.PHONE_SALES'),
              ],
              series: {
                data: {
                  currentValue: [1192, 602, 483, 483],
                  previousValue: [1138, 614.8, 479, 483],
                },
              },
              typeOfInformation: 'number',
            }}
            colors={['#6988fa', '#f89d3d', '#34c38f', '#ff3d74']}
          />
        </ContainerItem>
      </Container>

      <Container>
        <ContainerItem
          sm={4}
          md={4}
          xl={4}
          className={styles['stroked__gauge']}
        >
          <ApexChart
            title={translate('DASHBOARD.RECENT_ORDERS')}
            type="strokedGauge"
            options={strokedGauge.options}
            series={strokedGauge.series}
            colors={['#6988fa']}
            filter={filterOptions}
            className={styles['reset__shadow']}
            height={180}
            padding={{ top: 0, right: 0, bottom: 0, left: 0 }}
          />

          <div className={`${styles['stroked__gauge__legend']}`}>
            <div className="d-flex flex-column">
              <span className={styles['legend__quantity']}>
                {format(3891, 'number')}
              </span>

              <div className="d-flex align-items-center">
                <div className={styles['legend__marker']}></div>
                <span>{translate('UI.DELIVERED')}</span>
              </div>
            </div>

            <div className="d-flex flex-column">
              <span className={styles['legend__quantity']}>
                {format(564, 'number')}
              </span>

              <div className="d-flex align-items-center">
                <div
                  className={`${styles['legend__marker']} ${styles['legend__marker--canceled']}`}
                ></div>
                <span>{translate('UI.CANCELED')}</span>
              </div>
            </div>
          </div>
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={4} className="mt-3">
          <ApexChart
            title={translate('DASHBOARD.RECIPES_BY_CHANNELS')}
            type={'donut'}
            options={donutChat.options}
            series={donutChat.series}
            labels={donutChat.labels}
            legend={true}
            height={245}
            colors={['#C0C6CF', '#005FED', '#F5CD47']}
            alignment="bottom"
            filter={filterOptions}
            typeOfInformation="number"
          />
        </ContainerItem>

        <ContainerItem sm={4} md={8} xl={4} className="mt-3">
          <CardContainer title={translate('DASHBOARD.RECENT_ORDERS')}>
            <ListGroup borderless={true}>
              {productsJSON?.slice(0, 4)?.map((product, index) => (
                <ListItem key={index} className="px-3">
                  <div className="d-flex align-items-center gap-1 u-ellipsis">
                    <Picture image={product?.image} name={product?.name} />
                    <div className="u-ellipsis" title={product?.name}>
                      {product.name}
                    </div>
                  </div>

                  <div>{format(product?.price, 'money')}</div>
                </ListItem>
              ))}
            </ListGroup>
          </CardContainer>
        </ContainerItem>
      </Container>

      <Container className="mt-3">
        <ContainerItem sm={4} md={8} xl={6}>
          <StatisticalOverviewCard
            title={translate('DASHBOARD.INCOME_AND_EXPENSES')}
            subtitles={{
              labels: [
                translate('DASHBOARD.TOTAL_INCOME'),
                translate('DASHBOARD.TOTAL_EXPANSES'),
              ],
              values: {
                currentValue: [1412, 612.34],
                previousValue: [1356, 634.23],
              },
              colors: ['#89cc93', '#ffb713'],
            }}
            dataset={incomeAndExpansesdata}
          />
        </ContainerItem>

        <ContainerItem sm={4} md={8} xl={6}>
          <Container>
            <ContainerItem sm={4} md={8} xl={12}>
              <FunnelConversion
                title={translate('DASHBOARD.CONVERSION_RATES')}
                metrics={[
                  {
                    label: translate('UI.VISITORS'),
                    currentValue: 12565,
                    previousValue: 10141,
                    color: '#43b79a',
                  },
                  {
                    label: translate('DASHBOARD.PRODUCT_SALES'),
                    currentValue: 1421,
                    previousValue: 1529,
                    color: '#f9c94c',
                  },
                ]}
              />
            </ContainerItem>

            <ContainerItem sm={4} md={8} xl={12}>
              <MetricOverview
                title={translate('DASHBOARD.SALES_REVENUE')}
                description={`<span className="d-flex ">${translate('DASHBOARD.SALES_REVENUE_MSG')} <span class="u-text-red weight-500">$421</span></span>`}
                value={{
                  amount: 5832,
                  typeOfInformation: 'money',
                }}
                dataset={{
                  categories: ['Jan', 'Jun', 'Set', 'Dez'],
                  values: {
                    data: [1863, 1023, 302, 804],
                    typeOfInformation: 'money',
                  },
                }}
                color="#ef7496"
              />
            </ContainerItem>
          </Container>
        </ContainerItem>
      </Container>

      <Container>
        <ContainerItem sm={4} md={8} xl={12} className="mt-3">
          <Table
            title={translate('ECOMMERCE.PRODUCT_LIST')}
            columns={headers}
            tableId="product-list"
            checkboxSelection
            disableColumnMenu
          >
            {products.map((product, index) => (
              <Tr key={index} id={product?.id || index}>
                <Td>
                  <div className="d-flex align-items-center gap-1">
                    <Picture image={product.image} minWidth="25px" />
                    <span>{product.name}</span>
                  </div>
                </Td>
                <Td>
                  <Lozenge appearance="info-subtle">
                    {product.category === 'Calçados'
                      ? translate('UI.FOOTWEAR')
                      : translate('UI.FURNITURE')}
                  </Lozenge>
                </Td>
                <Td>{format(product?.price, 'money')}</Td>
                <Td>
                  <Lozenge appearance="info-subtle">
                    {format(product.stock, 'number')}
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
                      product.status ? 'success-subtle' : 'danger-subtle'
                    }
                  >
                    {product.status === 1
                      ? translate('UI.ACTIVE')
                      : translate('UI.INACTIVE')}
                  </Lozenge>
                </Td>
                <Td>{format(product?.createdDate, 'date')}</Td>
              </Tr>
            ))}
          </Table>
        </ContainerItem>
      </Container>

      <ToastContainer autoDismiss onDismissed={removeToastAutoDismiss}>
        {toasts?.map((toast, index) => (
          <Toast {...toast} key={index} />
        ))}
      </ToastContainer>
    </AppPage>
  )
}

export default Ecommerce
