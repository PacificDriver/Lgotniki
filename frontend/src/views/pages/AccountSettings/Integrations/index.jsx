import React from 'react'

import { integrations } from './data'

import styles from './Integrations.module.scss'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'
import Avatar from '../../../../components/CustomUI/Avatar'
import Button from '../../../../components/BaseUI/Button'
import Toggle from '../../../../components/BaseUI/Toggle'

export default function Integrations() {
  return (
    <div className={`${styles['integrations']} px-3`}>
      <div className="d-flex align-items-end justify-content-between gap-5">
        <div>
          <h4 className="title-page">Integrations</h4>
          <p className="sub-title-page">
            Optimize your work with advanced integrations that connect tools and
            automate processes.
          </p>
        </div>

        <Button appearance="primary" size="small">
          Add new integration
        </Button>
      </div>

      <Container className="mt-5">
        {integrations?.map((integration, index) => (
          <ContainerItem
            key={index}
            sm={4}
            md={4}
            xl={4}
            className={styles['integration-card']}
          >
            <div className={styles['integration-card__header']}>
              <Avatar
                appearance="square"
                src={integration?.image}
                name={integration?.name}
              />
            </div>

            <div className={styles['integration-card__body']}>
              <span className={styles['integration-card__body__name']}>
                {integration?.name}
              </span>
              <p className={styles['integration-card__body__description']}>
                {integration?.description}
              </p>
            </div>

            <div className={styles['integration-card__footer']}>
              <Button appearance="neutral" size="small">
                Configure
              </Button>
              <Toggle isChecked={integration?.isConnected ? true : false} />
            </div>
          </ContainerItem>
        ))}
      </Container>
    </div>
  )
}
