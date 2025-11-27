import React, { useEffect, useState } from 'react'

import { useFormatValue } from '../../../hooks/useFormatValue'
import useTranslate from '../../../hooks/useTranslate'
import { getAllUsers } from '../../../services/users'
import { useRequire } from '../../../utils/utils'

import AppPage from '../../../components/CustomUI/AppPage'
import CardInfoAnalytic from '../../../components/CustomUI/CardInfoAnalytic'
import ApexChart from '../../../components/CustomUI/Charts/ApexChart'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import Maps from '../../../components/CustomUI/Maps'
import ProgressIndicator from '../../../widgets/ProgressIndicator'
import QuickSummary from '../../../widgets/QuickSummary'

import { translate } from '../../../hooks/translate'
import MetricOverview from '../../../widgets/MetricOverview'
import styles from './Analytics.module.scss'

const Analytics = () => {
  const formatValue = useFormatValue
  const [users, setUsers] = useState([])

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getAllUsers(8)
      setUsers(users)
    }

    loadUsers()
  }, [])

  const splineAreaChart = {
    options: {
      xaxis: {
        categories: ['Set', 'Out', 'Nov', 'Dec', 'Jan', 'Fev'],
        tooltip: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: useTranslate('UI.SALES'),
        data: [4000, 4500, 4300, 4800, 4600, 5600],
        typeOfInformation: 'money',
      },
      {
        name: useTranslate('UI.REVENUE'),
        data: [2000, 3500, 5300, 4600, 4800, 5200],
        typeOfInformation: 'money',
      },
    ],
  }

  const netIncome = {
    title: useTranslate('UI.USERS'),
    currentValue: 34827,
    previousValue: 27489,
    chart: 'multiBar',
    type: 'number',
    options: {
      xaxis: {
        categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
        tooltip: {
          enabled: false,
        },
        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
    },
    series: [
      {
        name: useTranslate('UI.PLURAL_ACTIVE'),
        data: [3800, 2400, 4600, 1000, 3300, 2200],
        typeOfInformation: 'number',
      },
      {
        name: useTranslate('UI.PLURAL_INACTIVE'),
        data: [480, 167, 78, 120, 478, 198],
        typeOfInformation: 'number',
      },
    ],
    colors: ['#32A877', '#DEE0E5'],
  }

  const totalRevenue = {
    title: useTranslate('UI.VISITORS'),
    currentValue: 29283,
    previousValue: 29012,
    chart: 'area',
    type: 'number',
    options: {
      xaxis: {
        categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
        tooltip: {
          enabled: false,
        },
        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
    },
    series: [
      {
        name: useTranslate('UI.REVENUE'),
        data: [2000, 3300, 2200, 3800, 2400, 4600],
        typeOfInformation: 'number',
      },
    ],
    colors: ['#57D9A4'],
  }

  const totalPuchasement = {
    title: useTranslate('DASHBOARD.CONVERSATION_VERSES_REJECTION'),
    currentValue: 8.76,
    previousValue: 6.25,
    chart: 'area',
    type: 'percentage',
    options: {
      xaxis: {
        categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
        tooltip: {
          enabled: false,
        },
        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
    },
    series: [
      {
        name: useTranslate('DASHBOARD.CONVERSION'),
        data: [200, 330, 220, 380, 240, 460],
        typeOfInformation: 'number',
      },
      {
        name: useTranslate('DASHBOARD.REJECTION'),
        data: [67, 41, 242, 176, 76, 210],
        typeOfInformation: 'number',
      },
    ],
    colors: ['#ef7694', '#a456d3'],
  }

  const totalPuchasement2 = {
    title: useTranslate('DASHBOARD.REVENUE_PER_DEVICE'),
    currentValue: 29283,
    previousValue: 30489,
    chart: 'barStacked',
    type: 'number',
    options: {
      xaxis: {
        categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
        tooltip: {
          enabled: false,
        },
        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
    },
    series: [
      {
        name: 'Desktop',
        data: [121, 60, 68, 130, 45, 210, 167, 71],
        typeOfInformation: 'number',
      },
      {
        name: 'Mobile',
        data: [89, 60, 68, 130, 45, 210, 167, 71],
        typeOfInformation: 'number',
      },
      {
        name: 'Tablet',
        data: [112, 19, 7, 32, 11, 87, 44, 23],
        typeOfInformation: 'number',
      },
    ],
    colors: ['#FF8B01', '#ef7496', '#36B37F'],
  }

  const salesByRegion = {
    categories: [
      {
        name: useTranslate('COUNTRIES.CHINA'),
        image: useRequire('countries/china.png'),
        color: '#8c62ff',
      },
      {
        name: useTranslate('COUNTRIES.FRANCE'),
        image: useRequire('countries/frança.png'),
        color: '#0caf60',
      },
      {
        name: useTranslate('COUNTRIES.ARGENTINA'),
        image: useRequire('countries/argentina.png'),
        color: '#0062ff',
      },
      {
        name: useTranslate('COUNTRIES.BRAZIL'),
        image: useRequire('countries/brasil-lg.png'),
        color: '#ffc35a',
      },
      {
        name: useTranslate('COUNTRIES.UNITED_STATE'),
        image: useRequire('countries/estados-unidos-lg.png'),
        color: '#fa5c7c',
      },
    ],
    dataset: {
      data: [1890, 1320, 1293, 920, 901],
    },
  }

  const radialChart = {
    series: [58],
    options: {
      labels: ['Iphone X'],
    },
    colors: ['#524cff'],
  }

  const chartMap = {
    series: {
      regions: [
        {
          values: {
            CN: 1890,
            FR: 1320,
            AR: 1293,
            BR: 920,
            US: 901,
            IT: 872,
            CA: 420,
            JP: 267,
          },
        },
      ],
    },
  }

  const filterOPtions = [
    { value: 'h', name: useTranslate('UI.TODAY') },
    { value: 'w', name: useTranslate('UI.WEEK') },
    { value: 'm', name: useTranslate('UI.MONTH') },
    { value: 'a', name: useTranslate('UI.YEAR') },
  ]

  return (
    <AppPage title="Analytics Dashboard">
      <Container>
        <ContainerItem sm={4} md={4} xl={3}>
          <CardInfoAnalytic values={netIncome} />
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={3}>
          <CardInfoAnalytic values={totalRevenue} />
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={3}>
          <CardInfoAnalytic values={totalPuchasement2} />
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={3}>
          <CardInfoAnalytic values={totalPuchasement} />
        </ContainerItem>
      </Container>

      <Container className="mt-3">
        <ContainerItem sm={4} md={3} xl={4}>
          <Container>
            <ContainerItem sm={4} md={8} xl={12}>
              <ApexChart
                title={useTranslate('DASHBOARD.REVENUE_PER_DEVICE')}
                type={'barStacked'}
                options={totalPuchasement2.options}
                categories={totalPuchasement2?.options?.xaxis?.categories}
                series={totalPuchasement2.series}
                height={165}
                padding={{
                  right: 5,
                  left: 5,
                }}
                colors={['#3629B7', '#32A877', '#a75bd2']}
                filter={filterOPtions}
              />
            </ContainerItem>

            <ContainerItem
              sm={4}
              md={8}
              xl={12}
              className={styles['marketing__goal']}
            >
              <ApexChart
                title={useTranslate('DASHBOARD.MARKETING_GOAL')}
                type={'semiCircleGauge'}
                options={radialChart.options}
                series={radialChart.series}
                legend={false}
                height={180}
                colors={radialChart.colors}
                padding={{
                  bottom: 20,
                }}
                className={styles['reset-shadow']}
                filter={filterOPtions}
              />
              <div className={styles['marketing__goal__footer']}>
                <div className={styles['info']}>
                  <span className={styles['info__label']}>
                    {useTranslate('DASHBOARD.ORGANIC')}:
                  </span>
                  <span className={styles['info__value']}>
                    {formatValue(12389.9, 'money')}
                  </span>
                </div>

                <div className={styles['info']}>
                  <span className={styles['info__label']}>
                    {useTranslate('DASHBOARD.PAY')}:
                  </span>
                  <span className={styles['info__value']}>
                    {formatValue(16152.12, 'money')}
                  </span>
                </div>
              </div>
            </ContainerItem>
          </Container>
        </ContainerItem>

        <ContainerItem sm={4} md={5} xl={8}>
          <ApexChart
            title={useTranslate('DASHBOARD.SALES_REPORT')}
            type={'area'}
            options={splineAreaChart.options}
            categories={splineAreaChart?.options?.xaxis?.categories}
            series={[{ ...splineAreaChart.series[0] }]}
            legend={false}
            direction={'top'}
            alignment={'left'}
            height={375}
            padding={{
              right: 15,
              left: 15,
            }}
            colors={['#584ca5']}
            filter={filterOPtions}
          />
        </ContainerItem>
      </Container>

      <Container className="mt-3">
        <ContainerItem sm={4} md={4} xl={6}>
          <ApexChart
            title={useTranslate('DASHBOARD.ACTIVE_AND_INACTIVE_USERS')}
            type={'multiBar'}
            options={netIncome.options}
            categories={netIncome?.options?.xaxis?.categories}
            series={netIncome.series}
            legend={true}
            direction={'top'}
            alignment={'left'}
            height={340}
            padding={{
              right: 5,
              left: 5,
            }}
            colors={['#005FED', '#C0C6CF']}
            filter={filterOPtions}
          />
        </ContainerItem>

        <ContainerItem sm={4} md={4} xl={6}>
          <ApexChart
            title={useTranslate('DASHBOARD.REVENUE_PER_DEVICE')}
            type="barStacked"
            options={totalPuchasement2.options}
            categories={totalPuchasement2?.options?.xaxis?.categories}
            series={totalPuchasement2.series}
            legend={true}
            direction="top"
            alignment="right"
            height={340}
            padding={{
              right: 5,
              left: 5,
            }}
            colors={['#F47780', '#e4bc46', '#7722e1']}
            filter={filterOPtions}
          />
        </ContainerItem>
      </Container>

      <Container className="mt-3">
        <ContainerItem sm={4} md={4} xl={6}>
          <ProgressIndicator
            title={translate('DASHBOARD.TASK_COMPLETETION_RATE')}
            description={translate('DASHBOARD.TASK_COMPLETETION_RATE_MSG')}
            currentValue={92}
            previousValue={84}
            color="#43b79a"
            users={users?.slice(0, 5)}
          />
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
      </Container>

      <Container className={styles['sales__by__country']}>
        <ContainerItem sm={4} md={5} xl={8}>
          <Maps
            title={translate('DASHBOARD.SALES_BY_REGION')}
            className={styles['reset-shadow']}
            data={chartMap}
            map="word"
            content="vendas"
          />
        </ContainerItem>

        <ContainerItem sm={4} md={3} xl={4} className={styles['reset-shadow']}>
          <QuickSummary
            title={translate('DASHBOARD.TOP_TRAFFIC')}
            categories={salesByRegion?.categories}
            dataset={salesByRegion?.dataset?.data}
          />
        </ContainerItem>
      </Container>
    </AppPage>
  )
}

export default Analytics
