import { brMill } from '@react-jvectormap/brazil'
import { caMill } from '@react-jvectormap/canada'
import { VectorMap } from '@react-jvectormap/core'
import { usMill } from '@react-jvectormap/unitedstates'
import { worldMill } from '@react-jvectormap/world'
import React, { useEffect, useRef, useState } from 'react'

import { useFormatValue } from '../../../hooks/useFormatValue'
import { useTheme } from '../../../hooks/useTheme'

import { Dropdown, DropdownContent, DropdownItem } from '../../BaseUI/Dropdown'

import styles from './Map.module.scss'

export default function Maps({
  title,
  map,
  data,
  filter,
  showLabels = false,
  className,
  content,
}) {
  const [selectedMap, setSelectedMap] = useState({
    label: 'Brasil',
    value: 'brazil',
  })
  const [series, setSeries] = useState(null)
  const [regionStyle, setRegionStyle] = useState(null)

  const theme = useTheme()
  const formatValue = useFormatValue

  const mapRef = useRef(null)

  useEffect(() => {
    if (filter?.length) setSelectedMap(filter[0])
  }, [filter])

  useEffect(() => {
    setSeries(map !== 'word' ? data?.seriesByRegion[map] : data?.series)
  }, [data])

  useEffect(() => {
    setRegionStyle({
      initial: {
        fill: theme === 'dark' ? '#586595' : '#e9ebf2',
      },
      hover: { fill: theme === 'dark' ? '#3F486B' : '#D3D7E5' },
    })

    getSeries()
  }, [theme])

  const maps = {
    word: worldMill,
    brazil: brMill,
    unitedStates: usMill,
    canada: caMill,
  }

  const onRegionTipShow = (e, el, code) => {
    const value = series?.regions[0]?.values[code]

    if (!value) return

    el.html(
      `${el[0]?.innerText}: ${formatValue(value, 'number')} ${content || ''}`
    )
  }

  const handleClick = option => {
    const values =
      option?.value !== 'word'
        ? data?.seriesByRegion[option.value]
        : data?.series

    setSeries(values)
    setSelectedMap(option)
  }

  const getSeries = () => {
    const values = series
    if (values?.regions?.length)
      values.regions[0].scale = [theme === 'dark' ? '#3F486B' : '#BEC4D9']

    return values
  }

  const RenderMap = ({ map }) => {
    return (
      <VectorMap
        key={map}
        mapRef={mapRef}
        map={maps[map] || worldMill}
        className={styles['vector__map']}
        regionStyle={data?.regionStyle || regionStyle}
        zoomOnScroll={false}
        series={{ ...getSeries() }}
        onRegionTipShow={(e, el, code) => onRegionTipShow(e, el, code)}
        regionLabelStyle={{
          initial: {
            fill: '#162949',
            'font-weight': 'normal',
            'font-size': '10',
          },
        }}
        labels={
          showLabels
            ? {
                regions: {
                  render: function (code) {
                    return code.toUpperCase()
                  },
                },
              }
            : undefined
        }
      />
    )
  }

  return (
    <div className={`${styles['map-container']} ${className}`}>
      <div className={styles['map-container__header']}>
        <span className={styles['title']}>{title}</span>

        {filter && (
          <div>
            <Dropdown
              trigger={
                <div className={styles['filter__dropdown']}>
                  {selectedMap?.label}
                </div>
              }
              placement="right"
            >
              <DropdownContent>
                {filter?.map((option, index) => (
                  <DropdownItem key={index} onClick={() => handleClick(option)}>
                    {option?.label}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          </div>
        )}
      </div>

      <RenderMap map={filter?.length ? selectedMap?.value : map} />
    </div>
  )
}
