import React from 'react'

import { Table, Td, Tr } from '../../../../components/BaseUI/Table'
import Avatar from '../../../../components/CustomUI/Avatar'

export default function RecentDevices() {
  const headers = [
    { name: 'Browser', resizable: false },
    { name: 'Device', resizable: false },
    { name: 'Lcation', resizable: false },
    { name: 'Most recent activity', resizable: false },
  ]

  const list = [
    {
      browser: 'Chrome',
      device: 'MacBook Pro 2020',
      location: 'United States',
      time: 'Today',
      image: require('../../../../assets/browsers/chrome.png'),
    },
    {
      browser: 'Safari',
      device: 'iPad Air',
      location: 'Canada',
      time: 'Yesterday',
      image: require('../../../../assets/browsers/safari.png'),
    },
    {
      browser: 'Firefox',
      device: 'Microsoft Surface Pro 7',
      location: 'Australia',
      time: '2 days ago',
      image: require('../../../../assets/browsers/firefox.png'),
    },
    {
      browser: 'Edge',
      device: 'Dell XPS 15',
      location: 'United Kingdom',
      time: '3 days ago',
      image: require('../../../../assets/browsers/edge.png'),
    },
    {
      browser: 'Opera',
      device: 'Samsung Galaxy S21',
      location: 'Germany',
      time: '4 days ago',
      image: require('../../../../assets/browsers/opera.png'),
    },
  ]

  return (
    <div className="account-settings-container__basic-information">
      <h4>Gerencie suas atividades</h4>

      <Table columns={headers} identifier="recent_devices" disableExport>
        {list?.map((item, index) => (
          <Tr key={index}>
            <Td>
              <div className="d-flex align-items-center gap-1">
                <Avatar src={item?.image} name={item?.browser} size="small" />
                {item?.browser}
              </div>
            </Td>
            <Td>{item?.device}</Td>
            <Td>{item?.location}</Td>
            <Td>{item?.time}</Td>
          </Tr>
        ))}
      </Table>
    </div>
  )
}
