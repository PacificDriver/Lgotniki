import React from 'react'

import { useFormatValue as formatValue } from '../../../../hooks/useFormatValue'
import { useFormattedDate as formatDate } from '../../../../hooks/useFormattedDate'

import Button from '../../../../components/BaseUI/Button'
import { Table, Td, Tr } from '../../../../components/BaseUI/Table'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'

import { MdOutlineContentCopy } from 'react-icons/md'

import Toggle from '../../../../components/BaseUI/Toggle'
import { apis, headers } from './data'

export default function APIKeys() {
  return (
    <div className="px-3">
      <h1 className="title-page">API Keys</h1>
      <p className="sub-title-page">
        Centralize the management of your APIs, allowing you to monitor,
        configure, and optimize integrations simply and efficiently, ensuring
        optimal performance for your applications.
      </p>

      <Container className="mt-5">
        <ContainerItem
          sm={4}
          md={4}
          xl={6}
          className="card d-flex flex-column gap-1"
        >
          <h4 className="weight-500">How to set API</h4>
          <p className="sub-title-page mb-2">
            Use images to enrich your content and explain topics clearly.
            Discover how to apply them to your posts!
          </p>
          <Button appearance="primary" size="small">
            Get Started
          </Button>
        </ContainerItem>

        <ContainerItem
          sm={4}
          md={4}
          xl={6}
          className="card d-flex flex-column gap-1"
        >
          <h4 className="weight-500">Developer Tools</h4>
          <p className="sub-title-page mb-2">
            Developer Tools help manage API keys, allowing you to create, edit,
            and monitor your credentials securely.
          </p>
          <Button appearance="primary" size="small">
            Create Ruler
          </Button>
        </ContainerItem>
      </Container>

      <Table
        title="API Integrations"
        columns={headers}
        tableId="api-keys"
        className="card-content mt-5"
        disableExport
        disableColumnMenu
        disableColumnFilter
        disableColumnResize
        hideFooter
      >
        {apis?.map((api, index) => (
          <Tr key={index} id={index}>
            <Td>{api?.label}</Td>
            <Td>
              <div className="d-flex align-items-center gap-1">
                {api?.apiKey}
                <MdOutlineContentCopy className="u-pointer" />
              </div>
            </Td>
            <Td>{formatValue(api?.dailyCalls, 'number')}</Td>
            <Td>{formatDate(api?.created, 'DD/MM/YYYY')}</Td>
            <Td>
              <Toggle isChecked={api?.status ? true : false} />
            </Td>
          </Tr>
        ))}
      </Table>
    </div>
  )
}
