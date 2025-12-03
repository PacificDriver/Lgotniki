import React, { useState, useEffect } from 'react'

import { translate } from '../../../hooks/translate'
import { useFormatValue } from '../../../hooks/useFormatValue'
import { useFormattedDate } from '../../../hooks/useFormattedDate'

import { getTransactionsByLimit } from '../../../services/transactions'
import { getAllUsers } from '../../../services/users'

import AppPage from '../../../components/CustomUI/AppPage'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import CardInfo from '../../../components/CustomUI/CardInfo'
import ApexChart from '../../../components/CustomUI/Charts/ApexChart'
import { Table, Tr, Td } from '../../../components/BaseUI/Table'
import Image from '../../../components/CustomUI/Image'
import Avatar from '../../../components/CustomUI/Avatar'

import {
  cardInfo,
  filterOptions,
  totalSalesData,
  satisficationData,
  satisficationOptions,
  topTrafficData,
  headersTransaction,
  transactionsIcons,
  incomeAndExpansesdata,
} from './data'

import styles from './Crm.module.scss'
import Lozenge from '../../../components/BaseUI/Lozenge'
import StatisticalOverviewCard from '../../../widgets/StatisticalOverviewCard'
import DataStatusCard from '../../../widgets/DataStatusCard'
import MetricOverview from '../../../widgets/MetricOverview'
import SegmentDistribution from '../../../widgets/SegmentDistribution'
import ProgressIndicator from '../../../widgets/ProgressIndicator'
import QuickSummary from '../../../widgets/QuickSummary'

