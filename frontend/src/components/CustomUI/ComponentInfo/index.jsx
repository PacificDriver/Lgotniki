import React, { useRef, useEffect, useState } from 'react'
import CodeSnippet from '../CodeSnippet'

import { MdKeyboardArrowDown } from 'react-icons/md'
import { MdKeyboardArrowUp } from 'react-icons/md'

import './style.scss'

export const ComponentInfo = ({ title, children }) => {
  const description = children?.filter(
    child => child?.type?.name === 'Description'
  )[0]

  return (
    <div className="components-container">
      <h3
        className={`components-container--title ${description ? 'mb-3' : 'mb-0'}`}
      >
        {title}
      </h3>
      <div>{description}</div>

      <div className="components-container__content">
        {children?.slice(description ? 1 : 0, 3)}
      </div>
    </div>
  )
}

export const Description = ({ children }) => (
  <div className="components-container--description">{children}</div>
)

export const Preview = ({ children }) => <div className="p-4">{children}</div>

export const Snippet = ({ children }) => {
  const [hideContent, setHideContent] = useState(true)
  const [showMore, setShowMore] = useState(false)

  const snippetRef = useRef(null)

  useEffect(() => {
    if (snippetRef?.current) return

    setHideContent(snippetRef.current.offsetHeight > 250 ? true : false)
  }, [])

  return (
    <div
      ref={snippetRef}
      className="components-container__snippet"
      style={{
        height: hideContent && !showMore ? '250px' : 'auto',
      }}
    >
      <CodeSnippet>{children}</CodeSnippet>

      <div
        className="components-container__snippet--show-more"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? 'Mostrar menos' : 'Mostrar mais'}

        {showMore ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
      </div>

      {!showMore && (
        <div className="components-container__snippet--cover"></div>
      )}
    </div>
  )
}
