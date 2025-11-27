import React, { useState } from 'react'

import styles from './Toggle.module.scss'

export default function Toggle({ label, isChecked, onChecked }) {
  const [toggled, setToggled] = useState(isChecked || false)

  return (
    <div className={styles['toggle-container']}>
      <label
        className={styles['toggle-container__content']}
        aria-labelledby={label}
      >
        <input
          type="checkbox"
          className={styles['input']}
          checked={toggled}
          onChange={() => {
            setToggled(!toggled)
            onChecked?.(!toggled)
          }}
        />
        <span className={styles['slider']}></span>
      </label>
    </div>
  )
}
