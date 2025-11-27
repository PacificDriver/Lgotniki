import React from 'react'

import AppPage from '../../../components/CustomUI/AppPage'
import CardContainer from '../../../components/CustomUI/CardContainer'

import './style.scss'

export default function Colors() {
  const breadcrumbs = [
    { label: 'Magnun', url: '' },
    { label: 'Base UI', url: '' },
    { label: 'Color Pallete' },
  ]

  const numbers = [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

  return (
    <AppPage title="Color Pallete" breadcrumbs={breadcrumbs}>
      <CardContainer className="p-3">
        <div className="mb-3">
          <p className="mb-2">Primary</p>
          <div className="color-pallete">
            {numbers?.slice(3, 14)?.map((number, index) => (
              <div
                key={index}
                className={`color-pallete__primary color-pallete__primary--variacao${number}`}
              >
                Aa
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <p className="mb-2">Success</p>
          <div className="color-pallete">
            {numbers?.slice(3, 14)?.map((number, index) => (
              <div
                key={index}
                className={`color-pallete__success color-pallete__success--variacao${number}`}
              >
                Aa
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <p className="mb-2">Warning</p>
          <div className="color-pallete">
            {numbers?.slice(3, 14)?.map((number, index) => (
              <div
                key={index}
                className={`color-pallete__warning color-pallete__warning--variacao${number}`}
              >
                Aa
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <p className="mb-2">Danger</p>
          <div className="color-pallete">
            {numbers?.slice(3, 14)?.map((number, index) => (
              <div
                key={index}
                className={`color-pallete__danger color-pallete__danger--variacao${number}`}
              >
                Aa
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <p className="mb-2">Neutral</p>
          <div className="color-pallete">
            {numbers?.map((number, index) => (
              <div
                key={index}
                className={`color-pallete__neutral color-pallete__neutral--variacao${number}`}
              >
                Aa
              </div>
            ))}
          </div>
        </div>
      </CardContainer>
    </AppPage>
  )
}
