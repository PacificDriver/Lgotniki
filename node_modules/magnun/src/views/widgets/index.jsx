import React, { useEffect, useState } from 'react'

import { getTransactionsByLimit } from '../../services/transactions'
import { getAllUsers } from '../../services/users'

import AppPage from '../../components/CustomUI/AppPage'
import Container from '../../components/CustomUI/Container'
import ContainerItem from '../../components/CustomUI/Container/ContainerItem'

import { incomeAndExpansesdata } from '../pages/Crm/data'

import DataStatusCard from '../../widgets/DataStatusCard'
import ForecastDisplay from '../../widgets/ForecastDisplay'
import FunnelConversion from '../../widgets/FunnelConversion'
import GoalTracker from '../../widgets/GoalTracker'
import MetricOverview from '../../widgets/MetricOverview'
import ProgressIndicator from '../../widgets/ProgressIndicator'
import SegmentDistribution from '../../widgets/SegmentDistribution'
import StatisticalOverviewCard from '../../widgets/StatisticalOverviewCard'
import TopListOverview from '../../widgets/TopListOverview'

export default function Widgets() {
  const [, setRecentTransactions] = useState([])
  const [users, setUsers] = useState([])

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

  return (
    <AppPage title="Widgets">
      <Container className="mb-3">
        <ContainerItem xl={6}>
          <StatisticalOverviewCard
            title="Income & Expanses"
            subtitles={{
              labels: ['Total income', 'Total expanses'],
              values: {
                currentValue: [1412, 612.34],
                previousValue: [1356, 634.23],
              },
              colors: ['#89cc93', '#ffb713'],
            }}
            dataset={incomeAndExpansesdata}
          />
        </ContainerItem>

        <ContainerItem xl={6}>
          <ForecastDisplay
            title="Revenue Forecast"
            value={{
              amount: 3538,
              typeOfInformation: 'money',
            }}
            description='<span className="d-flex">Your revenue forecast for the current month of <span class="u-text-red weight-500">$8,382</span></span>'
            subtitles={{
              labels: ['Total income', 'Total expanses'],
              values: {
                currentValue: [1412, 612.34],
                previousValue: [1356, 634.23],
              },
              colors: ['#89cc93', '#ffb713'],
            }}
            dataset={incomeAndExpansesdata}
          />
        </ContainerItem>

        <ContainerItem xl={6}>
          <DataStatusCard
            title="Stock Avability"
            subtitles={{
              labels: ['Total asset', 'Total product'],
              values: [
                { value: 53000, typeOfInformation: 'money' },
                { value: 1442, typeOfInformation: 'number' },
              ],
            }}
            dataset={{
              categories: ['Available', 'Low Stock', 'Out of stock'],
              values: [1863, 1023, 302],
              colors: ['#0EC66D', '#fcb900', '#ff3d74'],
            }}
          ></DataStatusCard>
        </ContainerItem>

        <ContainerItem xl={6}>
          <MetricOverview
            title="Sales Revenue"
            description='<span className="d-flex ">Your income decreased this month by about <span class="u-text-red weight-500">$421</span></span>'
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

        <ContainerItem xl={6}>
          <SegmentDistribution
            title="Customer Segmentation"
            dataset={{
              categories: ['Low Touch', 'Mid Touch', 'High Touch'],
              series: {
                data: {
                  currentValue: [1192, 602, 483],
                  previousValue: [1138, 614.8, 479],
                },
              },
            }}
            colors={['#0EC66D', '#fcb900', '#ff3d74']}
          />
        </ContainerItem>

        <ContainerItem xl={6}>
          <TopListOverview
            title="Top 5 Country Sales Overview"
            description="Some of your employees will complete the work on time."
            dataset={{
              categories: ['Sessions', 'Bounce Rates'],
              data: [
                {
                  label: 'USA',
                  image:
                    'https://cdn-icons-png.freepik.com/512/13481/13481822.png?ga=GA1.1.783581571.1690915860',
                  values: [2908, 534],
                  color: '#6482ee',
                },
                {
                  label: 'Brasil',
                  image:
                    'https://cdn-icons-png.freepik.com/512/14272/14272199.png?ga=GA1.1.783581571.1690915860',
                  values: [1234, 627],
                },
                {
                  label: 'Germany',
                  image:
                    'https://cdn-icons-png.freepik.com/512/11948/11948652.png?ga=GA1.1.783581571.1690915860',
                  values: [2908, 534],
                  color: '#6482ee',
                },
                {
                  label: 'Italy',
                  image:
                    'https://cdn-icons-png.freepik.com/512/6176/6176300.png?ga=GA1.1.783581571.1690915860',
                  values: [983, 627],
                },
                {
                  label: 'Luxembourg',
                  image:
                    'https://cdn-icons-png.freepik.com/512/330/330650.png?ga=GA1.1.783581571.1690915860',
                  values: [635, 627],
                },
              ],
            }}
            colors={['#6482ee', '#bfc8f8']}
            values={{
              current: 64450,
              previous: 9822.18,
              typeOfInformation: 'money',
            }}
          />
        </ContainerItem>

        <ContainerItem xl={4}>
          <FunnelConversion
            title="Conversion Rates"
            metrics={[
              {
                label: 'Visitors',
                currentValue: 12565,
                previousValue: 10141,
                color: '#43b79a',
              },
              {
                label: 'Product sales',
                currentValue: 1421,
                previousValue: 1529,
                color: '#f9c94c',
              },
            ]}
          />
        </ContainerItem>

        <ContainerItem xl={4}>
          <ProgressIndicator
            title="Task Completetion Rate"
            description="Almost all tasks were completed on time."
            currentValue={92}
            previousValue={84}
            color="#43b79a"
            users={users?.slice(0, 5)}
          />
        </ContainerItem>

        <ContainerItem xl={4}>
          <GoalTracker
            title="Sales Target"
            description="You will reach less than 20% of your sales target."
            dataset={{
              categories: ['Alcançadas', 'Não alcançadas'],
              series: {
                values: [3415, 585],
                target: 4000,
              },
            }}
            colors={['#fcb900', '#EBEBEF']}
          />
        </ContainerItem>
      </Container>
    </AppPage>
  )
}
