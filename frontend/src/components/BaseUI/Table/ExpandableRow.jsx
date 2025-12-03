import React, { useState } from 'react'
import { Row as Tr, Cell as Td } from 'powerful-react-table'
import { FiChevronDown } from 'react-icons/fi'
import './ExpandableRow.scss'

export default function ExpandableRow({
  children,
  expandableContent,
  id,
  onClick,
  onExpand,
  onDoubleClick,
  ...props
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleRowClick = e => {
    // Проверяем, что событие существует
    if (!e || !e.target) return

    // Не раскрываем, если клик был по кнопке или ссылке
    if (
      e.target.closest('button') ||
      e.target.closest('a') ||
      e.target.closest('.expandable-row-actions')
    ) {
      return
    }

    const newExpandedState = !isExpanded
    setIsExpanded(newExpandedState)
    if (onExpand) {
      onExpand(id, newExpandedState)
    }
    if (onClick) {
      onClick(e)
    }
  }

  const handleDoubleClickEvent = e => {
    // Проверяем, что событие существует
    if (!e || !e.target) return

    // Не обрабатываем двойной клик, если клик был по кнопке или ссылке
    if (
      e.target.closest('button') ||
      e.target.closest('a') ||
      e.target.closest('.expandable-row-actions')
    ) {
      return
    }

    if (onDoubleClick) {
      onDoubleClick(id, e)
    }
  }

  return (
    <>
      <Tr
        {...props}
        id={id}
        className={`expandable-row ${isExpanded ? 'expanded' : ''}`}
        onClick={handleRowClick}
        onDoubleClick={handleDoubleClickEvent}
        style={{ cursor: 'pointer', ...props.style }}
      >
        {React.Children.map(children, (child, index) => {
          // Добавляем иконку раскрытия в первую ячейку
          if (index === 0 && React.isValidElement(child)) {
            return (
              <Td {...child.props} className="expandable-row-first-cell">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FiChevronDown
                    className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                    style={{ fontSize: '16px', transition: 'transform 0.3s' }}
                  />
                  {child.props.children}
                </div>
              </Td>
            )
          }
          // Оборачиваем действия в div, чтобы предотвратить раскрытие при клике
          if (index === children.length - 1 && React.isValidElement(child)) {
            return (
              <Td
                {...child.props}
                className="expandable-row-actions"
                onClick={e => e.stopPropagation()}
              >
                {child.props.children}
              </Td>
            )
          }
          return child
        })}
      </Tr>
      {isExpanded && expandableContent && (
        <tr className="expandable-row-content">
          <td colSpan={React.Children.count(children)}>
            <div className="expandable-content-wrapper">
              {expandableContent}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