export default function Crm() {
  const [totalSale, setTotalSales] = useState(totalSalesData.daily)
  const [satisfication, setSatisfication] = useState(satisficationData.lastWeek)
  const [topTraffic, setTopTraffic] = useState(satisficationOptions[0].value)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [users, setUsers] = useState([])

  const formatValue = useFormatValue
  const formatDate = useFormattedDate

  useEffect(() => {
    const loadTransactions = async () => {
      const transations = await getTransactionsByLimit(8)
      setRecentTransactions(transations)
    }

    const loadUsers = async () => {
      const users = await getAllUsers(8)
      setUsers(users)
    }

    loadTransactions()
    loadUsers()
  }, [])

  const handleSelection = value => {
    const options = { d: 'daily', w: 'weekly', m: 'monthly', a: 'annually' }

    setTotalSales({ ...totalSalesData[options[value]] })
  }

  return (
    <AppPage title="CRM Dashboard" className={styles['crm-container']}>
      <Container>
        <ContainerItem sm={4} md={6} xl={8}>
          <Container className="mb-3">
            {cardInfo?.map((card, index) => (
              <ContainerItem key={index} sm={4} md={3} xl={4}>
                <CardInfo type="crm" card={card} appearance={card.appearance} />
              </ContainerItem>
            ))}
          </Container>

          <Container className="mb-3">
            <ContainerItem sm={4} md={8} xl={12}>
              <ApexChart
                title={translate('DASHBOARD.CHANNELS')}
                type="line"
                categories={totalSale?.categories}
                series={totalSale?.series}
                colors={['#375cf9', '#ffc35a', '#fa5c7c']}
                legend
                direction="bottom"
                alignment="center"
                height={300}
                filter={filterOptions}
                onSelected={value => handleSelection(value)}
              />
            </ContainerItem>
          </Container>
        </ContainerItem>

        <ContainerItem sm={4} md={2} xl={4}>
          <Container className="mb-3">
            <ContainerItem sm={4} md={8} xl={12}>
              <ApexChart
                title={translate('DASHBOARD.SATISFICATION')}
                type="line"
                categories={satisfication?.categories}
                series={satisfication?.series}
                colors={['#8c62ff', '#0caf60', '#0062ff']}
                direction="bottom"
                alignment="center"
                height={190}
                filter={satisficationOptions}
                onSelected={value => setSatisfication(satisficationData[value])}
                defaultFilter={satisficationOptions[0].name}
              />
            </ContainerItem>
          </Container>

          <Container className="mb-3">
            <ContainerItem sm={4} md={8} xl={12}>
              <QuickSummary
                title={translate('DASHBOARD.TOP_TRAFFIC')}
                filters={satisficationOptions?.map(option => ({
                  ...option,
                  label: option.name,
                }))}
                categories={topTrafficData?.categories}
                dataset={topTrafficData?.dataset[topTraffic]}
                onFiltered={value => setTopTraffic(value)}
              />
            </ContainerItem>
          </Container>
        </ContainerItem>
      </Container>

      <Container className="mb-3">
        <ContainerItem sm={4} md={4} xl={6}>
          <Container>
            <ContainerItem sm={4} md={8} xl={12}>
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
                chartHeight={200}
              />
            </ContainerItem>
            <ContainerItem sm={4} md={8} xl={12}>
              <ProgressIndicator
                title={translate('DASHBOARD.TASK_COMPLETETION_RATE')}
                description={translate('DASHBOARD.TASK_COMPLETETION_RATE_MSG')}
                currentValue={92}
                previousValue={84}
                color="#43b79a"
                users={users?.slice(0, 5)}
              />
            </ContainerItem>
          </Container>
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={6}>
          <Container>
            <ContainerItem sm={4} md={8} xl={12}>
              <DataStatusCard
                title={translate('DASHBOARD.STOCK_AVABILITY')}
                subtitles={{
                  labels: [
                    translate('DASHBOARD.TOTAL_ASSET'),
                    translate('DASHBOARD.TOTAL_PRODUCT'),
                  ],
                  values: [
                    { value: 53000, typeOfInformation: 'money' },
                    { value: 1442, typeOfInformation: 'number' },
                  ],
                }}
                dataset={{
                  categories: [
                    translate('DASHBOARD.AVAILABLE'),
                    translate('DASHBOARD.LOW_STOCK'),
                    translate('DASHBOARD.OUT_OF_STOCK'),
                  ],
                  values: [1863, 1023, 302],
                  colors: ['#0EC66D', '#fcb900', '#ff3d74'],
                  typeOfInformation: 'number',
                }}
              ></DataStatusCard>
            </ContainerItem>

            <ContainerItem sm={4} md={8} xl={12}>
              <SegmentDistribution
                title={translate('DASHBOARD.SALES_BY_CHANNELS')}
                dataset={{
                  categories: [
                    translate('DASHBOARD.DIRECT'),
                    translate('DASHBOARD.SOCIAL'),
                  ],
                  series: {
                    data: {
                      currentValue: [1192, 602],
                      previousValue: [1138, 614.8],
                    },
                  },
                  typeOfInformation: 'number',
                }}
                colors={['#0EC66D', '#fcb900']}
              />
            </ContainerItem>
          </Container>
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={6}>
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

        <ContainerItem sm={4} md={4} xl={6}>
          <ProgressIndicator
            title={translate('DASHBOARD.TASK_COMPLETETION_RATE')}
            description={translate('DASHBOARD.TASK_COMPLETETION_RATE_MSG')}
            currentValue={92}
            previousValue={84}
            color="#43b79a"
            users={users?.slice(0, 8)}
            userLimit={5}
          />
        </ContainerItem>
      </Container>

      <Container>
        <ContainerItem sm={4} md={8} xl={12}>
          <Table
            title={translate('Recent Transactions')}
            columns={headersTransaction}
            tableId="recent-transaction"
            disableColumnMenu
            disableExport
          >
            {recentTransactions?.map((transaction, index) => (
              <Tr key={index} id={transaction?.id || index}>
                <Td>
                  <Image
                    src={transaction?.image}
                    alt={transaction.name}
                    className={styles['image']}
                  />
                  <div>{transaction.name}</div>
                </Td>
                <Td>
                  {formatDate(transaction.createdAt, 'MMMM DD, YYYY hh:mm A')}
                </Td>
                <Td>
                  <span className={styles['transaction-icon']}>
                    {transactionsIcons[transaction?.transactionType]}
                  </span>
                  <span className={styles['transaction-name']}>
                    {transaction?.transactionType}
                  </span>
                </Td>
                <Td>{formatValue(transaction?.amount, 'money')}</Td>
                <Td>
                  <Avatar
                    src={transaction.user.image}
                    name={transaction.user.name}
                    size="default"
                  />
                  <span>{transaction.user.name}</span>
                </Td>
                <Td>
                  <Lozenge
                    appearance={
                      transaction.status === 'Completed'
                        ? 'success-subtle'
                        : 'danger-subtle'
                    }
                  >
                    {transaction.status}
                  </Lozenge>
                </Td>
              </Tr>
            ))}
          </Table>
        </ContainerItem>
      </Container>
    </AppPage>
  )
}
